import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import FormComponent from './pages/FormComponent';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/form" element={<FormComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
