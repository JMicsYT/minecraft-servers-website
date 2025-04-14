const API_URL = '/api/auth';

export const register = async (login, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, email, password }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при регистрации');
    }
    return response.json();
};

export const login = async (login, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при входе');
    }
    return response.json();
};