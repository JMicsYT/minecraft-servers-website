import React, { useState, useEffect } from 'react';
import { getServers } from '../services/serverService';
import styles from './Servers.module.css';

function Servers() {
    const [servers, setServers] = useState([]);

    useEffect(() => {
        async function fetchServers() {
            try {
                const fetchedServers = await getServers();
                setServers(fetchedServers);
            } catch (error) {
                console.error('Ошибка при загрузке серверов:', error);
            }
        }
        fetchServers();
    }, []);

    return (
        <div className={styles.serversContainer}>
            <h2>Серверы</h2>
            {servers.map((server) => (
                <div key={server.id} className={styles.serverItem}>
                    <h3>{server.name}</h3>
                    <p>{server.ip}</p>
                </div>
            ))}
        </div>
    );
}

export default Servers;