import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import axios from "axios";
import "./Home.css";
import "../Main.css";
import "./Petition.css";
import PetitionStepper from "./Component/Petition/PetitionStepper";
import MyPetitionTable from "./Component/Petition/MyPetitionTable";

const Petition = () => {
    const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ทั้งหมด
    const [currentPetition, setCurrentPetition] = useState(""); // เก็บค่า current_petition จากฐานข้อมูล
    const [state, setState] = useState(0); 

    const steps = [
        "ยื่นคำร้องรอการตรวจสอบ",
        "เข้าที่ประชุม",
        "ส่งไปที่เจ้าหน้าที่",
        "คำร้องอนุมัติ",
        "เสร็จสิ้น",
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
                    `http://localhost:5000/lastpetition/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
                setCurrentPetition(response.data.Petition_name); // อัปเดต current_petition
                setState(response.data.Progress_State)
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
                                            ? `${currentPetition} ฉบับที่ ${user.Petition_version}`
                                            : "ไม่มีคำร้องในระบบ"}
                                    </a>
                                </h3>
                            </div>
                            <PetitionStepper steps={steps} activeStep={state} />
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
                            < MyPetitionTable/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Petition;
