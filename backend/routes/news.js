const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Публичные маршруты для просмотра новостей
router.get('/', newsController.getNewsList);
router.get('/:newsId', newsController.getNewsById);

// Административные маршруты для управления новостями (требуют аутентификации администратора)
router.post('/admin/news', authMiddleware, adminMiddleware, newsController.addNews);
router.put('/admin/news/:newsId', authMiddleware, adminMiddleware, newsController.editNews);
router.delete('/admin/news/:newsId', authMiddleware, adminMiddleware, newsController.deleteNews);

module.exports = router;