// controllers/newsController.js
const News = require('../models/news');

const getNewsList = async (req, res) => {
    try {
        const news = await News.getAll();
        res.status(200).json({ news });
    } catch (error) {
        console.error('Ошибка при получении списка новостей:', error);
        res.status(500).json({ message: 'Произошла ошибка при получении списка новостей.' });
    }
};

const getNewsById = async (req, res) => {
    const { newsId } = req.params;

    try {
        const news = await News.getById(newsId);
        if (!news) {
            return res.status(404).json({ message: 'Новость не найдена.' });
        }
        res.status(200).json({ news });
    } catch (error) {
        console.error(`Ошибка при получении новости с ID ${newsId}:`, error);
        res.status(500).json({ message: 'Произошла ошибка при получении новости.' });
    }
};

const addNews = async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.userId;

    if (!title || !content) {
        return res.status(400).json({ message: 'Пожалуйста, укажите заголовок и содержание новости.' });
    }

    try {
        const newNews = await News.create(title, content, authorId);
        res.status(201).json({ message: 'Новость успешно добавлена.', news: newNews });
    } catch (error) {
        console.error('Ошибка при добавлении новости:', error);
        res.status(500).json({ message: 'Произошла ошибка при добавлении новости.' });
    }
};

const editNews = async (req, res) => {
    const { newsId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Пожалуйста, укажите заголовок и содержание новости.' });
    }

    try {
        const updatedNews = await News.update(newsId, title, content);
        if (!updatedNews) {
            return res.status(404).json({ message: 'Новость не найдена.' });
        }
        res.status(200).json({ message: 'Новость успешно обновлена.', news: updatedNews });
    } catch (error) {
        console.error(`Ошибка при обновлении новости с ID ${newsId}:`, error);
        res.status(500).json({ message: 'Произошла ошибка при обновлении новости.' });
    }
};

const deleteNews = async (req, res) => {
    const { newsId } = req.params;

    try {
        const deletedNews = await News.delete(newsId);
        if (!deletedNews) {
            return res.status(404).json({ message: 'Новость не найдена.' });
        }
        res.status(200).json({ message: `Новость с ID ${newsId} успешно удалена.`, deletedId: deletedNews.id });
    } catch (error) {
        console.error(`Ошибка при удалении новости с ID ${newsId}:`, error);
        res.status(500).json({ message: 'Произошла ошибка при удалении новости.' });
    }
};

module.exports = {
    getNewsList,
    getNewsById,
    addNews,
    editNews,
    deleteNews,
};