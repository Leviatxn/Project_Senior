import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import './Sidebar.css';
import Logo from "../../MainComponent/Logo";
import { Box, Typography, Grid, TextField, Button, Avatar, IconButton } from "@mui/material";

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const [userinfo, setUserInfo] = useState(null);
    
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ลบ Token ออกจาก localStorage
        localStorage.removeItem('studentId'); // ลบ Student ID (ถ้ามี)
        navigate("/"); // นำไปหน้า Login
    };

      // ฟังก์ชันเมื่อกดเลือกแถว
  const handleEvaluationClick = (version) => {
    navigate(`/evaluation`, { 
      state: {
               version: version
      }
    });
};
    
    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");
            console.log(studentId)

            if (!studentId) {
                console.error("No student ID found");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/user/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
            try {
              const response = await axios.get(`http://localhost:5000/user_info/${studentId}`, {
                  headers: { Authorization: `Bearer ${token}` },
              });

              if (response.data) {
                setUserInfo(response.data);
                console.log(response.data.first_evaluate_state);
              } else {
                  console.error("ไม่พบข้อมูลผู้ใช้");
              }
          } catch (err) {
              console.error("Error profile user data:", err);

          }
        };

        fetchUserData();
    }, []);

    if (!user || !userinfo) {
        return (
          <div className="sidebar">
          <div className="sidebar-header-container">
            <div className="sidebar-header-content">
              <div className="sidebar-header-img">
              <Avatar sx={{ width: 70, height: 70, mx: "auto" }} />
              </div>
              <div className="sidebar-header">
                <p className="user-name">Loading..</p>
                <p className="user-id">(นิสิต) Loading...</p>
              </div>
            </div>
            <div className="sidebar-header-underline"/>
          </div>
          <div className="menu">
            <div className="logo-container">
              <div className="logo">
                <Logo fontSize="36px"/>
              </div>
              <p className="sub-logo">มหาวิทยาลัยเกษตรศาสตร์</p>
            </div>
            <nav>
              <ul>
              <li ><a href="/home">หน้าหลัก</a></li>
              <li><a href="/petition">คำร้องสหกิจ</a></li>
              <li><a href="/cooperative">การฝึกงานสหกิจ</a></li>
              <li><a href="/overview">สถิติ</a></li>
              <li><a href="/profile">ข้อมูลนิสิต</a></li>
              </ul>
            </nav>
            
          </div>
    
          <div className="logout">
            <div className="sidebar-header-underline"/>
              <a onClick={handleLogout}>ออกจากระบบ</a>
          </div>
        </div>
        )
    }
  return (
    <div className="sidebar">
      <div className="sidebar-header-container">
        <div className="sidebar-header-content">
          <div className="sidebar-header-img">
            <Avatar  src={`http://localhost:5000${userinfo.profile_img}`} sx={{ width: 70, height: 70, mx: "auto" }} onClick={() => navigate("/profile")}/>
          </div>
          <div className="sidebar-header">
            <p className="user-name">{user.username}</p>
            <p className="user-id">(นิสิต) {user.student_id}</p>
          </div>
        </div>
        <div className="sidebar-header-underline"/>
      </div>
      <div className="menu">
        <div className="logo-container">
          <div className="logo">
          <Logo fontSize="36px"/>
          </div>
          <p className="sub-logo">มหาวิทยาลัยเกษตรศาสตร์</p>
        </div>
        <nav>
          <ul>
            <li><a href="/home">หน้าหลัก</a></li>
            <li><a href="/petition">คำร้องสหกิจ</a></li>
            <li><a href="/cooperative">การฝึกงานสหกิจ</a></li>
            {userinfo.is_firstappointment === 1 ? (
              userinfo.first_evaluate_state === 0 ? (
                
                <li><a onClick={()=>(handleEvaluationClick(3))}>การประเมินตนเอง 1</a></li>
              ):(
                <div></div>
              )
            ):(
              <div></div>
            )}
            {userinfo.is_secondappointment === 1 ? (
              userinfo.second_evaluate_state === 0 ? (
                <li><a onClick={()=>(handleEvaluationClick(4))}>การประเมินตนเอง 2</a></li>
              ):(
                <div></div>
              )
            ):(
              <div></div>
            )}
            <li><a href="/overview">สถิติ</a></li>
            <li><a href="/profile">ข้อมูลนิสิต</a></li>
          </ul>
        </nav>
        
      </div>

      <div className="logout">
        <div className="sidebar-header-underline"/>
          <a onClick={handleLogout}>ออกจากระบบ</a>
      </div>
    </div>
  );
};

export default Sidebar;
