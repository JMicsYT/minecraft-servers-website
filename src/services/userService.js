// src/services/userService.js

const API_BASE_URL = 'http://localhost:5000/api/user'; // Базовый URL для эндпоинтов пользователя

// Получение профиля пользователя
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

// Обновление профиля пользователя
export const updateUserProfile = async (login, email) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ login, email }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Не удалось обновить профиль.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        return { success: false, message: error.message || 'Произошла ошибка при обновлении профиля.' };
    }
};