import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Home from './Home';
import { Navigate } from 'react-router-dom';
import Petition from './Petition';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // ตรวจสอบ Token
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cooperative" element={<Petition />} />
    </Routes>
  );
}

export default App;
