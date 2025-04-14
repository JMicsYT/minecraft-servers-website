import React, { useState, useEffect } from 'react';
import { getServers } from '../services/serverService'; // Предполагаем, что эта функция есть в сервисе
import styles from './Servers.module.css';

function Servers() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchServers() {
            setLoading(true);
            setError(null);
            try {
                const data = await getServers();
                setServers(data || []); // Предполагаем, что бэкенд возвращает массив серверов
            } catch (error) {
                console.error('Ошибка при загрузке серверов:', error);
                setError('Не удалось загрузить список серверов.');
            } finally {
                setLoading(false);
            }
        }

        fetchServers();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Загрузка списка серверов...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error}</div>;
    }

    return (
        <div className={styles.serversContainer}>
            <h2>Серверы</h2>
            {servers.length > 0 ? (
                servers.map((server) => (
                    <div key={server.id} className={styles.serverItem}>
                        <h3 className={styles.serverName}>{server.name}</h3>
                        <p className={styles.serverIp}>IP: {server.ip}</p>
                    </div>
                ))
            ) : (
                <p>Список серверов пуст.</p>
            )}
        </div>
    );
}

export default Servers;