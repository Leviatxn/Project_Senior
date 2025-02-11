import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './GoogleLogin.css';
import Logo from '../MainComponent/Logo';


const GoogleLogin = () => {

    const [student_id, setStuden_ID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    
    useEffect(() => {
        setTimeout(() => {
            navigate("/home");
        }, 2000);
    }, []);

  return (
      <div className="googlelogin-background">
        <div style={{marginBottom:'20%'}}>
            <Logo/>
            <p className="student-subtitle" style={{color:'#000'}}>
                ระบบสหกิจศึกษา
            </p>
            <p className="student-sub-desciption">
                มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
            </p>
        </div>
        <div className="spinner">
            <div />   
            <div />    
            <div />    
            <div />    
            <div />    
            <div />    
            <div />    
            <div />    
            <div />    
            <div />    
        </div>
        <div>
            <p className="student-sub-desciption" style={{color: '#000',fontSize:'16px'}}>
                เข้าสู่ระบบ
            </p>
        </div>
      </div>
      
  );
};

export default GoogleLogin;
