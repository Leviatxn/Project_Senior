import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import './Prof_Sidebar.css';
import Logo from "../../MainComponent/Logo";

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
          <div className="prof-sidebar">
          <div className="prof-sidebar-header-container">
            <div className="prof-sidebar-header-content">
              <div className="prof-sidebar-header-img">
                  <div className="prof-sidebar-header-circle"/>
              </div>
              <div className="prof-sidebar-header">
                <p className="prof-user-name">Loading..</p>
                <p className="prof-user-id">(นิสิต) Loading...</p>
              </div>
            </div>
            <div className="prof-sidebar-header-underline"/>
          </div>
          <div className="prof-menu">
            <div className="prof-logo-container">
              <div className="logo">
                <Logo fontSize="36px" overlayColor = "#fff" />
                <p className="prof-sub-logo">มหาวิทยาลัยเกษตรศาสตร์</p>
              </div>
            </div>
            <nav>
              <ul>
              <li ><a href="/professor/home">หน้าหลัก</a></li>
              <li><a href="/professor/petition">คำร้องสหกิจทั้งหมด</a></li>
              <li><a href="/professor/project">โครงงานสหกิจทั้งหมด</a></li>
              <li><a href="/professor/supervision">การนิเทศน์</a></li>
              <li><a href="/professor/cooperative">ติดตามการฝึกงาน</a></li>
              <li><a href="/contact">สถิติ</a></li>
              </ul>
            </nav>
            
          </div>
    
          <div className="prof-logout">
            <div className="prof-sidebar-header-underline"/>
              <a onClick={handleLogout}>ออกจากระบบ</a>
          </div>
        </div>
        )
    }
  return (
    <div className="prof-sidebar">
      <div className="prof-sidebar-header-container">
        <div className="prof-sidebar-header-content">
          <div className="prof-sidebar-header-img">
            <div className="prof-sidebar-header-circle"/>
          </div>
          <div className="prof-sidebar-header">
            <p className="prof-user-name">{user.username}</p>
            <p className="prof-user-id">(นิสิต) {user.student_id}</p>
          </div>
        </div>
        <div className="prof-sidebar-header-underline"/>
      </div>
      <div className="prof-menu">
        <div className="prof-logo-container">
          <div className="prof-logo">
            <Logo fontSize="40px" overlayColor = "#fff" />
          </div>
          <p className="prof-sub-logo">มหาวิทยาลัยเกษตรศาสตร์</p>
        </div>
        <nav>
          <ul>
              <li ><a href="/professor/home">หน้าหลัก</a></li>
              <li><a href="/professor/petition">คำร้องสหกิจทั้งหมด</a></li>
              <li><a href="/professor/project">โครงงานสหกิจทั้งหมด</a></li>
              <li><a href="/professor/supervision">การนิเทศน์</a></li>
              <li><a href="/professor/cooperative">ติดตามการฝึกงาน</a></li>
              <li><a href="/contact">สถิติ</a></li>
          </ul>
        </nav>
        
      </div>

      <div className="prof-logout">
        <div className="prof-sidebar-header-underline"/>
          <a onClick={handleLogout}>ออกจากระบบ</a>
      </div>
    </div>
  );
};

export default Sidebar;
