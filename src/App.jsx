import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Home from './Home';
import { Navigate } from 'react-router-dom';
import Petition from './Petition';
import RequestA from './RequestA';
import RequestB from './RequestB';
import Profile from './Profile';


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
      <Route path="/petition" element={<Petition />} />
      <Route path="/petition/request-a" element={<RequestA />} />
      <Route path="/petition/request-b" element={<RequestB />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App;
