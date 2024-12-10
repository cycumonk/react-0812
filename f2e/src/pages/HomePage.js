import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 嘗試從 localStorage 中獲取已登入的用戶名
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        // 清除 localStorage 中的 username
        localStorage.removeItem("username");
        setUsername(null);
        navigate("/login"); // 登出後跳轉到登入頁
    };

    return (
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} className="px-4">
                    <Card className="shadow-lg border-0 rounded-4 p-4">
                        <Card.Body>
                            {username ? (
                                <>
                                    <Card.Title className="text-primary text-center mb-4" style={{ fontSize: '2rem', fontWeight: '500' }}>
                                        Welcome, {username}
                                    </Card.Title>
                                    <Card.Text className="text-muted text-center mb-4" style={{ fontSize: '1.1rem' }}>
                                        You're successfully logged in. You can manage your account or log out.
                                    </Card.Text>
                                    <div className="d-grid gap-3">
                                        <Button variant="danger" size="lg" onClick={handleLogout} className="rounded-3">
                                            Log out
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Card.Title className="text-primary text-center mb-4" style={{ fontSize: '2rem', fontWeight: '500' }}>
                                        Welcome to the Home Page
                                    </Card.Title>
                                    <Card.Text className="text-muted text-center mb-4" style={{ fontSize: '1.1rem' }}>
                                        This is a simple page built with React and Bootstrap. Start by signing up or logging in to access more features.
                                    </Card.Text>
                                    <div className="d-grid gap-3">
                                        <Button variant="primary" size="lg" href="/sign-up" className="rounded-3">
                                            Sign Up
                                        </Button>
                                        <Button variant="outline-primary" size="lg" href="/login" className="rounded-3">
                                            Log In
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
