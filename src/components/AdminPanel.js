import React, { useState, useEffect } from 'react';
import { getNews, createNews, updateNews, deleteNews, getServers, createServer, getUserProfile } from '../services/adminService';
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

    useEffect(() => {
        async function fetchData() {
            try {
                const profile = await getUserProfile();
                setIsAdmin(profile.user.is_admin);
                setNews(await getNews());
                setServers(await getServers());
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        }
        fetchData();
    }, []);

    const handleCreateNews = async () => {
        await createNews(newNewsTitle, newNewsContent);
        setNews(await getNews());
        setNewNewsTitle('');
        setNewNewsContent('');
    };

    const handleUpdateNews = async () => {
        await updateNews(editNewsId, editNewsTitle, editNewsContent);
        setNews(await getNews());
        setEditNewsId(null);
    };

    const handleDeleteNews = async (id) => {
        await deleteNews(id);
        setNews(await getNews());
    };

    const handleCreateServer = async () => {
        await createServer(newServerName, newServerIp);
        setServers(await getServers());
        setNewServerName('');
        setNewServerIp('');
    };

    if (!isAdmin) {
        return <div>У вас нет прав администратора для доступа к этой странице.</div>;
    }

    return (
        <div className={styles.adminPanelContainer}>
            <h2>Админ-панель</h2>
            <div>
                <h3>Новости</h3>
                <input type="text" placeholder="Заголовок" value={newNewsTitle} onChange={(e) => setNewNewsTitle(e.target.value)} />
                <textarea placeholder="Содержание" value={newNewsContent} onChange={(e) => setNewNewsContent(e.target.value)} />
                <button onClick={handleCreateNews}>Создать новость</button>
                {news.map((item) => (
                    <div key={item.id}>
                        {editNewsId === item.id ? (
                            <div>
                                <input type="text" value={editNewsTitle} onChange={(e) => setEditNewsTitle(e.target.value)} />
                                <textarea value={editNewsContent} onChange={(e) => setEditNewsContent(e.target.value)} />
                                <button onClick={handleUpdateNews}>Сохранить</button>
                                <button onClick={() => setEditNewsId(null)}>Отмена</button>
                            </div>
                        ) : (
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                                <button onClick={() => {
                                    setEditNewsId(item.id);
                                    setEditNewsTitle(item.title);
                                    setEditNewsContent(item.content);
                                }}>Редактировать</button>
                                <button onClick={() => handleDeleteNews(item.id)}>Удалить</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <h3>Серверы</h3>
                <input type="text" placeholder="Название" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} />
                <input type="text" placeholder="IP" value={newServerIp} onChange={(e) => setNewServerIp(e.target.value)} />
                <button onClick={handleCreateServer}>Добавить сервер</button>
                {servers.map((server) => (
                    <div key={server.id}>
                        <p>{server.name} - {server.ip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;