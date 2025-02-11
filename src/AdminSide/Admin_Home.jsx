import React from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
const Admin_Home = () => {

    return (
        <div className="home-background">
            <AdminSidebar   />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="announcement-header">
                        <h1>ประชาสัมพันธ์</h1>
                    </div> 
                    <div className="announcement-container">
                        <div className="announcement-box">

                        </div>
                    </div> 
                    <div className="student-news-header">
                        <h1>ข่าวนิสิตสหกิจ</h1>
                    </div> 
                    <div className="student-news-container">
                        <div className="student-news-box">

                        </div>
                    </div> 
                </div>
            </div>

        </div>
    );
}

export default Admin_Home;
