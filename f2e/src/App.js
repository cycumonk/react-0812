import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import LoginSuccessPage from './pages/LoginSuccess';
import FormComponent from './pages/FormComponent';
import { AuthProvider } from "./contexts/AuthContext.js";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loginSuccess" element={<LoginSuccessPage />} />
          <Route path="/form" element={<FormComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
