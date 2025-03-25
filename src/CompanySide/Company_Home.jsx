import React from "react";
import CompanySidebar from "./Component/CompanySidebar";
import './Company_Home.css';
import '../Main.css';
import CompanyHeader from "./Component/CompanyHeader";
const Company_Home = () => {

    return (
        <div className="home-background">
            <CompanySidebar   />
            <CompanyHeader/>
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

export default Company_Home;
