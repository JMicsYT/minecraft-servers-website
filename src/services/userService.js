const API_URL = '/api/auth/me/profile';

export const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Ошибка при загрузке профиля');
    }
    return response.json();
};

export const updateUserProfile = async (login, email) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ login, email }),
    });
    if (!response.ok) {
        throw new Error('Ошибка при обновлении профиля');
    }
    return response.json();
};