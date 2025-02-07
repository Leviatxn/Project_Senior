import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Admin_Register.css';
import Logo from '../MainComponent/Logo';
import RoleSwitcher from '../MainComponent/RoleSwitcher';

const Admin_Register = () => {

    const [student_id, setStuden_ID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const googleAuth = () => {
        navigate('/admin/register');
      };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Loging in')
            const response = await axios.post("http://localhost:5000/admin-login", { student_id, password });         
            const { student_id: loggedInStudentId, token } = response.data;

            localStorage.setItem("studentId", loggedInStudentId);
            localStorage.setItem("authToken", token);

            // ไปยังหน้า Home
            navigate("/home");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError("Error logging in");
            }
        }
    };
    
  return (
    <div className="login-page" style={{justifyContent:'center',alignItems: 'center'}}>
      {/* Section ซ้าย */}
      <div className="admin-register-sidebar">
        <div className="login-main_container" style={{display: 'flex',padding:'80px 40px 80px 40px'}}>
            <div style={{flex:'1',borderRight:'1px solid rgba(215, 215, 215, 0.28)',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',padding: '200px 100px 200px 100px'}}>
                <Logo overlayColor = "#ffff"/>
                <p className="prof-subtitle">
                    ระบบสหกิจศึกษา
                </p>
                <p className="prof-sub-desciption">
                    มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
                </p>
            </div>

            <div style={{flex:'3',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',paddingTop:'100px'}}>
                <form className="login-form" onSubmit={handleLogin}>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="Email">อีเมล์ ( โปรดใช้เมล์ของมหาวิทยาลัย) *</label>
                    </div>
                    <input
                    type="email"
                    id="email"
                    placeholder="อีเมล์"
                    value={student_id}
                    onChange={(e) => setStuden_ID(e.target.value)}
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="fullname">ชื่อ - นามสกุล *</label>
                    </div>
                    <input 
                    type="text" 
                    id="fullname" 
                    placeholder="ชื่อ - นามสกุล" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="fullname">รหัสผ่าน *</label>
                    </div>
                    <input 
                    type="password" 
                    id="password" 
                    placeholder="รหัสผ่าน" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="password">ยืนยันรหัสผ่าน</label>
                    </div>
                    <input 
                    type="password" 
                    id="password" 
                    placeholder="ยืนยันรหัสผ่าน *" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="register-submit-container" style={{marginTop:'100px '}}>
                    <button type="submit" className="register-submit-button">
                    <span>ลงทะเบียน</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5" />
                        <polyline points="8 1 12 5 8 9" />
                    </svg>
                    </button>
                </div>
                </form>
            </div>
        </div>
      </div>

    {/* Background */}
      <div className="login-background"></div>
    </div>
  );
};

export default Admin_Register;
