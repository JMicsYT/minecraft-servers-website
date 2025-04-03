const server = require('../server');
const pool = server.pool;

const getNewsList = async (req, res) => {
  try {
    const query = 'SELECT id, title, created_at FROM news ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.status(200).json({ news: result.rows });
  } catch (error) {
    console.error('Ошибка при получении списка новостей:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении списка новостей.' });
  }
};

const getNewsById = async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const query = 'SELECT * FROM news WHERE id = $1';
    const result = await pool.query(query, [newsId]);
    const newsItem = result.rows[0];
    if (newsItem) {
      res.status(200).json({ news: newsItem });
    } else {
      res.status(404).json({ message: 'Новость не найдена.' });
    }
  } catch (error) {
    console.error(`Ошибка при получении новости с ID ${newsId}:`, error);
    res.status(500).json({ message: 'Произошла ошибка при получении новости.' });
  }
};

const addNews = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.userId; // Получаем ID автора из middleware аутентификации

  if (!title || !content) {
    return res.status(400).json({ message: 'Пожалуйста, укажите заголовок и содержание новости.' });
  }

  try {
    const query = 'INSERT INTO news (title, content, author_id) VALUES ($1, $2, $3) RETURNING id, title, content, created_at';
    const values = [title, content, authorId];
    const result = await pool.query(query, values);
    const newNews = result.rows[0];
    res.status(201).json({ message: 'Новость успешно добавлена.', news: newNews });
  } catch (error) {
    console.error('Ошибка при добавлении новости:', error);
    res.status(500).json({ message: 'Произошла ошибка при добавлении новости.' });
  }
};

const editNews = async (req, res) => {
  const newsId = req.params.newsId;
  const { title, content } = req.body;

  try {
    const query = 'UPDATE news SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING id, title, content, updated_at';
    const values = [title, content, newsId];
    const result = await pool.query(query, values);
    const updatedNews = result.rows[0];
    if (updatedNews) {
      res.status(200).json({ message: 'Новость успешно обновлена.', news: updatedNews });
    } else {
      res.status(404).json({ message: 'Новость не найдена.' });
    }
  } catch (error) {
    console.error(`Ошибка при обновлении новости с ID ${newsId}:`, error);
    res.status(500).json({ message: 'Произошла ошибка при обновлении новости.' });
  }
};

const deleteNews = async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const query = 'DELETE FROM news WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [newsId]);
    const deletedNews = result.rows[0];
    if (deletedNews) {
      res.status(200).json({ message: `Новость с ID ${newsId} успешно удалена.`, deletedId: deletedNews.id });
    } else {
      res.status(404).json({ message: `Новость с ID ${newsId} не найдена.` });
    }
  } catch (error) {
    console.error(`Ошибка при удалении новости с ID ${newsId}:`, error);
    res.status(500).json({ message: 'Произошла ошибка при удалении новости.' });
  }
};

module.exports = { getNewsList, getNewsById, addNews, editNews, deleteNews };