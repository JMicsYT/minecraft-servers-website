// src/services/authService.js

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Базовый URL для эндпоинтов аутентификации

// Регистрация пользователя
export const register = async (login, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, email, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при регистрации.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, message: error.message || 'Произошла ошибка при регистрации.' };
    }
};

// Вход пользователя
export const login = async (login, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Неверный логин или пароль.');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { token: null, message: error.message || 'Произошла ошибка при входе.' };
    }
};