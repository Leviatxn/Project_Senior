import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './StudentSide/RegisterPage';
import Home from './StudentSide/Home';
import Petition from './StudentSide/Petition';
import RequestA from './StudentSide/RequestA';
import RequestB from './StudentSide/RequestB';
import Profile from './StudentSide/Profile';
import MyProject from './StudentSide/MyProject';
import Prof_LoginPage from './Prof_LoginPage';
import Prof_Home from './ProfessorSide/Prof_Home';
import Prof_Petition from './ProfessorSide/Prof_Petition';
import Prof_PetitionDetail from './ProfessorSide/Prof_PetitionDetail';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // ตรวจสอบ Token
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/professor" element={<Prof_LoginPage />} />
      <Route path="/professor/home" element={<Prof_Home />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/petition" element={<Petition />} />
      <Route path="/petition/request-a" element={<RequestA />} />
      <Route path="/petition/request-b" element={<RequestB />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/professor/petition" element={<Prof_Petition />} />
      <Route path="/professor/petition-detail" element={<Prof_PetitionDetail />} />
      <Route path="/MyProject" element={<MyProject />} />
    </Routes>
  );
}

export default App;
