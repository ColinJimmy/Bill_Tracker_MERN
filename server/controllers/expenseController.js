const Expense = require('../models/Expense');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const { validationResult } = require('express-validator');

// Upload and process bill
exports.uploadBill = async (req, res) => {
  try {
    console.log('📤 Starting bill upload process...');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.userId;
    const imagePath = req.file.path;
    
    console.log('👤 User ID:', userId);
    console.log('📁 File path:', imagePath);
    console.log('📄 File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Extract text using OCR
    console.log('🔍 Starting OCR extraction...');
    const extractedText = await ocrService.extractText(imagePath);
    console.log('✅ OCR completed. Text length:', extractedText.length);
    console.log('📄 Extracted text preview:', extractedText.substring(0, 200) + '...');
    
    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Could not extract text from image',
        message: 'Please ensure the image is clear and contains readable text'
      });
    }
    
    // Process with AI to get structured data
    console.log('🤖 Starting AI processing...');
    const aiResponse = await aiService.processBillData(extractedText);
    console.log('✅ AI processing completed:', aiResponse);
    
    // Validate AI response
    if (!aiResponse || typeof aiResponse.amount !== 'number' || aiResponse.amount < 0) {
      console.log('⚠️ Invalid AI response, using fallback');
      return res.status(400).json({
        error: 'Could not process bill data',
        message: 'Please try with a clearer image or manually enter the expense'
      });
    }
    
    // Create expense record
    console.log('💾 Creating expense record...');
    const expense = new Expense({
      userId,
      title: aiResponse.title || 'Unknown Expense',
      amount: aiResponse.amount || 0,
      category: aiResponse.category || 'Other',
      date: aiResponse.date || new Date(),
      description: aiResponse.description || '',
      merchant: aiResponse.merchant || '',
      paymentMethod: aiResponse.paymentMethod || 'Other',
      originalText: extractedText,
      aiSummary: aiResponse.summary || '',
      imageUrl: imagePath,
      lineItems: aiResponse.lineItems || []
    });

    await expense.save();
    console.log('✅ Expense saved successfully:', expense._id);

    res.status(201).json({
      message: 'Bill processed successfully',
      expense: {
        _id: expense._id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description,
        merchant: expense.merchant,
        paymentMethod: expense.paymentMethod,
        aiSummary: expense.aiSummary,
        lineItems: expense.lineItems,
        createdAt: expense.createdAt
      },
      extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
      aiResponse: {
        ...aiResponse,
        processingTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Upload bill error:', error);
    
    // Provide specific error messages based on error type
    if (error.message && error.message.includes('OCR')) {
      return res.status(500).json({ 
        error: 'OCR processing failed',
        message: 'Could not extract text from the image. Please try with a clearer image.'
      });
    }
    
    if (error.message && error.message.includes('AI')) {
      return res.status(500).json({ 
        error: 'AI processing failed',
        message: 'Could not analyze the bill content. Please try again or enter manually.'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process bill',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
};

// Get all expenses for user
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    
    const query = { userId };
    
    // Add filters
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// Get expense statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'month' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Category-wise expenses
    const categoryStats = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      categoryStats,
      totalExpenses: totalExpenses[0] || { total: 0, count: 0 },
      period,
      startDate,
      endDate
    });
  } catch (error) {
    console.error('Get expense stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.userId;
    
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
