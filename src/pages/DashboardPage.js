import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const InfoItem = styled.p`
  margin-bottom: 0.3rem;
`;

const ActionsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ActionItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: none;
    font-size: 1rem;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function DashboardPage() {
  // В будущем здесь будут данные о текущем пользователе, полученные с бэкенда
  const user = {
    login: 'Игрок123',
    email: 'player@example.com',
    lastLogin: '03.04.2025 15:00',
    servers: ['Vanilla+ Fun', 'Skyblock Adventure'],
    hasDonated: true,
  };

  return (
    <DashboardContainer>
      <PageTitle>Личный кабинет</PageTitle>

      <UserInfo>
        <InfoTitle>Информация о пользователе</InfoTitle>
        <InfoItem>Логин: {user.login}</InfoItem>
        <InfoItem>Email: {user.email}</InfoItem>
        <InfoItem>Последний вход: {user.lastLogin}</InfoItem>
      </UserInfo>

      <UserInfo>
        <InfoTitle>Ваши серверы</InfoTitle>
        {user.servers.length > 0 ? (
          <ul>
            {user.servers.map((server, index) => (
              <li key={index}>{server}</li>
            ))}
          </ul>
        ) : (
          <p>Вы еще не играли ни на одном сервере.</p>
        )}
      </UserInfo>

      <UserInfo>
        <InfoTitle>Действия</InfoTitle>
        <ActionsList>
          <ActionItem>
            <button onClick={() => console.log('Смена пароля')}>Сменить пароль</button>
          </ActionItem>
          {user.hasDonated && (
            <ActionItem>
              <button onClick={() => console.log('История донатов')}>История донатов</button>
            </ActionItem>
          )}
          {/* Другие действия могут быть добавлены позже */}
        </ActionsList>
      </UserInfo>
    </DashboardContainer>
  );
}

export default DashboardPage;