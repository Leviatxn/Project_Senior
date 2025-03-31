import React from "react";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import Form09 from "./Component/Fetch_Form09";
const Prof_Test = () => {

    return (
        <div className="prof-project">
            <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="project-table-container">
                        <div className="project-table-box">
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
    );
}

export default Prof_Test;
