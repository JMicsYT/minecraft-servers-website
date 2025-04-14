const API_URL = '/api/admin';
const AUTH_URL = '/api/auth/me/profile';

export const getNews = async () => {
    const response = await fetch(`${API_URL}/news`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке новостей');
    }
    return response.json();
};

export const createNews = async (title, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при создании новости');
    }
    return response.json();
};

export const updateNews = async (id, title, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении новости');
    }
    return response.json();
};

export const deleteNews = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Ошибка при удалении новости');
    }
    return response.json();
};

export const getServers = async () => {
    const response = await fetch(`${API_URL}/servers`);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке серверов');
    }
    return response.json();
};

export const createServer = async (name, ip) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/servers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, ip }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при добавлении сервера');
    }
    return response.json();
};

export const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(AUTH_URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Ошибка при загрузке профиля');
    }
    return response.json();
};