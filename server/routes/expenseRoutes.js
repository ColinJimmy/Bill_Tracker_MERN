const express = require('express');
const { body } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Upload and process bill
router.post('/upload', upload.single('bill'), expenseController.uploadBill);

// Get all expenses
router.get('/', expenseController.getExpenses);

// Get expense statistics
router.get('/stats', expenseController.getExpenseStats);

// Update expense
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('amount').optional().isNumeric({ min: 0 }),
  body('category').optional().isIn(['Food', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'])
], expenseController.updateExpense);

// Delete expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
