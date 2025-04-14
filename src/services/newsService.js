// src/services/newsService.js

const API_BASE_URL = 'http://localhost:5000/api/news'; // Базовый URL для эндпоинтов новостей

// Получение списка новостей
export const getNews = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось загрузить новости.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        throw error;
    }
};