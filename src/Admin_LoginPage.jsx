import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Admin_LoginPage.css';
import Logo from './MainComponent/Logo';
import RoleSwitcher from './MainComponent/RoleSwitcher';

const Admin_LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const Register = () => {
        navigate('/admin/register');
      };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            
            console.log('11' - 1)
            const response = await axios.post("http://localhost:5000/admin-login", { email, password });         
            const { email: loggedInEmail, token } = response.data;

            localStorage.setItem("email", loggedInEmail);
            localStorage.setItem("authToken", token);

            // ไปยังหน้า Home
            navigate("/admin/home");
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
      <div className="admin-login-sidebar">
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
            <h2 className="prof-title">เจ้าหน้าที่</h2>
            <p className="admin-login-text">เข้าสู่ระบบ</p>

            <div>
                <form className="login-form" onSubmit={handleLogin}>
                <div className="admin-input-group">
                    <div style={{width: '450px'}}>
                        <label htmlFor="Email">อีเมล์</label>
                    </div>
                    <input
                    type="email"
                    id="email"
                    placeholder="อีเมล์"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="admin-input-group">
                    <div style={{width: '450px'}}>
                        <label htmlFor="password">รหัสผ่าน</label>
                    </div>
                    <input 
                    type="password" 
                    id="password" 
                    placeholder="รหัส" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="submit-container" style={{marginTop:'80px '}}>
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
        </div>
        <div className='register-container'>
            <div className="extra-links">
                <div onClick={Register} style={{ color: "#fff",fontSize:'14px',fontWeight:'300',cursor:'pointer' }}>ลงทะเบียน</div>
            </div>
        </div>
      </div>

    {/* Background */}
      <div className="login-background"></div>
    </div>
  );
};

export default Admin_LoginPage;
