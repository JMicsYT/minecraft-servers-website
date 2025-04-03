import React from 'react';
import styled from 'styled-components';

const HelpContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FAQList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FAQItem = styled.li`
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const Question = styled.h4`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Answer = styled.p`
  line-height: 1.6;
`;

const InstructionsList = styled.ol`
  padding-left: 20px;
  margin-bottom: 1rem;
`;

const InstructionItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const ContactInfo = styled.div`
  margin-top: 2rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1.5rem;
`;

const ContactItem = styled.p`
  margin-bottom: 0.5rem;
`;

function HelpPage() {
  const faq = [
    {
      question: 'Как установить моды для игры на ваших серверах?',
      answer:
        'Для установки модов вам потребуется специальный лаунчер. Инструкцию по установке и ссылку на лаунчер вы найдете на главной странице в разделе "Как начать играть".',
    },
    {
      question: 'Как подключиться к серверу?',
      answer:
        'После установки и запуска лаунчера выберите нужный сервер из списка и нажмите кнопку "Подключиться". Убедитесь, что у вас выбрана правильная версия Minecraft, указанная для сервера.',
    },
    {
      question: 'Какие правила действуют на ваших серверах?',
      answer:
        'С полным списком правил вы можете ознакомиться на странице каждого сервера в разделе "Правила сервера". Пожалуйста, соблюдайте правила для комфортной игры всех участников.',
    },
    // Добавьте больше вопросов и ответов по мере необходимости
  ];

  const teamInfo = [
    { name: 'Админ #1', role: 'Главный администратор' },
    { name: 'Модератор #1', role: 'Модератор серверов' },
    // Добавьте информацию о команде
  ];

  return (
    <HelpContainer>
      <PageTitle>Помощь и FAQ</PageTitle>

      <SectionTitle>Часто задаваемые вопросы (FAQ)</SectionTitle>
      <FAQList>
        {faq.map((item, index) => (
          <FAQItem key={index}>
            <Question>{item.question}</Question>
            <Answer>{item.answer}</Answer>
          </FAQItem>
        ))}
      </FAQList>

      <SectionTitle>Как начать играть</SectionTitle>
      <InstructionsList>
        <InstructionItem>Скачайте и установите наш специальный лаунчер (ссылка на главной странице).</InstructionItem>
        <InstructionItem>Запустите лаунчер и выберите нужную версию Minecraft.</InstructionItem>
        <InstructionItem>Перейдите во вкладку "Серверы" и выберите сервер из списка.</InstructionItem>
        <InstructionItem>Нажмите кнопку "Подключиться" и наслаждайтесь игрой!</InstructionItem>
      </InstructionsList>

      <SectionTitle>Команда проекта</SectionTitle>
      <ul>
        {teamInfo.map((member, index) => (
          <li key={index}>
            {member.name} - {member.role}
          </li>
        ))}
      </ul>

      <ContactInfo>
        <SectionTitle>Контактная информация</SectionTitle>
        <ContactItem>Email: support@example-minecraft.com</ContactItem>
        <ContactItem>Discord: ссылка на ваш Discord-сервер</ContactItem>
        {/* Добавьте другие способы связи */}
      </ContactInfo>
    </HelpContainer>
  );
}

export default HelpPage;