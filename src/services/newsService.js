const API_URL = '/api/news';

export const getNews = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке новостей');
    }
    return response.json();
};