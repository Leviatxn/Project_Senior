import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import './Main.css';
import './Petition.css';
import ReturnButton from "./Component/ReturnButton";
import RequestAForm from "./Component/RequestAForm";

const RequestA = () => {

    return (
        <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="petition-content-container">
                    <div className="request-header">
                        <h1>ยืนคำร้องสหกิจ</h1>
                        <div className="request-back">
                            <ReturnButton/>
                        </div>
                    </div>
                    <div className="request-container">
                        <div className="request-box">
                            <div className="request-box-header">
                                <div className="request-sub-header">
                                    <div className="sub-header-square"/>
                                    <h3>คำร้อง <a>เรื่องยื่นขอเป็นนิสิตสหกิจศึกษา ปีการศึกษา 2567</a></h3>
                                    
                                </div>
                            </div>
                            <div className="request-box-content">
                                <RequestAForm/>
                                
                            </div>
                            <div className="request-box-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default RequestA;
