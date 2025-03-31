import React from "react";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import Overview from "../MainComponent/DataVisualization/Overview";

const Prof_Overview = () => {

    return (
        <div className="prof-home-background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="cooperative-content-container">
                    <Overview/>
                </div>
            </div>

        </div>
    );
}

export default Prof_Overview;
