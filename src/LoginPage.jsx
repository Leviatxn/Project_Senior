import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import Logo from './MainComponent/Logo';
import RoleSwitcher from './MainComponent/RoleSwitcher';

const LoginPage = () => {

    const [student_id, setStuden_ID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const googleAuth = () => {
        const googleLoginUrl = 'http://localhost:5000/auth/google';
        const newWindow = window.open(googleLoginUrl, '_blank', 'width=500,height=600');
    
        const checkPopup = setInterval(() => {
            if (newWindow.closed) {
                clearInterval(checkPopup);
                fetchUserData();
            }
        }, 1000);
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/auth/user", { withCredentials: true });
            const { student_id, token } = response.data;
    
            // 🔹 เก็บ Token และ Student ID ใน Local Storage
            localStorage.setItem("authToken", token);
            localStorage.setItem("studentId", student_id);
    
            // 🔹 Redirect ไปหน้า Home
            navigate("/home");
        } catch (err) {
            console.error("Error fetching user data:", err.response?.data?.error || err.message);
        }
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
      <div className="login-sidebar">
        <div className='role-container'>
            <RoleSwitcher/>
        </div>
        <div className="login-main_container">
            <Logo />

            <p className="subtitle">
                ระบบสหกิจศึกษา
            </p>
            <p className="sub-desciption">
                มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
            </p>
            <h2 className="nisit-title">นิสิต</h2>
            <p className="login-text">เข้าสู่ระบบ</p>

            {/* ฟอร์ม */}
            <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
                <label htmlFor="studentId">เลขประจำตัวนิสิต</label>
                <input
                type="text"
                id="studentId"
                placeholder="รหัสประจำตัวนิสิต"
                value={student_id}
                onChange={(e) => setStuden_ID(e.target.value)}
                />
            </div>
            <div className="input-group">
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
                    <span>เข้าสู่ระบบ</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 74 74"
                        height="34"
                        width="34"
                    >
                        <circle stroke-width="3" stroke="white" r="35.5" cy="37" cx="37"></circle>
                        <path
                        fill="white"
                        d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                        ></path>
                    </svg>
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <a href="/forgot-password" className="forgot-password-link">
                ลืมรหัสผ่าน
            </a>
            </form>
        </div>
        <div className='register-container'>
            <div style={{marginTop:'30px',display:'flex',justifyContent: 'center',alignItems: 'center'}}>
                <button onClick={googleAuth} className="google-button">
                    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                    เข้าสู่ระบบด้วย Google
                </button>
            </div>
        </div>
      </div>

    {/* Background */}
      <div className="login-background"></div>
    </div>
  );
};

export default LoginPage;
