// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Маршрут для назначения роли пользователю (требует прав главного администратора)
router.put('/users/:userId/role', authMiddleware, roleMiddleware(['superadmin']), adminController.setUserRole);

module.exports = router;