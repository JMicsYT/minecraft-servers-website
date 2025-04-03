const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../controllers/authController').upload;

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);
router.post('/me/password', authMiddleware, authController.changePassword);
router.post('/me/news-subscriptions', authMiddleware, authController.subscribeToNews);
router.delete('/me/news-subscriptions', authMiddleware, authController.unsubscribeFromNews);
router.get('/me/news-subscriptions', authMiddleware, authController.getUserNewsSubscriptions);
router.post('/me/notifications', authMiddleware, authController.updateNotificationPreferences);
router.get('/me/notifications', authMiddleware, authController.getUserNotificationPreferences);
router.post('/verify-email', authController.verifyEmail); // Добавляем маршрут для верификации email
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/me/profile', authMiddleware, authController.getUserProfile);
router.put('/me/profile', authMiddleware, authController.updateUserProfile);

module.exports = router;