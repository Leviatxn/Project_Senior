import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import './AdminSidebar.css';
import Logo from "../../MainComponent/Logo";

const AdminSidebar = () => {
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
          <div className="adminsidebar">
          <div className="adminsidebar-header-container">
            <div className="adminsidebar-header-content">
              <div className="adminsidebar-header-img">
                  <div className="adminsidebar-header-circle"/>
              </div>
              <div className="adminsidebar-header">
                <p className="user-name">Loading</p>
                <p className="user-id">(นิสิต) Loading...</p>
              </div>
            </div>
            <div className="adminsidebar-header-underline"/>
          </div>
          <div className="menu">
            <div className="logo-container">
              <div className="logo">
                <Logo overlayColor = "#fff" fontSize="35px"/>
                <p className="sub-logo" style={{color:'#fff'}}>ระบบผู้ดูแลและเจ้าหน้าที่</p>
              </div>
            </div>
            <nav>
              <ul>
              <li ><a href="/admin/home">หน้าหลัก</a></li>
              <li><a href="/admin/petition">คำร้องสหกิจทั้งหมด</a></li>
              <li><a href="/cooperative">โครงงานสหกิจทั้งหมด</a></li>
              <li><a href="/overview">ข้อมูลนิสิต</a></li>
              <li><a href="/profile">ข้อมูลอาจารย์</a></li>
              <li><a href="/contact">สถิติ</a></li>
              </ul>
            </nav>
          </div>
    
          <div className="logout">
            <a onClick={handleLogout} style={{color:'white'}}>ออกจากระบบ</a>
            <div className="adminsidebar-header-underline"/>
          </div>
        </div>
        )
    }
  return (
    <div className="adminsidebar">
      <div className="adminsidebar-header-container">
        <div className="adminsidebar-header-content">
          <div className="adminsidebar-header-img">
            <div className="adminsidebar-header-circle"/>
          </div>
          <div className="adminsidebar-header">
            <p className="user-name">{user.username}</p>
            <p className="user-id">({user.role}) {user.student_id}</p>
          </div>
        </div>
        <div className="adminsidebar-header-underline"/>
      </div>
      <div className="menu">
        <div className="logo-container">
            <div className="logo">
            <Logo overlayColor = "#fff" fontSize="35px"/>
            <p className="sub-logo" style={{color:'#fff'}}>ระบบผู้ดูแลและเจ้าหน้าที่</p>
            </div>
        </div>
        <nav>
          <ul>
            <li ><a href="/admin/home">หน้าหลัก</a></li>
            <li><a href="/admin/petition">คำร้องสหกิจทั้งหมด</a></li>
            <li><a href="/cooperative">โครงงานสหกิจทั้งหมด</a></li>
            <li><a href="/overview">ข้อมูลนิสิต</a></li>
            <li><a href="/profile">ข้อมูลอาจารย์</a></li>
            <li><a href="/contact">สถิติ</a></li>
          </ul>
        </nav>
        
      </div>

      <div className="logout">
            <a onClick={handleLogout} style={{color:'white'}}>ออกจากระบบ</a>
            <div className="adminsidebar-header-underline"/>
          </div>
    </div>
  );
};

export default AdminSidebar;
