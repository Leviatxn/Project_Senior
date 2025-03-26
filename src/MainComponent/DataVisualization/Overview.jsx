import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import './Main.css';

const Overview = () => {

    return (
        <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="content-container">
                    <div>
                        
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Overview;
