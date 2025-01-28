import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Prof_LoginPage.css';
import Logo from './MainComponent/Logo';
import RoleSwitcher from './MainComponent/RoleSwitcher';

const Prof_LoginPage = () => {

    const [student_id, setStuden_ID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const googleAuth = () => {
        window.location.href = 'http://localhost:5000/auth/google';
      };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Loging in')
            const response = await axios.post("http://localhost:5000/login", { student_id, password });         
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
    <div className="login-page">
      {/* Section ซ้าย */}
      <div className="prof-login-sidebar">
        <div className='role-container'>
            <RoleSwitcher/>
        </div>
        <div className="login-main_container">
            <Logo overlayColor = "#fff"/>

            <p className="prof-subtitle">
                ระบบสหกิจศึกษา
            </p>
            <p className="prof-sub-desciption">
                มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
            </p>
            <h2 className="prof-title">อาจารย์</h2>
            <p className="prof-login-text">เข้าสู่ระบบ</p>

            {/* ฟอร์ม */}
            <form className="login-form" onSubmit={handleLogin}>
            <div className="prof-input-group">
                <label htmlFor="Email">อีเมล์</label>
                <input
                type="email"
                id="email"
                placeholder="อีเมล์"
                value={student_id}
                onChange={(e) => setStuden_ID(e.target.value)}
                />
            </div>
            <div className="prof-input-group">
                <label htmlFor="password">รหัสผ่าน</label>
                <input 
                type="password" 
                id="password" 
                placeholder="รหัส" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <div className="submit-container">
                <button type="submit" className="submit-button">
                    <img src="public/right-arrow.png" alt="เข้าสู่ระบบ" style={{ width: '30px', height: '30px' }} />
                </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <a href="/forgot-password" className="forgot-password-link">
                ลืมรหัสผ่าน
            </a>
            </form>
        </div>
        <div className='register-container'>
            <div className="extra-links">
                <button onClick={googleAuth}>Login with Google</button>
            </div>
        </div>
      </div>

    {/* Background */}
      <div className="login-background"></div>
    </div>
  );
};

export default Prof_LoginPage;
