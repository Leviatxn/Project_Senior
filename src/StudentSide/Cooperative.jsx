import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import axios from "axios";
import "./Home.css";
import "../Main.css";
import "./Cooperative.css";
import PetitionStepper from "./Component/Petition/PetitionStepper";
import MyPetitionTable from "./Component/Petition/MyPetitionTable";
import MyProjectDetail from "./Component/Project/MyProjectDetail";
import MyProjectTitle from "./Component/Project/MyProjectTitle";

const Cooperative = () => {
    const today = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const [user, setUser] = useState(null);
    const [currentPetition, setCurrentPetition] = useState("");
    const [state, setState] = useState(0);
    const [loading, setLoading] = useState(true);  // เพิ่มสถานะการโหลดข้อมูล

    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId || !token) {
                console.error("No student ID or token found");
                setLoading(false);  // หยุดโหลดเมื่อไม่มีข้อมูล
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/lastpetition/${studentId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data) {
                    setUser(response.data);
                    setCurrentPetition(response.data.Petition_name || "");
                    setState(response.data.Progress_State || 0);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);  // หยุดโหลดหลังจากได้ข้อมูลหรือเกิดข้อผิดพลาด
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <p>กำลังโหลดข้อมูล...</p>;  // แสดงข้อความกำลังโหลด
    }

    return (
        <div className="cooperative-background">
            <Sidebar />
            <Banner />
            <div className="main-container">
                <div className="Side-Space" />
                <div className="cooperative-content-container">
                    <div className="cooperative-header">
                        <div style={{ flex: "1" }}>
                            <h1>การฝึกงานสหกิจศึกษา</h1>
                            <p style={{ marginTop: "10px", color: "#006765" }}>
                                วันที่ {today}
                            </p>
                        </div>
                        <div className="cooperative-detail">
                            <a href="/cooperative-detail">รายละเอียดการฝึกงานสหกิจ</a>
                        </div>
                    </div>

                    <div className="first-cooperative-container">
                        <div className="coop-status-box">
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{ fontSize: "18px" }}>
                                    สถานะนิสิตสหกิจ{" "}
                                    <a>
                                        {currentPetition
                                            ? `${currentPetition} ฉบับที่ ${user?.Petition_version}`
                                            : "ไม่มีคำร้องในระบบ"}
                                    </a>
                                </h3>
                            </div>
                        </div>
                        <div
                            className="coop-schedule-box"
                            style={{ marginLeft: "20px" }}
                        >
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{ fontSize: "18px" }}>
                                    สถานะนิสิตสหกิจ :{" "}
                                    <a>
                                        {currentPetition
                                            ? `${currentPetition} ฉบับที่ ${user?.Petition_version}`
                                            : "ไม่มีคำร้องในระบบ"}
                                    </a>
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="coop-project-container">
                        <div>
                            <div className="coop-document-box">
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3 style={{ fontSize: "18px" }}>เอกสารฝึกงาน</h3>
                                </div>
                                <div className="petition-underline" />
                                <div className="coop-document-menu">
                                    <nav>
                                        <ul>
                                            <li>
                                                <a href="/petition/request-a">
                                                    หนังสือส่งตัว
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/petition/request-a">
                                                    กฎการฝึกงาน
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/petition/request-b">
                                                    แบบฟอร์มต่างๆที่เกี่ยวข้อง
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <div className="petition-underline" />
                                </div>
                            </div>
                            <div
                                className="coop-document-box"
                                style={{ marginTop: "30px" }}
                            >
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3 style={{ fontSize: "18px" }}>การนิเทศสหกิจ</h3>
                                </div>
                                <div className="petition-underline" />
                                <div className="coop-document-menu">
                                    <nav>
                                        <ul>
                                            <li>
                                                <a href="/petition/request-a">
                                                    การนิเทศครั้งที่ 1
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/petition/request-a">
                                                    การนิเทศครั้งที่ 2
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <div className="petition-underline" />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginLeft: "30px", flex: "7" }}>
                            <div className="coop-project-box">
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3>โครงงานสหกิจ</h3>
                                </div>
                                <h1
                                    style={{
                                        marginLeft: "50px",
                                        marginBottom: "0",
                                        color: "#006765",
                                    }}
                                >
                                    <MyProjectTitle />
                                </h1>
                                <div className="coop-underline" />
                                <div style={{ paddingLeft: "30px", marginTop: "20px" }}>
                                    <MyProjectDetail />
                                </div>
                                <div
                                    style={{
                                        padding: "20px 30px",
                                        marginTop: "20px",
                                    }}
                                >
                                    <div className="coop-underline" />
                                    <p style={{ marginLeft: "30px" }}>สถานะโครงงาน :</p>
                                </div>
                            </div>
                            <div
                                className="coop-project-box"
                                style={{ marginTop: "30px" }}
                            >
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3>คำร้องฉัน</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cooperative;
