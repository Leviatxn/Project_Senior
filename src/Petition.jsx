import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import './Petition.css';
import PetitionStepper from "./Component/Petition/PetitionStepper";
const Petition = () => {
    const steps = [
        'ยื่นเอกสาร',
        'เข้าที่ประชุม',
        'อนุมัติ',
        'ส่งไปที่เจ้าหน้าที่',
        'ออกหนังสือส่งตัว',
      ];

    return (
        <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="petition-content-container">
                    <div className="petition-header">
                        <h1>คำร้องสหกิจ</h1>
                        <div className="petition-detail">
                            <a href="/petition-detail">รายละเอียดการฝึกงานสหกิจ</a> 
                        </div>
                    </div> 
                    <div className="showing-petition-container">
                        <div className="showing-petition">
                            <div className="sub-header">
                                <div className="sub-header-square"/>
                                <h3>คำร้องบัจจุบัน <a>คำร้องขอเป็นนิสิตปฏิบัติงานสหกิจศึกษา ฉบับที่ 1</a></h3>
                            </div>
                            <PetitionStepper steps={steps} activeStep={0} />
                        </div>
                    </div>
                    <div className="main-petition">
                        <div className="petition-menu-box">
                            <div className="sub-header">
                                <div className="sub-header-square"/>
                                <h3>ยื่นคำร้องสหกิจ</h3>
                            </div>
                            <div className="petition-underline"/>
                            <div className="petition-menu">
                            <nav>
                                <ul>
                                    <li><a href="/petition/request-a">ยื่นขอเป็นนิสิตปฏิบัติงานสหกิจศึกษา</a></li>
                                    <li><a href="/petition/request-b">ยื่นคำร้องปฏิบัติงานสหกิจ</a></li>
                                </ul>
                                </nav>
                                <div className="petition-underline"/>
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
