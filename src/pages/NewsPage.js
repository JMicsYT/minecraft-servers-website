import React from 'react';
import styled from 'styled-components';

const NewsContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const NewsArticle = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ArticleTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ArticleDate = styled.p`
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
`;

const ArticleContent = styled.p`
  line-height: 1.6;
`;

function NewsPage() {
  // Пока что мы будем использовать статические данные для примера новостей
  const news = [
    {
      id: 1,
      title: 'Обновление на сервере "Vanilla+ Fun"',
      date: '03 апреля 2025',
      content:
        'На нашем сервере "Vanilla+ Fun" установлено новое обновление! Вас ждут исправления ошибок, улучшения производительности и несколько новых интересных возможностей. Подробности читайте на форуме.',
    },
    {
      id: 2,
      title: 'Анонс еженедельного ивента',
      date: '02 апреля 2025',
      content:
        'На этой неделе мы проводим захватывающий ивент с ценными призами! Присоединяйтесь к нам в субботу в 20:00 по московскому времени. Подробности о событии будут опубликованы завтра.',
    },
    {
      id: 3,
      title: 'Технические работы завершены',
      date: '01 апреля 2025',
      content:
        'Сообщаем, что технические работы на сервере "Tech & Magic" успешно завершены. Сервер снова доступен для игры. Приносим извинения за временные неудобства.',
    },
  ];

  return (
    <NewsContainer>
      <PageTitle>Новости и обновления</PageTitle>
      {news.map((article) => (
        <NewsArticle key={article.id}>
          <ArticleTitle>{article.title}</ArticleTitle>
          <ArticleDate>{article.date}</ArticleDate>
          <ArticleContent>{article.content}</ArticleContent>
          {/* В будущем здесь может быть функционал для комментариев */}
        </NewsArticle>
      ))}
    </NewsContainer>
  );
}

export default NewsPage;