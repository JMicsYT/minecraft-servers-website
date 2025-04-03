import React from 'react';
import styled from 'styled-components';

const ServersContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const ServerCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ServerName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ServerInfo = styled.p`
  margin-bottom: 0.3rem;
`;

function ServersPage() {
  // Пока что мы будем использовать статические данные для примера
  const servers = [
    {
      id: 1,
      name: 'Vanilla+ Fun',
      version: '1.20.4',
      mods: ['Vanilla Enhancements', 'Quality of Life'],
      online: true,
      players: 15,
      maxPlayers: 30,
    },
    {
      id: 2,
      name: 'Tech & Magic',
      version: '1.19.2',
      mods: ['Create', 'Ars Nouveau', 'Thermal Expansion'],
      online: false,
      players: 0,
      maxPlayers: 50,
    },
    {
      id: 3,
      name: 'Skyblock Adventure',
      version: '1.18.1',
      mods: ['Skyblock Addons', 'Island Progression'],
      online: true,
      players: 8,
      maxPlayers: 20,
    },
  ];

  return (
    <ServersContainer>
      <PageTitle>Список наших серверов</PageTitle>
      {servers.map((server) => (
        <ServerCard key={server.id}>
          <ServerName>{server.name}</ServerName>
          <ServerInfo>Версия: {server.version}</ServerInfo>
          <ServerInfo>Моды: {server.mods.join(', ')}</ServerInfo>
          <ServerInfo>Статус: {server.online ? 'Онлайн' : 'Оффлайн'} ({server.players}/{server.maxPlayers} игроков)</ServerInfo>
          {/* В будущем здесь будут кнопки "Подробнее", "Донат" и т.д. */}
        </ServerCard>
      ))}
    </ServersContainer>
  );
}

export default ServersPage;