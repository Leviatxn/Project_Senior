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
import Prof_Project from './ProfessorSide/Prof_Project';
import Prof_ProjectDetail from './ProfessorSide/Prof_ProjectDetail';
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
import Prof_Coop from './ProfessorSide/Prof_Coop';
import Admin_ProfRegister from './AdminSide/Admin_ProfRegister';
import Prof_evaluation from './ProfessorSide/Prof_evaluation';
import Student_RegisterInfo from './StudentSide/Student_RegisterInfo';
import Form08 from './CompanySide/Form8';
import Form09 from './CompanySide/Form9';


const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("authToken");

  if (!token) return <Navigate to="/" replace />; // ถ้าไม่มี Token ให้ไปหน้า Login

  try {
    const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    const role = user?.role;

    console.log("🔹 Role:", role);

    if (!allowedRoles.includes(role)) {
      console.log(allowedRoles)
      if( role === "student"){
        return <Navigate to="/home" replace />;
      }
      else if( role === "professor"){
        return <Navigate to="/professor/home" replace />;
      }
      else if( role === "admin"){
        return <Navigate to="/admin/home" replace />;
      }
      else if( role === "company"){
        return <Navigate to="/company/home" replace />;
      }
      else
        return <Navigate to="/" replace />;

    }

    return children;
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    return <Navigate to="/" replace />;
  }
};



function App() {
  return (
    <Routes>
     <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Student_Register />} />
      <Route path="/register-profile" element={<Student_RegisterInfo />} />

      <Route path="/Loging-in" element={<GoogleLogin />} />


      <Route path="/home" element={<PrivateRoute allowedRoles={['student']}><Home /></PrivateRoute>} />
      <Route path="/petition" element={<PrivateRoute allowedRoles={['student']}> <Petition /> </PrivateRoute>} />
      <Route path="/petition/request-a" element={<PrivateRoute allowedRoles={['student']}>  <RequestA /> </PrivateRoute>} />
      <Route path="/petition/request-b" element={<PrivateRoute allowedRoles={['student']}> <RequestB /> </PrivateRoute>} />
      <Route path="/profile" element={ <PrivateRoute allowedRoles={['student']}> <Profile /> </PrivateRoute>} />
      <Route path="/cooperative" element={ <PrivateRoute allowedRoles={['student']}> <Cooperative /> </PrivateRoute>} />
      <Route path="/project" element={<PrivateRoute allowedRoles={['student']}> <Project /> </PrivateRoute>} />
      <Route path="/appointment-1" element={<PrivateRoute allowedRoles={['student']}><First_appointment/> </PrivateRoute>} />
      <Route path="/appointment-2" element={<PrivateRoute allowedRoles={['student']}><Second_appointment/></PrivateRoute>} />


      <Route path="/professor" element={<Prof_LoginPage />} />

      <Route path="/professor/home" element={ <PrivateRoute allowedRoles={['professor']}> <Prof_Home/> </PrivateRoute>} />
      <Route path="/professor/petition" element={<PrivateRoute allowedRoles={['professor']}><Prof_Petition/></PrivateRoute>} />
      <Route path="/professor/petition-detail" element={<PrivateRoute allowedRoles={['professor']}><Prof_PetitionDetail/></PrivateRoute>} />
      <Route path="/professor/project" element={<PrivateRoute allowedRoles={['professor']}><Prof_Project/></PrivateRoute>} />
      <Route path="/professor/cooperative" element={<PrivateRoute allowedRoles={['professor']}><Prof_Coop/></PrivateRoute>} />
      <Route path="/professor/project-detail" element={<PrivateRoute allowedRoles={['professor']}><Prof_ProjectDetail/></PrivateRoute>} />
      <Route path="/professor/evaluation" element={<PrivateRoute allowedRoles={['professor']}><Prof_evaluation/></PrivateRoute>} />


      <Route path="/admin" element={<Admin_LoginPage />} />

      <Route path="/admin/register" element={<PrivateRoute allowedRoles={['admin']}> <Admin_Register /> </PrivateRoute>} />
      <Route path="/admin/prof-register" element={<PrivateRoute allowedRoles={['admin']}><Admin_ProfRegister /></PrivateRoute>} />
      <Route path="/admin/home" element={<PrivateRoute allowedRoles={['admin']}><Admin_Home /></PrivateRoute>} />
      <Route path="/admin/petition" element={<PrivateRoute allowedRoles={['admin']}><Admin_Pettion /></PrivateRoute>} />
      <Route path="/admin/petition-detail" element={<PrivateRoute allowedRoles={['admin']}><Admin_PetitionDetail /></PrivateRoute>} />
      <Route path="/admin/cooperative" element={<PrivateRoute allowedRoles={['admin']}><Admin_Cooperative/></PrivateRoute>} />
      <Route path="/admin/user-management" element={<PrivateRoute allowedRoles={['admin']}><Admin_UserManagement/></PrivateRoute>} />

      <Route path="/company/form-8" element={<Form08 />} />
      <Route path="/company/form-9" element={<Form09 />} />



    </Routes>
  );
}

export default App;
