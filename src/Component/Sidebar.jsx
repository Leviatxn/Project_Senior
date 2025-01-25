import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import './Sidebar.css';
import Logo from "./Logo";

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ลบ Token ออกจาก localStorage
        localStorage.removeItem('studentId'); // ลบ Student ID (ถ้ามี)
        navigate("/"); // นำไปหน้า Login
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

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
        };

        fetchUserData();
    }, []);

    if (!user) {
        return (
          <div className="sidebar">
          <div className="sidebar-header-container">
            <div className="sidebar-header-content">
              <div className="sidebar-header-img">
                  <div className="sidebar-header-circle"/>
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
                <Logo fontSize="40px"/>
              </div>
              <p className="sub-logo">มหาวิทยาลัยเกษตรศาสตร์</p>
            </div>
            <nav>
              <ul>
              <li ><a href="/home">หน้าหลัก</a></li>
              <li><a href="/cooperative">คำร้องสหกิจ</a></li>
              <li><a href="/cooperative">การฝึกงานสหกิจ</a></li>
              <li><a href="/overview">สถิติ</a></li>
              <li><a href="/profile">ข้อมูลนิสิต</a></li>
              <li><a href="/contact">ติดต่อสหกิจ</a></li>
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
            <div className="sidebar-header-circle"/>
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
            <Logo fontSize="40px"/>
          </div>
          <p className="sub-logo">มหาวิทยาลัยเกษตรศาสตร์</p>
        </div>
        <nav>
          <ul>
            <li><a href="/home">หน้าหลัก</a></li>
            <li><a href="/petition">คำร้องสหกิจ</a></li>
            <li><a href="/cooperative">การฝึกงานสหกิจ</a></li>
            <li><a href="/overview">สถิติ</a></li>
            <li><a href="/profile">ข้อมูลนิสิต</a></li>
            <li><a href="/contact">ติดต่อสหกิจ</a></li>
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
