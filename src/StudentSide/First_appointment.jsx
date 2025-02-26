import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import '../Main.css';
import './Petition.css';
import ReturnButton from "../MainComponent/ReturnButton";
import FirstAppointment from "./Component/FirstAppointment";

const First_appointment = () => {

    return (
        <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="petition-content-container">
                    <div className="request-header">
                        <h1>การนิเทศน์</h1>
                        <div className="request-back">
                            <ReturnButton/>
                        </div>
                    </div>
                    <div className="request-container">
                        <div className="request-box" style={{width:'980px'}}>
                            <div className="request-box-header" >
                                <div className="request-sub-header">
                                    <div className="sub-header-square"/>
                                    <h3>การนิเทศน์สหกิจศึกษา <a>รอบที่ 1 ปีการศึกษา 2567</a></h3>
                                    
                                </div>
                            </div>
                            <div className="request-box-content">
                                <FirstAppointment/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default First_appointment;
