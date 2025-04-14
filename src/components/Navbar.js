import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Link)`
  font-size: 1.5rem;
  text-decoration: none;
  color: white;
  font-weight: bold;
`;

const NavLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem;
`;

const NavItem = styled.li``;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    color: #ddd;
  }
`;

function Navbar() {
  return (
    <Nav>
      <Title to="/">Наш Minecraft Проект</Title>
      <NavLinks>
        <NavItem>
          <StyledLink to="/servers">Серверы</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/news">Новости</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/login">Войти</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/register">Регистрация</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/dashboard">Личный кабинет</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/help">Помощь</StyledLink>
        </NavItem>
      </NavLinks>
    </Nav>
  );
}

export default Navbar;