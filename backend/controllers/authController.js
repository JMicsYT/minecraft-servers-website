const server = require('../server');
const pool = server.pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');


const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Пожалуйста, укажите имя пользователя, email и пароль.' });
  }

  try {
    // Проверяем, существует ли уже пользователь с таким login или email
    const checkUserQuery = 'SELECT * FROM users WHERE login = $1 OR email = $2'; // Используем login вместо username
    const existingUser = await pool.query(checkUserQuery, [username, email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Пользователь с таким логином или email уже существует.' });
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Генерируем код верификации
    const verificationCode = crypto.randomBytes(20).toString('hex');

    // Сохраняем пользователя и код верификации в базу данных
    const query = 'INSERT INTO users (login, email, password, verification_code) VALUES ($1, $2, $3, $4) RETURNING id'; // Используем login вместо username
    const values = [username, email, hashedPassword, verificationCode];
    const result = await pool.query(query, values);
    const userId = result.rows[0].id;

    // Отправляем письмо с кодом верификации
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Регистрация почти завершена. Проверьте ваш email для верификации.' });

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

const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    // Настройки вашего почтового сервиса (пример для Mailtrap)
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '7ec3e173175dc1',
      pass: '41fe74d414eea5'
    }
  });

  const mailOptions = {
    from: 'your_email@example.com', // Замените на ваш email
    to: email,
    subject: 'Верификация email',
    text: `Ваш код верификации: ${verificationCode}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Письмо с кодом верификации отправлено на ${email}`);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return res.status(400).json({ message: 'Пожалуйста, укажите код верификации.' });
  }

  try {
    // Ищем пользователя с указанным кодом верификации
    const findUserQuery = 'SELECT id FROM users WHERE verification_code = $1';
    const userResult = await pool.query(findUserQuery, [verificationCode]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Неверный код верификации.' });
    }

    // Активируем учетную запись пользователя
    const activateUserQuery = 'UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE id = $1';
    await pool.query(activateUserQuery, [user.id]);

    res.status(200).json({ message: 'Email успешно верифицирован. Ваша учетная запись активирована.' });

  } catch (error) {
    console.error('Ошибка при верификации email:', error);
    res.status(500).json({ message: 'Произошла ошибка при верификации email.' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Пожалуйста, укажите ваш email.' });
  }

  try {
    // Проверяем, существует ли пользователь с таким email
    const findUserQuery = 'SELECT id FROM users WHERE email = $1';
    const userResult = await pool.query(findUserQuery, [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Пользователь с таким email не найден.' });
    }

    // Генерируем токен восстановления пароля
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 час

    // Сохраняем токен в базу данных
    const insertTokenQuery = 'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)';
    await pool.query(insertTokenQuery, [email, token, expiresAt]);

    // Отправляем email с ссылкой на сброс пароля
    const resetLink = `http://your-app.com/reset-password?token=${token}`; // Замените на ваш URL
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Инструкции по восстановлению пароля отправлены на ваш email.' });

  } catch (error) {
    console.error('Ошибка при запросе восстановления пароля:', error);
    res.status(500).json({ message: 'Произошла ошибка при запросе восстановления пароля.' });
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    // Настройки вашего почтового сервиса (пример для Mailtrap)
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '7ec3e173175dc1',
      pass: '41fe74d414eea5'
    }
  });

  const mailOptions = {
    from: 'support@myapp.com', // Замените на ваш email
    to: email,
    subject: 'Восстановление пароля',
    text: `Перейдите по ссылке для сброса пароля: ${resetLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Письмо с ссылкой на сброс пароля отправлено на ${email}`);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Пожалуйста, укажите токен и новый пароль.' });
  }

  try {
    // Проверяем, существует ли токен и не истек ли его срок действия
    const findTokenQuery = 'SELECT email FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()';
    const tokenResult = await pool.query(findTokenQuery, [token]);
    const tokenData = tokenResult.rows[0];

    if (!tokenData) {
      return res.status(400).json({ message: 'Неверный или устаревший токен.' });
    }

    // Хешируем новый пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Обновляем пароль пользователя в базе данных
    const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    await pool.query(updatePasswordQuery, [hashedPassword, tokenData.email]);

    // Удаляем токен из базы данных
    const deleteTokenQuery = 'DELETE FROM password_reset_tokens WHERE token = $1';
    await pool.query(deleteTokenQuery, [token]);

    res.status(200).json({ message: 'Пароль успешно сброшен.' });

  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    res.status(500).json({ message: 'Произошла ошибка при сбросе пароля.' });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.userId; // Получаем ID пользователя из middleware аутентификации

  try {
    const query = 'SELECT id, login, email, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении профиля пользователя.' });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.userId; // Получаем ID пользователя из middleware аутентификации
  const { login, email } = req.body;

  if (!login || !email) {
    return res.status(400).json({ message: 'Пожалуйста, укажите логин и email.' });
  }

  try {
    const query = 'UPDATE users SET login = $1, email = $2 WHERE id = $3 RETURNING id, login, email';
    const result = await pool.query(query, [login, email, userId]);
    const updatedUser = result.rows[0];

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: 'Профиль пользователя успешно обновлен.', user: updatedUser });

  } catch (error) {
    console.error('Ошибка при обновлении профиля пользователя:', error);
    res.status(500).json({ message: 'Произошла ошибка при обновлении профиля пользователя.' });
  }
};

module.exports = { register, login, me, logout, changePassword, subscribeToNews, unsubscribeFromNews, getUserNewsSubscriptions, updateNotificationPreferences, getUserNotificationPreferences, requestPasswordReset, resetPassword, verifyEmail, getUserProfile, updateUserProfile,};