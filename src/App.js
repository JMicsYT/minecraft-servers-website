import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Правильный default import
import ServersPage from './pages/ServersPage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HelpPage from './pages/HelpPage';
import Navbar from './components/Navbar'; // Импортируем Navbar
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
`;

function App() {
  return (
    <div>
      <Navbar /> {/* Добавляем Navbar перед Routes */}
      <PageContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;