import React, { useState, useEffect } from 'react';
import { getNews, createNews, updateNews, deleteNews, getServers, createServer, getUserProfile } from '../services/adminService'; // Предполагаем, что эти функции есть в сервисе
import styles from './AdminPanel.module.css';

function AdminPanel() {
    const [news, setNews] = useState([]);
    const [servers, setServers] = useState([]);
    const [newNewsTitle, setNewNewsTitle] = useState('');
    const [newNewsContent, setNewNewsContent] = useState('');
    const [newServerName, setNewServerName] = useState('');
    const [newServerIp, setNewServerIp] = useState('');
    const [editNewsId, setEditNewsId] = useState(null);
    const [editNewsTitle, setEditNewsTitle] = useState('');
    const [editNewsContent, setEditNewsContent] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const profileData = await getUserProfile();
                setIsAdmin(profileData?.user?.is_admin || false);
                const newsData = await getNews();
                setNews(newsData?.news || []);
                const serversData = await getServers();
                setServers(serversData || []);
            } catch (err) {
                console.error('Ошибка при загрузке данных админ-панели:', err);
                setError('Не удалось загрузить данные админ-панели.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const clearMessage = () => {
        setMessage('');
        setMessageType('');
    };

    const handleCreateNews = async () => {
        try {
            const result = await createNews(newNewsTitle, newNewsContent);
            if (result && result.success) {
                setMessage('Новость успешно создана!');
                setMessageType('success');
                setNews(await getNews()); // Обновляем список новостей
                setNewNewsTitle('');
                setNewNewsContent('');
                setTimeout(clearMessage, 3000);
            } else {
                setMessage(result?.message || 'Не удалось создать новость.');
                setMessageType('error');
                setTimeout(clearMessage, 3000);
            }
        } catch (error) {
            console.error('Ошибка создания новости:', error);
            setMessage('Произошла ошибка при создании новости.');
            setMessageType('error');
            setTimeout(clearMessage, 3000);
        }
    };

    const handleUpdateNews = async () => {
        try {
            const result = await updateNews(editNewsId, editNewsTitle, editNewsContent);
            if (result && result.success) {
                setMessage('Новость успешно обновлена!');
                setMessageType('success');
                setNews(await getNews()); // Обновляем список новостей
                setEditNewsId(null);
                setTimeout(clearMessage, 3000);
            } else {
                setMessage(result?.message || 'Не удалось обновить новость.');
                setMessageType('error');
                setTimeout(clearMessage, 3000);
            }
        } catch (error) {
            console.error('Ошибка обновления новости:', error);
            setMessage('Произошла ошибка при обновлении новости.');
            setMessageType('error');
            setTimeout(clearMessage, 3000);
        }
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
            try {
                const result = await deleteNews(id);
                if (result && result.success) {
                    setMessage('Новость успешно удалена!');
                    setMessageType('success');
                    setNews(await getNews()); // Обновляем список новостей
                    setTimeout(clearMessage, 3000);
                } else {
                    setMessage(result?.message || 'Не удалось удалить новость.');
                    setMessageType('error');
                    setTimeout(clearMessage, 3000);
                }
            } catch (error) {
                console.error('Ошибка удаления новости:', error);
                setMessage('Произошла ошибка при удалении новости.');
                setMessageType('error');
                setTimeout(clearMessage, 3000);
            }
        }
    };

    const handleCreateServer = async () => {
        try {
            const result = await createServer(newServerName, newServerIp);
            if (result && result.success) {
                setMessage('Сервер успешно добавлен!');
                setMessageType('success');
                setServers(await getServers()); // Обновляем список серверов
                setNewServerName('');
                setNewServerIp('');
                setTimeout(clearMessage, 3000);
            } else {
                setMessage(result?.message || 'Не удалось добавить сервер.');
                setMessageType('error');
                setTimeout(clearMessage, 3000);
            }
        } catch (error) {
            console.error('Ошибка добавления сервера:', error);
            setMessage('Произошла ошибка при добавлении сервера.');
            setMessageType('error');
            setTimeout(clearMessage, 3000);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка админ-панели...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error}</div>;
    }

    if (!isAdmin) {
        return <div className={styles.accessDenied}>У вас нет прав администратора для доступа к этой странице.</div>;
    }

    return (
        <div className={styles.adminPanelContainer}>
            <h2>Админ-панель</h2>
            {message && <div className={`${styles.message} ${styles[messageType]}`}>{message}</div>}

            <div className={styles.section}>
                <h3>Новости</h3>
                <div className={styles.inputGroup}>
                    <label htmlFor="newTitle">Заголовок:</label>
                    <input type="text" id="newTitle" placeholder="Заголовок" value={newNewsTitle} onChange={(e) => setNewNewsTitle(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="newContent">Содержание:</label>
                    <textarea id="newContent" placeholder="Содержание" value={newNewsContent} onChange={(e) => setNewNewsContent(e.target.value)} />
                </div>
                <button onClick={handleCreateNews} className={styles.createButton}>Создать новость</button>

                {news.map((item) => (
                    <div key={item.id} className={styles.listItem}>
                        {editNewsId === item.id ? (
                            <div className={styles.editForm}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor={`editTitle-${item.id}`}>Заголовок:</label>
                                    <input type="text" id={`editTitle-${item.id}`} value={editNewsTitle} onChange={(e) => setEditNewsTitle(e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor={`editContent-${item.id}`}>Содержание:</label>
                                    <textarea id={`editContent-${item.id}`} value={editNewsContent} onChange={(e) => setEditNewsContent(e.target.value)} />
                                </div>
                                <div className={styles.buttons}>
                                    <button onClick={handleUpdateNews} className={styles.saveButton}>Сохранить</button>
                                    <button onClick={() => setEditNewsId(null)} className={styles.cancelButton}>Отмена</button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.newsItem}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                                <div className={styles.actions}>
                                    <button onClick={() => {
                                        setEditNewsId(item.id);
                                        setEditNewsTitle(item.title);
                                        setEditNewsContent(item.content);
                                    }} className={styles.editButton}>Редактировать</button>
                                    <button onClick={() => handleDeleteNews(item.id)} className={styles.deleteButton}>Удалить</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.section}>
                <h3>Серверы</h3>
                <div className={styles.inputGroup}>
                    <label htmlFor="newServerName">Название:</label>
                    <input type="text" id="newServerName" placeholder="Название" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="newServerIp">IP:</label>
                    <input type="text" id="newServerIp" placeholder="IP" value={newServerIp} onChange={(e) => setNewServerIp(e.target.value)} />
                </div>
                <button onClick={handleCreateServer} className={styles.createButton}>Добавить сервер</button>

                {servers.map((server) => (
                    <div key={server.id} className={styles.listItem}>
                        <p>{server.name} - {server.ip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;