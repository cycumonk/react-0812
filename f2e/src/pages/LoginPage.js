import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // 假設成功登入，將用戶名儲存到 localStorage
        // 您可以在這裡發送 API 請求並驗證帳號密碼
        if (username && password) {
            localStorage.setItem("username", username); // 儲存用戶名到 localStorage
            navigate("/loginSuccess", { state: { username } }); // 重定向到首頁，並傳遞用戶名
        } else {
            alert("請輸入正確的用帳號和密碼");
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <Card className="shadow-lg border-0 rounded-4 p-4">
                        <Card.Body>
                            <Card.Title className="text-primary text-center mb-4" style={{ fontSize: '2rem', fontWeight: '500' }}>
                                Login
                            </Card.Title>
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="formUsername" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="rounded-3"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="rounded-3"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 rounded-3">
                                    Log In
                                </Button>
                            </Form>
                            <div className="mt-3 text-center">
                                <small className="text-muted">Don't have an account? <a href="/sign-up">Sign up here</a></small>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default LoginPage;
