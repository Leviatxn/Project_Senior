import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import './Petition.css';
import ReturnButton from "./Component/ReturnButton";

const RequestB = () => {

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
                                    <h3>คำร้อง <a>เรื่องขอปฏิบัติงานสหกิจศึกษา ปีการศึกษา 2567</a></h3>
                                </div>
                            </div>
                            <div className="request-box-content">
                                <p>ชื่อ-นามสกุล</p>
                                <p>เลขประจำตัวนิสิต</p>
                                <p>สาขาวิชาและชั้นปี</p>
                                <p>อีเมล์*</p>
                                <p>เบอร์โทรศัพท์ที่ติดต่อได้</p>
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

export default RequestB;
