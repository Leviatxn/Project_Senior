import React from "react";
import CompanySidebar from "./Component/CompanySidebar";
import './Company_Home.css';
import '../Main.css';
import CompanyHeader from "./Component/CompanyHeader";
import Form9 from "./Component/Form9"
const Company_Form8 = () => {

    return (
        <div className="home-background">
            <CompanySidebar   />
            <CompanyHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                <Form9/>
                </div>
            </div>

        </div>
    );
}

export default Company_Form8;
