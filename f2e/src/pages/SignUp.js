import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

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
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <Card className="shadow-lg border-0 rounded-4 p-4">
                        <Card.Body>
                            <h1 className="text-primary text-center mb-4" style={{ fontSize: '2rem', fontWeight: '500' }}>
                                Sign Up
                            </h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="rounded-3"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="password" className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="rounded-3"
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 rounded-3">
                                    Register
                                </Button>
                            </Form>

                            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                            <div className="mt-3 text-center">
                                <small className="text-muted">
                                    Already have an account? <a href="/login">Login here</a>
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
};

export default SignUp;
