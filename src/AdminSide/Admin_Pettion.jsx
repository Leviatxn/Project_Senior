import React from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import '../ProfessorSide/Prof_Petition.css'
import PetitionTable from "../ProfessorSide/Component/PetitionTable";

const Admin_Pettion = () => {

    return (
        <div className="home-background">
            <AdminSidebar   />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box"  style={{marginTop:'20px'}} >
                            <PetitionTable/>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default Admin_Pettion;
