const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get dashboard data for the authenticated user
router.get('/dashboard', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.userId });
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Format expenses by category
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const expensesByCategory = Object.entries(categoryTotals).map(([category, total]) => ({
            category,
            total
        }));

        // Format expenses by month
        const currentYear = new Date().getFullYear();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Initialize all months with zero
        const monthTotals = monthNames.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
        }, {});

        // Add actual expenses
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getFullYear() === currentYear) {
                const month = expenseDate.toLocaleString('default', { month: 'long' });
                monthTotals[month] = (monthTotals[month] || 0) + expense.amount;
            }
        });

        const expensesByMonth = Object.entries(monthTotals).map(([month, total]) => ({
            month,
            total
        }));

        res.json({
            totalExpenses,
            expensesByCategory,
            expensesByMonth
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new expense
router.post('/', auth, async (req, res) => {
    try {
        const expense = new Expense({
            ...req.body,
            user: req.userId
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Error creating expense', error: error.message });
    }
});

// Get single expense
router.get('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Error updating expense', error: error.message });
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 