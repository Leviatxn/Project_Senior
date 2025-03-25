import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import './CompanySidebar.css';
import Logo from "../../MainComponent/Logo";
import { Box, Typography, Grid, TextField, Button, Avatar, IconButton } from "@mui/material";

const CompanySidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ลบ Token ออกจาก localStorage
        localStorage.removeItem('studentId'); // ลบ Student ID (ถ้ามี)
        navigate("/"); // นำไปหน้า Login
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            const email = localStorage.getItem("email");
            const token = localStorage.getItem("authToken");

            if (!email) {
                console.error("No student ID found");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/user-email/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return (
          <div className="companysidebar">
          <div className="companysidebar-header-container">
            <div className="companysidebar-header-content">
              <div className="companysidebar-header-img">
                  <div className="companysidebar-header-circle"/>
              </div>
              <div className="companysidebar-header">
                <p className="user-name">Loading</p>
                <p className="user-id">(company) Loading...</p>
              </div>
            </div>
            <div className="companysidebar-header-underline"/>
          </div>
          <div className="menu">
            <div className="logo-container">
              <div className="logo">
                <Logo overlayColor = "#fff" fontSize="35px"/>
                <p className="sub-logo" style={{color:'#fff'}}>ระบบการฝึกงานกับบริษัทสหกิจ</p>
              </div>
            </div>
            <nav>
              <ul>
              <li ><a href="/company/home">หน้าหลัก</a></li>
              <li><a href="/company/petition">นิสิตสหกิจในบริษัททั้งหมด</a></li>
              <li><a href="/company/project">โครงงานสหกิจทั้งหมด</a></li>
              <li><a href="/company/Company_Form8">แบบประเมินผลนิสิตสหกิจศึกษา 08</a></li>
              <li><a href="/company/Company_Form9">แบบประเมินรายงานนิสิตสหกิจศึกษา 09</a></li>
              <li><a href="/company/overview">สถิติ</a></li>
              </ul>
            </nav>
          </div>
    
          <div className="logout">
            <a onClick={handleLogout} style={{color:'white'}}>ออกจากระบบ</a>
            <div className="companysidebar-header-underline"/>
          </div>
        </div>
        )
    }
  return (
    <div className="companysidebar">
      <div className="companysidebar-header-container">
        <div className="companysidebar-header-content">
          <div className="companysidebar-header-img">
            <div className="companysidebar-header-circle"/>
          </div>
          <div className="companysidebar-header">
            <p className="user-name">{user.username}</p>
            <p className="user-id">({user.role}) {user.student_id}</p>
          </div>
        </div>
        <div className="companysidebar-header-underline"/>
      </div>
      <div className="menu">
        <div className="logo-container">
            <div className="logo">
            <Logo overlayColor = "#fff" fontSize="35px"/>
            <p className="sub-logo" style={{color:'#fff'}}>ระบบการฝึกงานกับบริษัทสหกิจ</p>
            </div>
        </div>
        <nav>
          <ul>
            <li ><a href="/company/home">หน้าหลัก</a></li>
            <li><a href="/company/petition">นิสิตสหกิจในบริษัททั้งหมด</a></li>
            <li><a href="/company/project">โครงงานสหกิจทั้งหมด</a></li>
            <li><a href="/company/Company_Form8">แบบประเมินผลนิสิต 08</a></li>
            <li><a href="/company/Company_Form9">แบบประเมินรายงาน 09</a></li>
            <li><a href="/company/overview">สถิติ</a></li>
          </ul>
        </nav>
        
      </div>

      <div className="logout">
            <a onClick={handleLogout} style={{color:'white'}}>ออกจากระบบ</a>
            <div className="companysidebar-header-underline"/>
          </div>
    </div>
  );
};

export default CompanySidebar;
