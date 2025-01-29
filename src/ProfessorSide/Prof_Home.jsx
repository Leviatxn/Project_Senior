import React from "react";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
const Prof_Home = () => {

    return (
        <div className="prof-home-background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="notification-header">
                        <h1>แจ้งเตือน</h1>
                    </div> 
                    <div className="notification-container">
                        <div className="notification-box">

                        </div>
                    </div> 
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

export default Prof_Home;
