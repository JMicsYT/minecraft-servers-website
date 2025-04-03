const server = require('../server'); // Импортируем весь объект module.exports
const pool = server.pool;             // Получаем доступ к свойству pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
  const { login, email, password } = req.body;

  if (!login || !email || !password) {
    return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
  }

  try {
    // Проверяем, существует ли уже пользователь с таким логином или email
    const checkUserQuery = 'SELECT * FROM users WHERE login = $1 OR email = $2';
    const existingUser = await pool.query(checkUserQuery, [login, email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Пользователь с таким логином или email уже существует.' });
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Сохраняем нового пользователя в базу данных
    const insertUserQuery = 'INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING id, login, email';
    const newUser = await pool.query(insertUserQuery, [login, email, hashedPassword]);

    res.status(201).json({ message: 'Регистрация прошла успешно!', user: newUser.rows[0] });

  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ message: 'Произошла ошибка при регистрации.' });
  }
};

const login = async (req, res) => {
    const { login, password } = req.body;
  
    if (!login || !password) {
      return res.status(400).json({ message: 'Пожалуйста, введите логин и пароль.' });
    }
  
    try {
      // Находим пользователя по логину
      const findUserQuery = 'SELECT * FROM users WHERE login = $1';
      const userResult = await pool.query(findUserQuery, [login]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(401).json({ message: 'Неверный логин или пароль.' });
      }
  
      // Сравниваем введенный пароль с хешированным паролем из базы данных
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        // Генерируем JWT токен
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Вход выполнен успешно!', token });
      } else {
        res.status(401).json({ message: 'Неверный логин или пароль.' });
      }
  
    } catch (error) {
      console.error('Ошибка при входе пользователя:', error);
      res.status(500).json({ message: 'Произошла ошибка при входе.' });
    }
  };

  const me = async (req, res) => {
    try {
      // userId был добавлен в объект req middleware authMiddleware
      const userId = req.userId;
  
      // Находим пользователя по ID
      const findUserQuery = 'SELECT id, login, email FROM users WHERE id = $1';
      const userResult = await pool.query(findUserQuery, [userId]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден.' });
      }
  
      // Возвращаем информацию о пользователе (без пароля)
      res.status(200).json({ user });
  
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
      res.status(500).json({ message: 'Произошла ошибка при получении информации о пользователе.' });
    }
  };
  
  const logout = async (req, res) => {
    try {
      // На клиенте следует удалить токен
      res.status(200).json({ message: 'Выход выполнен успешно.' });
      // В реальном приложении здесь может быть логика добавления токена в черный список
    } catch (error) {
      console.error('Ошибка при выходе пользователя:', error);
      res.status(500).json({ message: 'Произошла ошибка при выходе.' });
    }
  };
  
  const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId; // Получаем ID пользователя из middleware аутентификации
  
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Пожалуйста, укажите старый и новый пароль.' });
    }
  
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Новый пароль должен быть не менее 6 символов.' });
    }
  
    try {
      // Находим пользователя по ID
      const findUserQuery = 'SELECT password FROM users WHERE id = $1';
      const userResult = await pool.query(findUserQuery, [userId]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден.' }); // Хотя userId должен быть валидным
      }
  
      // Сравниваем введенный старый пароль с хешированным паролем из базы данных
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  
      if (passwordMatch) {
        // Хешируем новый пароль
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
        // Обновляем пароль пользователя в базе данных
        const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id';
        await pool.query(updatePasswordQuery, [hashedPassword, userId]);
  
        res.status(200).json({ message: 'Пароль успешно изменен.' });
      } else {
        res.status(401).json({ message: 'Неверный старый пароль.' });
      }
  
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      res.status(500).json({ message: 'Произошла ошибка при изменении пароля.' });
    }
  };
  
  const subscribeToNews = async (req, res) => {
    const { category } = req.body;
    const userId = req.userId;
  
    if (!category) {
      return res.status(400).json({ message: 'Пожалуйста, укажите категорию для подписки.' });
    }
  
    try {
      const checkSubscriptionQuery = 'SELECT * FROM news_subscriptions WHERE user_id = $1 AND category = $2';
      const existingSubscription = await pool.query(checkSubscriptionQuery, [userId, category]);
  
      if (existingSubscription.rows.length > 0) {
        return res.status(409).json({ message: 'Вы уже подписаны на эту категорию новостей.' });
      }
  
      const subscribeQuery = 'INSERT INTO news_subscriptions (user_id, category) VALUES ($1, $2) RETURNING user_id, category, subscribed_at';
      const result = await pool.query(subscribeQuery, [userId, category]);
      res.status(201).json({ message: `Вы успешно подписались на новости категории "${category}".`, subscription: result.rows[0] });
  
    } catch (error) {
      console.error('Ошибка при подписке на новости:', error);
      res.status(500).json({ message: 'Произошла ошибка при подписке на новости.' });
    }
  };
  
  const unsubscribeFromNews = async (req, res) => {
    const { category } = req.body;
    const userId = req.userId;
  
    if (!category) {
      return res.status(400).json({ message: 'Пожалуйста, укажите категорию для отписки.' });
    }
  
    try {
      const unsubscribeQuery = 'DELETE FROM news_subscriptions WHERE user_id = $1 AND category = $2 RETURNING user_id, category';
      const result = await pool.query(unsubscribeQuery, [userId, category]);
  
      if (result.rows.length > 0) {
        res.status(200).json({ message: `Вы успешно отписались от новостей категории "${category}".` });
      } else {
        res.status(404).json({ message: 'Вы не были подписаны на эту категорию новостей.' });
      }
  
    } catch (error) {
      console.error('Ошибка при отписке от новостей:', error);
      res.status(500).json({ message: 'Произошла ошибка при отписке от новостей.' });
    }
  };
  
  const getUserNewsSubscriptions = async (req, res) => {
    const userId = req.userId;
  
    try {
      const getSubscriptionsQuery = 'SELECT category FROM news_subscriptions WHERE user_id = $1';
      const result = await pool.query(getSubscriptionsQuery, [userId]);
      const subscriptions = result.rows.map(row => row.category);
      res.status(200).json({ subscriptions });
    } catch (error) {
      console.error('Ошибка при получении подписок пользователя:', error);
      res.status(500).json({ message: 'Произошла ошибка при получении ваших подписок.' });
    }
  };
  
  const updateNotificationPreferences = async (req, res) => {
    const { category, notify_email } = req.body;
    const userId = req.userId;
  
    if (!category || typeof notify_email === 'undefined') {
      return res.status(400).json({ message: 'Пожалуйста, укажите категорию и предпочтение для уведомлений по email.' });
    }
  
    try {
      // Проверяем, существует ли уже запись для данного пользователя и категории
      const checkPreferenceQuery = 'SELECT * FROM notification_preferences WHERE user_id = $1 AND category = $2';
      const existingPreference = await pool.query(checkPreferenceQuery, [userId, category]);
  
      if (existingPreference.rows.length > 0) {
        // Обновляем существующую запись
        const updatePreferenceQuery = 'UPDATE notification_preferences SET notify_email = $1 WHERE user_id = $2 AND category = $3';
        await pool.query(updatePreferenceQuery, [notify_email, userId, category]);
        res.status(200).json({ message: `Настройки уведомлений для категории "${category}" успешно обновлены.` });
      } else {
        // Создаем новую запись
        const createPreferenceQuery = 'INSERT INTO notification_preferences (user_id, category, notify_email) VALUES ($1, $2, $3)';
        await pool.query(createPreferenceQuery, [userId, category, notify_email]);
        res.status(201).json({ message: `Настройки уведомлений для категории "${category}" успешно сохранены.` });
      }
  
    } catch (error) {
      console.error('Ошибка при обновлении настроек уведомлений:', error);
      res.status(500).json({ message: 'Произошла ошибка при обновлении настроек уведомлений.' });
    }
  };
  
  const getUserNotificationPreferences = async (req, res) => {
    const userId = req.userId;
  
    try {
      const getPreferencesQuery = 'SELECT category, notify_email FROM notification_preferences WHERE user_id = $1';
      const result = await pool.query(getPreferencesQuery, [userId]);
      const preferences = result.rows;
      res.status(200).json({ notificationPreferences: preferences });
    } catch (error) {
      console.error('Ошибка при получении настроек уведомлений пользователя:', error);
      res.status(500).json({ message: 'Произошла ошибка при получении ваших настроек уведомлений.' });
    }
  };
  
  module.exports = { register, login, me, logout, changePassword, subscribeToNews, unsubscribeFromNews, getUserNewsSubscriptions, updateNotificationPreferences, getUserNotificationPreferences }; // Экспортируем новые функции