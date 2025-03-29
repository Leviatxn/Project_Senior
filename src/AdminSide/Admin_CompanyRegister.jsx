import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Admin_Register.css';
import Logo from '../MainComponent/Logo';
import RoleSwitcher from '../MainComponent/RoleSwitcher';
import ReturnButton from '../MainComponent/ReturnButton';
import Swal from 'sweetalert2';

const Admin_CompanyRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        phone_num: '',
        password: '',
        confirmPassword: '',
        role: 'company',
      });
      const [message, setMessage] = useState('');
      
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match!');
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ : "+ message,
                    });
          return;
        }
    
        try {
          const res = await axios.post('http://localhost:5000/register', formData, { withCredentials: true });
          setMessage(res.data.message);
          Swal.fire({
            position: "top",
            icon: "success",
            title: "ลงทะเบียนสำเร็จ",
            timer: 2000
          });
          navigate(-1);

        } 
        catch (err) {
          setMessage('Registration failed. Please try again.');
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ : "+ message,
                  });
        } 
      };
        
  return (
    <div className="login-page" style={{justifyContent:'center',alignItems: 'center'}}>
      {/* Section ซ้าย */}
      <div className="admin-register-sidebar">
        <div className="login-main_container" style={{display: 'flex',padding:'80px 40px 80px 40px'}}>
            <div style={{flex:'1',borderRight:'1px solid rgba(215, 215, 215, 0.28)',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',padding: '200px 100px 200px 100px'}}>
                <p className="prof-subtitle" style={{marginBottom:'40px',color:'#fff'}}>
                    ลงทะเบียนบริษัท
                </p>
                <Logo overlayColor = "#ffff" color='#A60003'/>
                <p className="prof-subtitle">
                    ระบบสหกิจศึกษา
                </p>
                <p className="prof-sub-desciption">
                    มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
                </p>
            </div>
 
            <div style={{flex:'3',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',paddingTop:'100px'}}>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="Name">ชื่อบริษัท *</label>
                    </div>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="ชื่อบริษัท"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="Email">อีเมล์บริษัท *</label>
                    </div>
                    <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="อีเมล์"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="Num">เบอร์โทรศัพท์ *</label>
                    </div>
                    <input 
                        type="text"
                        name="phone_num"
                        placeholder="เบอร์โทรศัพท์"
                        value={formData.phone_num}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="password">รหัสผ่าน *</label>
                    </div>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="admin-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="password">ยืนยันรหัสผ่าน *</label>
                    </div>
                    <input 
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
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
            <div >
                <ReturnButton/>
            </div>
        </div>
      </div>

    {/* Background */}
      <div className="login-background"></div>
    </div>
  );
};

export default Admin_CompanyRegister;
