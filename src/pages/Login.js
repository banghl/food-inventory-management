// Login.js
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      username,
      password,
      roles
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Redirect to profile selection page upon successful login
        navigate('/profile');
      } else {
        // Handle login failure
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#121212',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container
        className="p-5 rounded-lg shadow-lg"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          maxWidth: '400px',
          color: 'orange',
          border: '2px solid orange',
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <div className="d-flex justify-content-around mb-4">
          <Button
            variant="dark"
            onClick={() => handleUserTypeChange('user')}
            className={`rounded-pill px-4 py-2 ${
              userType === 'user' ? 'bg-orange text-light' : 'text-light'
            }`}
            style={{
              transition: 'background-color 0.3s',
              backgroundColor: userType === 'user' ? 'orange' : '',
              color: userType === 'user' ? 'white' : '',
            }}
          >
            User
          </Button>
          <Button
            variant="dark"
            onClick={() => handleUserTypeChange('admin')}
            className={`rounded-pill px-4 py-2 ${
              userType === 'admin' ? 'bg-orange text-light' : 'text-light'
            }`}
            style={{
              transition: 'background-color 0.3s',
              backgroundColor: userType === 'admin' ? 'orange' : '',
              color: userType === 'admin' ? 'white' : '',
            }}
          >
            Admin
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

          <Button
            variant="dark"
            type="submit"
            className="w-100 btn-lg rounded-pill"
          >
            {userType === 'user' ? 'Login' : 'Admin Login'}
          </Button>

          <p className="mt-3 text-center">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
