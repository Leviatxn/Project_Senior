import React from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import AdminPetitionTable from "./Component/AdminPetitionTable";


const Admin_Project = () => {

    return (
        <div className="home-background">
            <AdminSidebar   />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div style={{border:"1px solid #ddd"}}>
                        <AdminPetitionTable/>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Admin_Project;
