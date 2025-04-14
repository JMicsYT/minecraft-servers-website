const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');

router.get('/', authMiddleware, serverController.getServers);
router.get('/:serverId', authMiddleware, serverController.getServerById);
router.post('/admin/servers', authMiddleware, adminMiddleware, serverController.addServer);
router.put('/admin/servers/:serverId', authMiddleware, adminMiddleware, serverController.editServer);
router.delete('/admin/servers/:serverId', authMiddleware, adminMiddleware, serverController.deleteServer); // Добавляем маршрут для удаления сервера
app.use('/api/admin', adminRoutes);

module.exports = router;