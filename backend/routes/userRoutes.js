const express = require('express');
const { getUserProfile, userTransaction, allTransaction, setBudget, checkBudget,updateTransaction,deleteTransaction, userImage, dateTransaction, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.post('/transaction', authMiddleware, userTransaction);
router.put('/edit', authMiddleware, updateProfile);
router.get('/get/transaction', authMiddleware, allTransaction);
router.post('/set-budget', authMiddleware, setBudget);
router.post('/check-budget', authMiddleware, checkBudget);
router.put('/update',authMiddleware, userImage);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
router.get("/date/transaction",authMiddleware,dateTransaction)
module.exports = router;
