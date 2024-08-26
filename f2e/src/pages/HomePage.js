import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    return (
        <Container className="mt-5">
            <Card className="text-center">
                <Card.Body>
                    <Card.Title className="display-4">Welcome to the Home Page</Card.Title>
                    <Card.Text className="lead">
                        This is a simple home page built with React.
                    </Card.Text>
                    <Button variant="primary" href="/sign-up">Sign Up</Button>{' '}
                    <Button variant="secondary" href="/login">Login</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default HomePage;
