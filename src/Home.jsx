import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';

const Home = () => {

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

export default Home;
