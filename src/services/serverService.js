const API_URL = '/api/servers';

export const getServers = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке серверов');
    }
    return response.json();
};