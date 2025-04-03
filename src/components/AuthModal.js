import React, { useState } from 'react';
import Modal from 'react-modal';
import { register, login } from '../services/authService';
import styles from './AuthModal.module.css';

Modal.setAppElement('#root');

function AuthModal({ isOpen, onRequestClose }) {
    const [isRegister, setIsRegister] = useState(true);
    const [loginValue, setLoginValue] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await register(loginValue, email, password);
                alert('Регистрация прошла успешно!');
            } else {
                await login(loginValue, password);
                alert('Вход выполнен успешно!');
            }
            onRequestClose();
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={styles.modal} overlayClassName={styles.overlay}>
            <h2 className={styles.title}>{isRegister ? 'Регистрация' : 'Вход'}</h2>
            <button onClick={() => setIsRegister(!isRegister)} className={styles.toggleButton}>
                {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Логин" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} className={styles.input} />
                {isRegister && <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />}
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
                <button type="submit" className={styles.submitButton}>{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
            </form>
            <button onClick={onRequestClose} className={styles.closeButton}>Закрыть</button>
        </Modal>
    );
}

export default AuthModal;