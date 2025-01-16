import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import './Petition.css';
const Petition = () => {

    return (
        <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="petition-content-container">
                    <div className="petition-header">
                        <h1>คำร้องสหกิจ</h1>
                    </div>
                    <div className="showing-petition-container">
                        <div className="showing-petition">
                            <div className="sub-header">
                                <div className="sub-header-square"/>
                                <h3>คำร้องบัจจุบัน</h3>
                            </div>
                        </div>
                    </div>
                    <div className="main-petition">
                        <div className="petition-menu">
                            <div className="sub-header">
                                <div className="sub-header-square"/>
                                <h3>คำร้องสหกิจ</h3>
                            </div>
                        </div>
                        <div className="my-petition">
                            <div className="sub-header">
                                <div className="sub-header-square"/>
                                <h3>คำร้องฉัน</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Petition;
