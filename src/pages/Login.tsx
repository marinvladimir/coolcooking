import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../api/api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lightBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.login(form);
      console.log(response);
      const token = response.token;
      if (token) {
        localStorage.setItem('token', token);
        setMessage('Login successful');
        navigate('/favorites');
      } else {
        setMessage('Token not found in response.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <Button type="submit">Login</Button>
      <p>{message}</p>
      <Nav>
        <StyledLink to="/register">
          Don't have an account? Register here
        </StyledLink>
      </Nav>
    </Form>
  );
};

export default Login;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.5rem;
  border-radius: 4px;
  transition:
    color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
