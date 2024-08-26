import React, { useState } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/v1/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username: username, Password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError('');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (response.status === 409) {
                setError(data.message);
                setMessage('');
            } else {
                setError(data.message || '發生未知錯誤');
                setMessage('');
            }
        } catch (error) {
            console.error('請求失敗', error);
            setError('請求失敗');
            setMessage('');
        }
    };

    return (
        <Container className="col-4 mt-5">
            <h1 className="mb-4">Sign Up</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
    );
};

export default SignUp;
