import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService'; // Предполагаем, что эти функции есть в сервисе
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedLogin, setEditedLogin] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError(null);
            try {
                const profileData = await getUserProfile();
                setUser(profileData.user);
                setEditedLogin(profileData.user?.login || '');
                setEditedEmail(profileData.user?.email || '');
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                setError('Не удалось загрузить профиль.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
        setUpdateMessage('');
        setUpdateError('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedLogin(user?.login || '');
        setEditedEmail(user?.email || '');
        setUpdateMessage('');
        setUpdateError('');
    };

    const handleUpdateProfile = async () => {
        setUpdateMessage('');
        setUpdateError('');
        try {
            const result = await updateUserProfile(editedLogin, editedEmail);
            if (result && result.success) {
                setUser({ ...user, login: editedLogin, email: editedEmail });
                setIsEditing(false);
                setUpdateMessage('Профиль успешно обновлен!');
            } else {
                setUpdateError(result.message || 'Не удалось обновить профиль.');
            }
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            setUpdateError('Произошла ошибка при обновлении профиля.');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка профиля...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error}</div>;
    }

    if (!user) {
        return <div>Не удалось получить данные пользователя.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2>Профиль</h2>
            {updateMessage && <p className={styles.successMessage}>{updateMessage}</p>}
            {updateError && <p className={styles.errorMessage}>{updateError}</p>}

            {isEditing ? (
                <div className={styles.editForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="login">Логин:</label>
                        <input
                            type="text"
                            id="login"
                            value={editedLogin}
                            onChange={(e) => setEditedLogin(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={editedEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.buttons}>
                        <button onClick={handleUpdateProfile} className={styles.saveButton}>Сохранить</button>
                        <button onClick={handleCancelEdit} className={styles.cancelButton}>Отмена</button>
                    </div>
                </div>
            ) : (
                <div className={styles.userInfo}>
                    <p>Логин: {user.login}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleEditClick} className={styles.editButton}>Редактировать</button>
                    {user.is_admin && (
                        <Link to="/admin" className={styles.adminLink}>Админ-панель</Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;