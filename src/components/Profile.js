import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const profile = await getUserProfile();
                setUser(profile.user);
                setLogin(profile.user.login);
                setEmail(profile.user.email);
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
            }
        }
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            await updateUserProfile(login, email);
            alert('Профиль обновлен!');
            setIsEditing(false);
        } catch (error) {
            alert('Ошибка обновления профиля: ' + error.message);
        }
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2>Профиль</h2>
            {isEditing ? (
                <div>
                    <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} className={styles.input} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                    <button onClick={handleUpdate} className={styles.updateButton}>Сохранить</button>
                    <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Отмена</button>
                </div>
            ) : (
                <div>
                    <p>Логин: {user.login}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>Редактировать</button>
                    {user.is_admin && (
                        <Link to="/admin" className={styles.adminLink}>Админ-панель</Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;