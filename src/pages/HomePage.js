import React from 'react';
import styled from 'styled-components';

const HeroSection = styled.div`
  background-color: #f0f0f0;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  border-radius: 5px;
`;

const HeroTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const HeroDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ServersOverview = styled.div`
  margin-bottom: 2rem;
`;

const ServersTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ServerList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ServerItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const NewsSection = styled.div``;

const NewsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NewsItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

function HomePage() {
  return (
    <div>
      <HeroSection>
        <HeroTitle>Добро пожаловать на наш проект модовых серверов Minecraft!</HeroTitle>
        <HeroDescription>
          Мы объединяем несколько увлекательных модовых серверов Minecraft, предлагая уникальный игровой опыт для каждого. Присоединяйтесь к нашему сообществу и исследуйте новые миры, наполненные приключениями и возможностями!
        </HeroDescription>
        <HeroDescription>
          Здесь вы найдете всю необходимую информацию о наших серверах, последние новости проекта и сможете присоединиться к нашему дружному комьюнити.
        </HeroDescription>
      </HeroSection>

      <ServersOverview>
        <ServersTitle>Наши серверы:</ServersTitle>
        <ServerList>
          <ServerItem>Сервер #1: Название сервера (Версия Minecraft, основные моды) - Онлайн</ServerItem>
          <ServerItem>Сервер #2: Другое название (Версия, другие моды) - Оффлайн</ServerItem>
          <ServerItem>Сервер #3: Еще один сервер (Версия, моды) - Онлайн</ServerItem>
          {/* В будущем здесь будет динамический список серверов */}
        </ServerList>
      </ServersOverview>

      <NewsSection>
        <NewsTitle>Последние новости:</NewsTitle>
        <NewsList>
          <NewsItem>03.04.2025 - Вышло обновление на сервере #1!</NewsItem>
          <NewsItem>02.04.2025 - Объявляем о новом ивенте на этой неделе!</NewsItem>
          <NewsItem>01.04.2025 - Технические работы на сервере #2 завершены.</NewsItem>
          {/* В будущем здесь будут динамические новости */}
        </NewsList>
      </NewsSection>
    </div>
  );
}

export default HomePage;