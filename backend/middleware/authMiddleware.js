const jwt = require('jsonwebtoken');
const server = require('../server');
const pool = server.pool;

const authMiddleware = async (req, res, next) => {
  // Получаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Прикрепляем userId к объекту запроса для дальнейшего использования
      req.userId = decoded.userId;

      // Переходим к следующему middleware или обработчику маршрута
      next();

    } catch (error) {
      return res.status(401).json({ message: 'Невалидный токен.' });
    }
  } else {
    return res.status(401).json({ message: 'Токен не найден.' });
  }
};

module.exports = authMiddleware;