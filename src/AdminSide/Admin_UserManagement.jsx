import React from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import AdminPetitionTable from "./Component/AdminPetitionTable";
import AdminUserTable from "./Component/AdminUserTable";


const Admin_UserManagement = () => {
    const year = new Date().toLocaleDateString("th-TH", {
        year: "numeric"
      });
    const today = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
        <div className="home-background">
            <AdminSidebar   />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container" style={{marginTop:'20px'}}>
                    <div className="admin-cooperative-header">
                            <div>
                                <h1 style={{fontSize:'26px',marginBottom:'0'}}>การจัดการผู้ใช้
                                </h1>
                                <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>

                            </div>
                    </div>
                    <div style={{flex:'9'}}>
                        <AdminUserTable/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Admin_UserManagement;
