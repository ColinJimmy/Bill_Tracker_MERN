const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');

class OCRService {
  async extractText(imagePath) {
    try {
      console.log('🔍 Starting OCR extraction for:', imagePath);
      
      // Preprocess image for better OCR accuracy
      const processedImagePath = await this.preprocessImage(imagePath);
      console.log('🖼️ Image preprocessed:', processedImagePath);
      
      // Extract text using Tesseract with better configuration
      const { data: { text, confidence } } = await Tesseract.recognize(
        processedImagePath,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
          tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,:-$()/',
          tessedit_pageseg_mode: Tesseract.PSM.AUTO
        }
      );

      console.log(`✅ OCR completed with confidence: ${confidence}%`);
      console.log(`📄 Extracted text length: ${text.length} characters`);

      // Clean up processed image
      if (processedImagePath !== imagePath) {
        try {
          fs.unlinkSync(processedImagePath);
          console.log('🗑️ Cleaned up processed image');
        } catch (cleanupError) {
          console.log('⚠️ Could not clean up processed image:', cleanupError.message);
        }
      }

      // Clean and validate extracted text
      const cleanedText = this.cleanExtractedText(text);
      
      if (cleanedText.length < 10) {
        throw new Error('Extracted text is too short or empty');
      }

      return cleanedText;
    } catch (error) {
      console.error('❌ OCR extraction error:', error);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  }

  cleanExtractedText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .replace(/[^\w\s.,:$()\/\n-]/g, '') // Remove special characters except common ones (fixed regex)
      .trim();
  }

  async preprocessImage(imagePath) {
    try {
      const outputPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');
      
      await sharp(imagePath)
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .greyscale()
        .normalize()
        .sharpen({ sigma: 1.5 })
        .threshold(128)
        .jpeg({ quality: 95 })
        .toFile(outputPath);
      
      console.log('🖼️ Image preprocessing completed');
      return outputPath;
    } catch (error) {
      console.error('⚠️ Image preprocessing error:', error);
      return imagePath; // Return original if preprocessing fails
    }
  }

  // Extract specific patterns from text
  extractPatterns(text) {
    const patterns = {
      amounts: text.match(/\$?\d+\.?\d*/g) || [],
      dates: text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g) || [],
      emails: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [],
      phones: text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || []
    };
    
    return patterns;
  }
}

module.exports = new OCRService();
