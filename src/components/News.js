import React, { useState, useEffect } from 'react';
import { getNews } from '../services/newsService'; // Предполагаем, что эта функция есть в сервисе
import styles from './News.module.css';

function News() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNews() {
            setLoading(true);
            setError(null);
            try {
                const data = await getNews();
                setNews(data.news || []); // Предполагаем, что бэкенд возвращает объект с полем 'news'
            } catch (error) {
                console.error('Ошибка при загрузке новостей:', error);
                setError('Не удалось загрузить новости.');
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Загрузка новостей...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error}</div>;
    }

    return (
        <div className={styles.newsContainer}>
            <h2>Новости</h2>
            {news.length > 0 ? (
                news.map((item) => (
                    <div key={item.id} className={styles.newsItem}>
                        <h3 className={styles.newsTitle}>{item.title}</h3>
                        <p className={styles.newsContent}>{item.content}</p>
                        <p className={styles.newsDate}>
                            Дата: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ))
            ) : (
                <p>Нет новостей для отображения.</p>
            )}
        </div>
    );
}

export default News;