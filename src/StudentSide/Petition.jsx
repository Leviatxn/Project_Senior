import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import axios from "axios";
import "./Home.css";
import "../Main.css";
import "./Petition.css";
import PetitionStepper from "./Component/Petition/PetitionStepper";
import MyPetitionTable from "./Component/Petition/MyPetitionTable";
import Swal from "sweetalert2";

const Petition = () => {
    const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ทั้งหมด
    const [currentPetition, setCurrentPetition] = useState(""); // เก็บค่า current_petition จากฐานข้อมูล
    const [currentApplicationID, setCurrentApplicationID] = useState();

    const [state, setState] = useState(-1); 
    const [isCoop, setIsCoop] = useState(0); 
    const [isInProgress, setIsinProgress] = useState(0); 

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
                setCurrentApplicationID(response.data.ApplicationID);

                setState(response.data.Progress_State)
                setIsinProgress(response.data.Is_inprogress)
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
            try {
                const response = await axios.get(
                    `http://localhost:5000/isCoopstudent/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setIsCoop(response.data.is_coopstudent);
                console.log(response.data)
            } catch (err) {
                console.error("Error fetching user info data:", err);
            }
            
            
            
        };

        fetchUserData();
    }, []);
    const deleteStudentCoopApplication = async (applicationId) => {
        const response = await fetch(`http://localhost:5000/studentcoopdelete/${applicationId}`, {
          method: "DELETE",
        });
      
        if (response.ok) {
            console.log("ลบข้อมูลสำเร็จ!");
        } else {
            console.log("ไม่พบ ApplicationID หรือเกิดข้อผิดพลาด");
        }
      };

      const deleteCoopApplication = async (applicationId) => {
        const response = await fetch(`http://localhost:5000/coopapplicationdelete/${applicationId}`, {
          method: "DELETE",
        });
      
        if (response.ok) {
          console.log("ลบข้อมูลสำเร็จ!");
        } else {
            console.log("ไม่พบ ApplicationID หรือเกิดข้อผิดพลาด");
        }
      };
    const handlePetitionAClick = (url) => {
        console.log(isCoop)
        if (isInProgress === 1 && state !== 4 && isCoop === 0) {
          Swal.fire({
            title: "ต้องการยกเลิกคำร้องล่าสุดหรือไม่?",
            text: "คำร้องคุณกำลังดำเนินการอยู่!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ยกเลิกคำร้อง!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleted!",
                text: "ยกเลิกคำร้องล่าสุดของคุณเรียบร้อย",
                icon: "success"
              });
              deleteStudentCoopApplication(currentApplicationID)
            }
          });
        } 
        else if(isCoop === 1){
            Swal.fire({
                icon: "error",
                title: "คุณเป็นนิสิตสหกิจเรียบร้อยแล้ว",
                text: "กรุณาทำรายการอื่น",
              });
        }
        else {
          window.location.href = url;
        }
    };
    
    const handlePetitionBClick = (url) => {
        console.log(isInProgress)

        if (isInProgress === 1 && state >= 4) {
          Swal.fire({
            title: "ต้องการยกเลิกคำร้องล่าสุดหรือไม่?",
            text: "คำร้องคุณกำลังดำเนินการอยู่!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ยกเลิกคำร้อง!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleted!",
                text: "ยกเลิกคำร้องล่าสุดของคุณเรียบร้อย",
                icon: "success"
              });
              deleteCoopApplication(currentApplicationID)
            }
          });
        } else {
          window.location.href = url;
        }
    };
    
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
                                            <a 
                                            href="#"
                                            onClick={() => handlePetitionAClick("/petition/request-a")}
                                            >
                                                ยื่นขอเป็นนิสิตสหกิจศึกษา
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={() => handlePetitionBClick("/petition/request-b")}

                                                style={{
                                                    pointerEvents: isCoop === 0 ? "none" : "auto",
                                                    color: isCoop === 0 ? "gray" : "inherit",
                                                    textDecoration: isCoop === 0 ? "none" : "underline"
                                                }}
                                            >
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
                            <div style={{padding:'0px 40px 40px 40px'}}>
                                < MyPetitionTable/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Petition;
