import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './StudentSide/RegisterPage';
import Home from './StudentSide/Home';
import { Navigate } from 'react-router-dom';
import Petition from './StudentSide/Petition';
import RequestA from './StudentSide/RequestA';
import RequestB from './StudentSide/RequestB';
import Profile from './StudentSide/Profile';
import Prof_LoginPage from './Prof_LoginPage';
import Prof_Home from './ProfessorSide/Prof_Home';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // ตรวจสอบ Token
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/professor" element={<Prof_LoginPage />} />
      <Route path="/professor/home" element={<Prof_Home/>} />
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
