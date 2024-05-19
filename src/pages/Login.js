import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requestBody = {
      username,
      password,
    };
  
    try {
      const loginResponse = await fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ":" + password),
        },
        body: JSON.stringify(requestBody),
      });
  
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const token = loginData.data.token;
        const userId = loginData.data.userInfo.id;
  
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
  
        // Fetch the user's role
        const roleResponse = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          const userRole = roleData.data.roles; // Assuming the role is included in the response
  
          // Navigate based on the role
          if (userRole === 'ADMIN') {
            navigate('/manage');
          } else if (userRole === 'USER') {
            navigate('/profile');
          } else {
            console.error('Unknown role');
          }
        } else {
          console.error('Failed to fetch user role');
        }
      } else {
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
            Login
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
