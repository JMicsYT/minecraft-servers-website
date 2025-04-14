// src/services/adminService.js

const API_BASE_URL = 'http://localhost:5000/api/admin'; // Базовый URL для административных эндпоинтов

// Получение профиля пользователя (для проверки прав администратора)
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось получить профиль пользователя.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        throw error;
    }
};

// Получение списка новостей
export const getNews = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/news`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
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

// Создание новой новости
export const createNews = async (title, content) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось создать новость.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        throw error;
    }
};

// Обновление существующей новости
export const updateNews = async (id, title, content) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось обновить новость.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        throw error;
    }
};

// Удаление новости
export const deleteNews = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось удалить новость.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        throw error;
    }
};

// Получение списка серверов
export const getServers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/servers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось загрузить список серверов.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении серверов:', error);
        throw error;
    }
};

// Создание нового сервера
export const createServer = async (name, ip) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/servers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name, ip }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось добавить сервер.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при добавлении сервера:', error);
        throw error;
    }
};

// Дополнительные функции для управления серверами (обновление, удаление) могут быть добавлены позже