import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './StudentSide/Home';
import Petition from './StudentSide/Petition';
import RequestA from './StudentSide/RequestA';
import RequestB from './StudentSide/RequestB';
import Profile from './StudentSide/Profile';
import Project from './StudentSide/Project'; // เปลี่ยนชื่อ import
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
import Cooperative from './StudentSide/Cooperative';
import Admin_Cooperative from './AdminSide/Admin_Cooperative';
import Admin_UserManagement from './AdminSide/Admin_UserManagement';
import First_appointment from './StudentSide/First_appointment';
import SecondAppointment from './StudentSide/Component/SecondAppointment';
import Second_appointment from './StudentSide/Second_appointment';
import Prof_Project from './ProfessorSide/Prof_Project';
import Prof_Coop from './ProfessorSide/Prof_Coop';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // ตรวจสอบ Token
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
     <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Student_Register />} />
      <Route path="/Loging-in" element={<GoogleLogin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/petition" element={<Petition />} />
      <Route path="/petition/request-a" element={<RequestA />} />
      <Route path="/petition/request-b" element={<RequestB />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cooperative" element={<Cooperative />} />
      <Route path="/project" element={<Project />} />
      <Route path="/appointment-1" element={<First_appointment/>} />
      <Route path="/appointment-2" element={<Second_appointment/>} />


      <Route path="/professor" element={<Prof_LoginPage />} />
      <Route path="/professor/home" element={<Prof_Home/>} />
      <Route path="/professor/petition" element={<Prof_Petition/>} />
      <Route path="/professor/petition-detail" element={<Prof_PetitionDetail/>} />
      <Route path="/professor/project" element={<Prof_Project/>} />
      <Route path="/professor/cooperative" element={<Prof_Coop/>} />


      <Route path="/admin" element={<Admin_LoginPage />} />
      <Route path="/admin/register" element={<Admin_Register />} />
      <Route path="/admin/home" element={<Admin_Home />} />
      <Route path="/admin/petition" element={<Admin_Pettion />} />
      <Route path="/admin/petition-detail" element={<Admin_PetitionDetail />} />
      <Route path="/admin/cooperative" element={<Admin_Cooperative/>} />
      <Route path="/admin/user-management" element={<Admin_UserManagement/>} />

      <Route path="/project" element={<Project />} /> {/* แก้ path จาก /MyProject เป็น /project */}

    </Routes>
  );
}

export default App;
