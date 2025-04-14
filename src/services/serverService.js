// src/services/serverService.js

const API_BASE_URL = 'http://localhost:5000/api/servers'; // Базовый URL для эндпоинтов серверов

// Получение списка серверов
export const getServers = async () => {
    try {
        const response = await fetch(API_BASE_URL);
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