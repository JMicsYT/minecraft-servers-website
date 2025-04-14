import React, { useState, useEffect } from 'react';
import { getNews } from '../services/newsService';
import styles from './News.module.css';

function News() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        async function fetchNews() {
            try {
                const fetchedNews = await getNews();
                setNews(fetchedNews.news);
            } catch (error) {
                console.error('Ошибка при загрузке новостей:', error);
            }
        }
        fetchNews();
    }, []);

    return (
        <div className={styles.newsContainer}>
            <h2>Новости</h2>
            {news.map((item) => (
                <div key={item.id} className={styles.newsItem}>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    <p className={styles.newsDate}>Дата: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

export default News;