import React, { useState } from 'react';
import Modal from 'react-modal';
import { register, login } from '../services/authService'; // Предполагаем, что эти функции есть в сервисе
import styles from './AuthModal.module.css';

Modal.setAppElement('#root'); // Необходимо для модального окна

function AuthModal({ isOpen, onRequestClose }) {
    const [isRegister, setIsRegister] = useState(true);
    const [loginValue, setLoginValue] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Сбрасываем сообщение об ошибке при каждой попытке отправки
        try {
            if (isRegister) {
                const result = await register(loginValue, email, password);
                if (result && result.success) {
                    alert('Регистрация прошла успешно!');
                    onRequestClose();
                } else {
                    setErrorMessage(result.message || 'Ошибка при регистрации.');
                }
            } else {
                const result = await login(loginValue, password);
                if (result && result.token) {
                    localStorage.setItem('token', result.token); // Сохраняем токен
                    alert('Вход выполнен успешно!');
                    onRequestClose();
                    // Здесь можно выполнить переход на главную страницу или обновить состояние пользователя
                } else {
                    setErrorMessage(result.message || 'Неверный логин или пароль.');
                }
            }
        } catch (error) {
            console.error('Ошибка аутентификации:', error);
            setErrorMessage('Произошла непредвиденная ошибка.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel={isRegister ? 'Регистрация' : 'Вход'}
        >
            <h2 className={styles.title}>{isRegister ? 'Регистрация' : 'Вход'}</h2>
            <button onClick={() => setIsRegister(!isRegister)} className={styles.toggleButton}>
                {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="login">Логин:</label>
                    <input
                        type="text"
                        id="login"
                        value={loginValue}
                        onChange={(e) => setLoginValue(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                {isRegister && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <button type="submit" className={styles.submitButton}>{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
            </form>
            <button onClick={onRequestClose} className={styles.closeButton}>Закрыть</button>
        </Modal>
    );
}

export default AuthModal;