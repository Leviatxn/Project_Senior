import React from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import Overview from "../MainComponent/DataVisualization/Overview";

const Admin_Overview = () => {

    return (
        <div className="background" style={{height:'auto',paddingBottom:'50px'}}>
            <AdminSidebar />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="cooperative-content-container">
                    <Overview/>
                </div>
            </div>

        </div>
    );
}

export default Admin_Overview;