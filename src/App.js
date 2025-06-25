import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './login/Login';
import RegisterPage from './register/Register';
import Dashboard from './dashboard/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([
    { email: 'user@example.com', password: 'password123' } // Default user
  ]);

  const handleLogin = (email, password) => {
    // Check if user exists in our users array
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setIsAuthenticated(true);
      return true; // Indicate successful login
    } else {
      alert('Invalid credentials. Please try again.');
      return false; // Indicate failed login
    }
  };

  const handleRegister = (email, password) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      alert('User already exists. Please login instead.');
      return false;
    }
    
    // Add new user to users array
    setUsers(prevUsers => [...prevUsers, { email, password }]);
    alert('Registration successful! Please login with your credentials.');
    return true;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <LoginPage onLogin={handleLogin} /> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <RegisterPage onRegister={handleRegister} /> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
