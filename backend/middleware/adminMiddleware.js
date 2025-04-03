const server = require('../server');
const pool = server.pool;

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.userId; // userId должен быть установлен authMiddleware

    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован.' });
    }

    const checkAdminQuery = 'SELECT is_admin FROM users WHERE id = $1';
    const userResult = await pool.query(checkAdminQuery, [userId]);
    const user = userResult.rows[0];

    if (user && user.is_admin) {
      // Пользователь является администратором, разрешаем доступ
      next();
    } else {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    }

  } catch (error) {
    console.error('Ошибка при проверке прав администратора:', error);
    res.status(500).json({ message: 'Произошла ошибка при проверке прав администратора.' });
  }
};

module.exports = adminMiddleware;