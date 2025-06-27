const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async processBillData(extractedText) {
    try {
      console.log('🤖 Processing bill with AI...');
      console.log('📄 Extracted text length:', extractedText.length);
      console.log('📄 Sample text:', extractedText.substring(0, 200) + '...');

      if (!extractedText || extractedText.trim().length < 10) {
        console.log('⚠️ Extracted text is too short, using default response');
        return this.getDefaultResponse(extractedText);
      }

      // Pre-process text to extract total and items
      const preprocessedData = this.preprocessBillText(extractedText);
      console.log('🔍 Preprocessed data:', preprocessedData);

      const prompt = `
        You are an AI assistant specialized in analyzing receipts and bills. Analyze the following receipt/bill text and extract structured information in JSON format.

        Receipt/Bill Text:
        "${extractedText}"

        Preprocessed Information:
        - Detected Total Amount: $${preprocessedData.totalAmount}
        - Line Items Found: ${preprocessedData.lineItems.length}
        - Items: ${JSON.stringify(preprocessedData.lineItems)}

        Please analyze this text and provide a JSON response with exactly this structure:
        {
          "title": "Brief description of the expense (e.g., 'Grocery Shopping at [Merchant]', 'Gas Station Fill-up')",
          "amount": ${preprocessedData.totalAmount || 0} (use the detected total amount from preprocessing),
          "category": "Food|Transportation|Utilities|Healthcare|Entertainment|Shopping|Education|Other",
          "date": "YYYY-MM-DD format (extract from receipt, use today if not found)",
          "description": "List the main items purchased: [create from line items]",
          "merchant": "Store/company name (extract business name from receipt header)",
          "paymentMethod": "Cash|Credit Card|Debit Card|Bank Transfer|Other",
          "summary": "Natural language summary including merchant, total amount, and main items purchased",
          "lineItems": ${JSON.stringify(preprocessedData.lineItems)}
        }

        Rules:
        1. MUST use the preprocessed total amount (${preprocessedData.totalAmount}) as the amount field
        2. For category: Choose based on merchant type and items purchased
        3. For merchant: Look for business name in first 2-3 lines of receipt
        4. For description: Create from the line items detected
        5. For summary: Include merchant name, total amount, and key items
        6. Respond ONLY with valid JSON, no additional text

        Example response format:
        {
          "title": "Grocery Shopping at Walmart",
          "amount": 45.67,
          "category": "Food",
          "date": "2024-01-15",
          "description": "Milk $3.99, Bread $2.49, Apples $4.99, Tax $2.20",
          "merchant": "Walmart",
          "paymentMethod": "Credit Card",
          "summary": "Grocery shopping at Walmart for $45.67 including milk, bread, apples, and other items.",
          "lineItems": [{"item": "Milk", "price": 3.99}, {"item": "Bread", "price": 2.49}]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      console.log('🤖 AI Response received:', text.substring(0, 500) + '...');

      try {
        // Extract JSON from the response
        let jsonText = text;
        
        // Remove any markdown formatting or extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }

        // Remove any trailing commas before closing braces
        jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');

        console.log('🔍 Attempting to parse JSON...');
        const parsedData = JSON.parse(jsonText);
        
        // Ensure we use the preprocessed total amount
        parsedData.amount = preprocessedData.totalAmount || parsedData.amount || 0;
        parsedData.lineItems = preprocessedData.lineItems || parsedData.lineItems || [];
        
        console.log('✅ Successfully parsed AI response:', parsedData);
        
        // Validate and sanitize the response
        const validatedData = this.validateAndSanitize(parsedData, extractedText);
        console.log('✅ Validated data:', validatedData);
        
        return validatedData;
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        console.log('📄 Raw AI response:', text);
        
        // Use preprocessed data as fallback
        return this.createFromPreprocessedData(preprocessedData, extractedText);
      }
    } catch (error) {
      console.error('❌ AI processing error:', error);
      return this.getDefaultResponse(extractedText);
    }
  }

  preprocessBillText(text) {
    console.log('🔍 Preprocessing bill text for better extraction...');
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let totalAmount = 0;
    const lineItems = [];
    let merchant = 'Unknown';

    // Extract merchant from first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      if (line.length > 3 && line.length < 50 && !line.match(/^\d/) && !line.includes('$') && !line.match(/\d{2}\/\d{2}/)) {
        merchant = line;
        break;
      }
    }

    // Find total amount - look for "Total" keyword and nearby amounts
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Look for total-related keywords
      if (line.includes('total') || line.includes('amount due') || line.includes('balance') || line.includes('grand total')) {
        console.log('🎯 Found total line:', lines[i]);
        
        // Look for amount in the same line
        const amountInLine = this.extractAmountFromLine(lines[i]);
        if (amountInLine > 0) {
          totalAmount = amountInLine;
          console.log('💰 Total amount found in same line:', totalAmount);
          break;
        }
        
        // Look for amount in next line
        if (i + 1 < lines.length) {
          const amountInNextLine = this.extractAmountFromLine(lines[i + 1]);
          if (amountInNextLine > 0) {
            totalAmount = amountInNextLine;
            console.log('💰 Total amount found in next line:', totalAmount);
            break;
          }
        }
        
        // Look for amount in previous line
        if (i > 0) {
          const amountInPrevLine = this.extractAmountFromLine(lines[i - 1]);
          if (amountInPrevLine > 0) {
            totalAmount = amountInPrevLine;
            console.log('💰 Total amount found in previous line:', totalAmount);
            break;
          }
        }
      }
    }

    // If no total found with keywords, get the largest amount
    if (totalAmount === 0) {
      const allAmounts = [];
      for (const line of lines) {
        const amount = this.extractAmountFromLine(line);
        if (amount > 0) {
          allAmounts.push(amount);
        }
      }
      if (allAmounts.length > 0) {
        totalAmount = Math.max(...allAmounts);
        console.log('💰 Using largest amount as total:', totalAmount);
      }
    }

    // Extract line items (item name followed by price)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip lines that look like headers, totals, or payment info
      if (this.isHeaderOrFooterLine(line)) {
        continue;
      }

      const amount = this.extractAmountFromLine(line);
      if (amount > 0 && amount < totalAmount * 0.8) { // Item shouldn't be close to total
        // Try to extract item name from the same line
        let itemName = this.extractItemNameFromLine(line);
        
        // If no clear item name in same line, look at previous line
        if ((!itemName || itemName.length < 3) && i > 0) {
          const prevLine = lines[i - 1];
          if (!this.extractAmountFromLine(prevLine)) { // Previous line shouldn't have amount
            itemName = this.extractItemNameFromLine(prevLine) || itemName;
          }
        }

        if (itemName && itemName.length >= 2) {
          lineItems.push({
            item: itemName,
            price: amount
          });
          console.log('🛒 Found item:', itemName, '$' + amount);
        }
      }
    }

    return {
      totalAmount,
      lineItems,
      merchant,
      linesCount: lines.length
    };
  }

  extractAmountFromLine(line) {
    // Look for price patterns: $12.34, 12.34, $12, 12.00
    const pricePatterns = [
      /\$(\d+\.\d{2})/,           // $12.34
      /(\d+\.\d{2})(?!\d)/,       // 12.34 (not followed by more digits)
      /\$(\d+)(?!\d)/,            // $12 (not followed by more digits)
      /(\d+\.00)(?!\d)/           // 12.00
    ];

    for (const pattern of pricePatterns) {
      const match = line.match(pattern);
      if (match) {
        const amount = parseFloat(match[1]);
        if (amount > 0 && amount < 10000) { // Reasonable range
          return amount;
        }
      }
    }
    return 0;
  }

  extractItemNameFromLine(line) {
    // Remove price and clean up the line to get item name
    let itemName = line
      .replace(/\$?\d+\.\d{2}/g, '') // Remove prices
      .replace(/\$?\d+(?!\d)/g, '') // Remove other numbers
      .replace(/\s+/g, ' ') // Clean up spaces
      .trim();

    // Remove common non-item text
    itemName = itemName
      .replace(/^[-\s]*/, '') // Remove leading dashes/spaces
      .replace(/[-\s]*$/, '') // Remove trailing dashes/spaces
      .replace(/\b(qty|quantity|each|ea|x\d+)\b/gi, '') // Remove quantity indicators
      .trim();

    return itemName.length >= 2 ? itemName : null;
  }

  isHeaderOrFooterLine(line) {
    const lowerLine = line.toLowerCase();
    const headerFooterKeywords = [
      'receipt', 'invoice', 'total', 'subtotal', 'tax', 'discount',
      'payment', 'cash', 'credit', 'debit', 'change', 'thank you',
      'date', 'time', 'cashier', 'register', 'transaction',
      'address', 'phone', 'visit', 'welcome'
    ];

    return headerFooterKeywords.some(keyword => lowerLine.includes(keyword)) ||
           line.match(/^\d{2}\/\d{2}/) || // Date pattern
           line.match(/^\d{2}:\d{2}/) || // Time pattern
           line.length < 3; // Too short
  }

  createFromPreprocessedData(preprocessedData, extractedText) {
    console.log('🔧 Creating response from preprocessed data...');
    
    const category = this.categorizeByMerchant(preprocessedData.merchant, extractedText);
    
    // Create description from line items
    let description = '';
    if (preprocessedData.lineItems.length > 0) {
      description = preprocessedData.lineItems
        .map(item => `${item.item} $${item.price.toFixed(2)}`)
        .join(', ');
    } else {
      description = extractedText.substring(0, 150) + '...';
    }

    return {
      title: `${category} expense at ${preprocessedData.merchant}`,
      amount: preprocessedData.totalAmount,
      category: category,
      date: new Date().toISOString().split('T')[0],
      description: description,
      merchant: preprocessedData.merchant,
      paymentMethod: 'Other',
      summary: `Transaction at ${preprocessedData.merchant} for $${preprocessedData.totalAmount.toFixed(2)}${preprocessedData.lineItems.length > 0 ? ` including ${preprocessedData.lineItems.length} items` : ''}.`,
      lineItems: preprocessedData.lineItems
    };
  }

  validateAndSanitize(data, extractedText) {
    const validCategories = ['Food', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'];
    const validPaymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

    // Ensure amount is a valid number
    let amount = 0;
    if (typeof data.amount === 'number' && !isNaN(data.amount)) {
      amount = data.amount;
    } else if (typeof data.amount === 'string') {
      const numericAmount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericAmount)) {
        amount = numericAmount;
      }
    }

    // Ensure lineItems is an array
    let lineItems = [];
    if (Array.isArray(data.lineItems)) {
      lineItems = data.lineItems.filter(item => 
        item && typeof item === 'object' && item.item && typeof item.price === 'number'
      );
    }

    return {
      title: data.title || 'Processed Expense',
      amount: amount,
      category: validCategories.includes(data.category) ? data.category : 'Other',
      date: this.validateDate(data.date) || new Date().toISOString().split('T')[0],
      description: data.description || extractedText.substring(0, 200),
      merchant: data.merchant || 'Unknown',
      paymentMethod: validPaymentMethods.includes(data.paymentMethod) ? data.paymentMethod : 'Other',
      summary: data.summary || `Expense processed from receipt. Amount: $${amount.toFixed(2)}`,
      lineItems: lineItems
    };
  }

  validateDate(dateString) {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      return null;
    }
  }

  getDefaultResponse(extractedText) {
    console.log('🔧 Using default response...');
    
    // Try to extract basic information using regex
    const amounts = extractedText.match(/\$?(\d+\.?\d*)/g) || [];
    let amount = 0;
    
    if (amounts.length > 0) {
      // Try to find the largest amount (likely the total)
      const numericAmounts = amounts.map(a => parseFloat(a.replace('$', ''))).filter(a => !isNaN(a));
      if (numericAmounts.length > 0) {
        amount = Math.max(...numericAmounts);
      }
    }
    
    return {
      title: 'Receipt Processed',
      amount: amount,
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      description: extractedText.substring(0, 200) + (extractedText.length > 200 ? '...' : ''),
      merchant: 'Unknown',
      paymentMethod: 'Other',
      summary: `Receipt processed successfully. Amount: $${amount.toFixed(2)}. Please review and update details as needed.`
    };
  }

  async categorizeExpense(description, amount) {
    try {
      const prompt = `
        Categorize this expense into one of these categories: Food, Transportation, Utilities, Healthcare, Entertainment, Shopping, Education, Other
        
        Description: "${description}"
        Amount: ${amount}
        
        Respond with only the category name.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const category = response.text().trim();
      
      const validCategories = ['Food', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'];
      return validCategories.includes(category) ? category : 'Other';
    } catch (error) {
      console.error('Categorization error:', error);
      return 'Other';
    }
  }

  async generateMonthlySummary(expenses) {
    try {
      const expenseSummary = expenses.map(exp => 
        `${exp.category}: $${exp.amount} - ${exp.description}`
      ).join('\n');

      const prompt = `
        Generate a concise monthly expense summary based on these transactions:
        
        ${expenseSummary}
        
        Provide insights about spending patterns, top categories, and suggestions for budgeting.
        Keep it under 200 words.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Summary generation error:', error);
      return 'Unable to generate summary at this time.';
    }
  }
}

module.exports = new AIService();
