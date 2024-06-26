import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requestBody = {
      username,
      email,
      password,
      roles: "USER",
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        // Registration successful, redirect to login page
        window.location.href = "/login";
      } else {
        // Handle registration failure
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        className="p-5 rounded-lg shadow-lg"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          maxWidth: "400px",
          color: "orange",
          border: "2px solid orange",
        }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>

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

          <Form.Group controlId="formEmail" className="mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Form.Group controlId="formConfirmPassword" className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

          <Button
            variant="dark"
            type="submit"
            className="w-100 btn-lg rounded-pill"
          >
            Sign Up
          </Button>

          <p className="mt-3 text-center">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </Form>
      </Container>
    </div>
  );
};

export default SignUp;
