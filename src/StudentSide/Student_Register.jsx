import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Student_Register.css';
import Logo from '../MainComponent/Logo';
import Swal from 'sweetalert2';

const Student_Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    student_id: '',
    phone_num: '',
    password: '',
    confirmPassword: '',
    role: 'student',
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
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', formData, { withCredentials: true });
      setMessage(res.data.message);
      console.log(res.data.message); // Registration complete!
      Swal.fire({
        title: "Good job!",
        text: "ลงทะเบียนเสร็จสิ้น",
        icon: "success"
      });
    } 
    catch (err) {
      setMessage('Registration failed. Please try again.');
      console.error(err.response.data.message); // Error registering user.
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        footer: err.response.data.message,
      });
    } 
  };
    
  return (
    <div className="login-page" style={{justifyContent:'center',alignItems: 'center'}}>
      {/* Section ซ้าย */}
      <div className="student-register-box">
        <div className="login-main_container" style={{display: 'flex',padding:'80px 40px 80px 40px'}}>
            <div style={{flex:'1',borderRight:'1px solid rgba(110, 110, 110, 0.49)',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',padding: '200px 100px 200px 100px'}}>
                <Logo/>
                <p className="student-subtitle" style={{color:'#000'}}>
                    ระบบสหกิจศึกษา
                </p>
                <p className="student-sub-desciption">
                    มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
                </p>
            </div>

            <div style={{flex:'3',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',paddingTop:'100px'}}>
                <form className="login-form" onSubmit={handleSubmit}>
                <div className="student-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="Email" style={{color:'#000'}}> ชื่อ-นามสกุล (ภาษาอังกฤษ) *</label>
                    </div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Input your Name - surname"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="student-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="fullname" style={{color:'#000'}}>รหัสนิสิต *</label>
                    </div>
                    <input 
                        type="text"
                        name="student_id"
                        placeholder="Student ID"
                        value={formData.student_id}
                        onChange={handleChange}
                    />
                </div>
                <div className="student-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="fullname" style={{color:'#000'}}>เบอร์โทรศัพท์ *</label>
                    </div>
                    <input 
                        type="text"
                        name="phone_num"
                        placeholder="Phone Number"
                        value={formData.phone_num}
                        onChange={handleChange}
                    />
                </div>
                <div className="student-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="password" style={{color:'#000'}}>รหัสผ่าน</label>
                    </div>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="student-register-input-group">
                    <div style={{width: '570px'}}>
                        <label htmlFor="password" style={{color:'#000'}}>ยืนยันรหัสผ่าน</label>
                    </div>
                    <input 
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="register-submit-container" style={{marginTop:'100px '}}>
                    <button type="submit" className="register-submit-button">
                    <span style={{color: 'black'}}>ลงทะเบียน</span>
                    <svg style={{stroke:'#000'}} width="15px" height="10px" viewBox="0 0 13 10">
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

export default Student_Register;
