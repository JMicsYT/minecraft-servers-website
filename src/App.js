import React, { useState } from 'react';
import AuthModal from './components/AuthModal';
import News from './components/News';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Servers from './components/Servers';
import styles from './App.module.css';
import { Route, Routes } from 'react-router-dom';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.app}>
            <Routes>
                <Route exact path="/" element={
                    <>
                        <button onClick={() => setIsModalOpen(true)} className={styles.openModalButton}>Открыть окно авторизации</button>
                        <AuthModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
                        <News />
                        <Profile />
                        <Servers />
                    </>
                } />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </div>
    );
}

export default App;