import React from "react";
import CompanySidebar from "./Component/CompanySidebar";
import './Company_Home.css';
import '../Main.css';
import CompanyHeader from "./Component/CompanyHeader";
import Form8 from "./Component/Form8"
const Company_Form8 = () => {

    return (
        <div className="background" style={{height:'auto'}}>
            <CompanySidebar   />
            <CompanyHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container" style={{paddingTop:'20px'}}>
                <Form8/>
                </div>
            </div>

        </div>
    );
}

export default Company_Form8;
