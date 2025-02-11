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
import Prof_Petition from './ProfessorSide/Prof_Petition';
import Prof_PetitionDetail from './ProfessorSide/Prof_PetitionDetail';
import Admin_LoginPage from './Admin_LoginPage';
import Admin_Register from './AdminSide/Admin_Register';
import Student_Register from './StudentSide/Student_Register';
import GoogleLogin from './StudentSide/GoogleLogin';
import Admin_Home from './AdminSide/Admin_Home';
import Admin_Pettion from './AdminSide/Admin_Pettion';
import Admin_PetitionDetail from './AdminSide/Admin_PetitionDetail';

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
      <Route path="/register" element={<Student_Register />} />
      <Route path="/Loging-in" element={<GoogleLogin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/petition" element={<Petition />} />
      <Route path="/petition/request-a" element={<RequestA />} />
      <Route path="/petition/request-b" element={<RequestB />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/professor/petition" element={<Prof_Petition/>} />
      <Route path="/professor/petition-detail" element={<Prof_PetitionDetail/>} />
      <Route path="/admin" element={<Admin_LoginPage />} />
      <Route path="/admin/register" element={<Admin_Register />} />
      <Route path="/admin/home" element={<Admin_Home />} />
      <Route path="/admin/petition" element={<Admin_Pettion />} />
      <Route path="/admin/petition-detail" element={<Admin_PetitionDetail />} />

    </Routes>
  );
}

export default App;
