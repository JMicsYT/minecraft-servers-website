import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AuthContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AuthTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const LoginForm = styled.form`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1.5rem;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const LinkText = styled(Link)`
  text-decoration: none;
  color: #007bff;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь будет логика отправки данных на сервер для входа
    console.log('Вход:', { login, password });
    // После успешного входа можно будет перенаправить пользователя в личный кабинет
  };

  return (
    <AuthContainer>
      <AuthTitle>Вход на сайт</AuthTitle>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Войти</Button>
      </LoginForm>
      <p>
        Нет аккаунта? <LinkText to="/register">Зарегистрироваться</LinkText>
      </p>
    </AuthContainer>
  );
}

export default LoginPage;