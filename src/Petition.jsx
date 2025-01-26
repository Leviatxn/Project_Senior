import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import axios from "axios";
import "./Home.css";
import "./Main.css";
import "./Petition.css";
import PetitionStepper from "./Component/Petition/PetitionStepper";

const Petition = () => {
    const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ทั้งหมด
    const [currentPetition, setCurrentPetition] = useState(""); // เก็บค่า current_petition จากฐานข้อมูล
    const steps = [
        "ยื่นเอกสาร",
        "เข้าที่ประชุม",
        "อนุมัติ",
        "ส่งไปที่เจ้าหน้าที่",
        "ออกหนังสือส่งตัว",
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId) {
                console.error("No student ID found");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/user_info/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
                setCurrentPetition(response.data.current_petition); // อัปเดต current_petition
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
            
        };

        fetchUserData();
    }, []);

    return (
        <div className="petition-background">
            <Sidebar />
            <Banner />
            <div className="main-container">
                <div className="Side-Space" />
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
                                <div className="sub-header-square" />
                                <h3>
                                    คำร้องบัจจุบัน:{" "}
                                    <a>
                                        {currentPetition
                                            ? `${currentPetition} ฉบับที่ 1`
                                            : "ไม่มีคำร้องในระบบ"}
                                    </a>
                                </h3>
                            </div>
                            <PetitionStepper steps={steps} activeStep={1} />
                        </div>
                    </div>
                    <div className="main-petition">
                        <div className="petition-menu-box">
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3>ยื่นคำร้องสหกิจ</h3>
                            </div>
                            <div className="petition-underline" />
                            <div className="petition-menu">
                                <nav>
                                    <ul>
                                        <li>
                                            <a href="/petition/request-a">
                                                ยื่นขอเป็นนิสิตสหกิจศึกษา
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/petition/request-b">
                                                ยื่นคำร้องปฏิบัติงานสหกิจ
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                                <div className="petition-underline" />
                            </div>
                        </div>
                        <div className="my-petition">
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3>คำร้องฉัน</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Petition;
