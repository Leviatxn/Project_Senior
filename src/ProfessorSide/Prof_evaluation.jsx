import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import './Prof_Petition.css';
import { useLocation } from "react-router-dom";
import axios from "axios";
import PetitionStepper from "../StudentSide/Component/Petition/PetitionStepper";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate


const CompanyEvaluation = () => {

}
const Prof_evaluation = () => {
    const location = useLocation();
    const { student_id } = location.state || {}; // รับค่าที่ส่งมา
    const [data, setData] = useState(null); // เก็บข้อมูลทั้งหมด
    const [isVerified, setVerified] = useState(false);
    const [isApprove, setIsApprove] = useState(null);
    const navigate = useNavigate();

    const [statuses, setStatuses] = useState({
        approve: false,
        notApprove: false,
        verified: false,
      });

    const toggleStatus = (key) => {
        setStatuses((prevState) => {
        // ตรวจสอบว่ากำลังคลิก "อนุมัติ" หรือ "ไม่อนุมัติ"
        if (key === "approve") {
            setIsApprove(1);

            return {
            ...prevState,
            approve: !prevState.approve, // สลับสถานะ "อนุมัติ"
            notApprove: false, // ยกเลิกสถานะ "ไม่อนุมัติ"
            };
        } else if (key === "notApprove") {
            setIsApprove(0);


            return {
            ...prevState,
            notApprove: !prevState.notApprove, // สลับสถานะ "ไม่อนุมัติ"
            approve: false, // ยกเลิกสถานะ "อนุมัติ"
            };
            
        } 
        else {
            setVerified(!isVerified);
            
            return {
            ...prevState,
            [key] : !prevState[key],
            };
        }
        });
    };
    const studentcoopapplication_steps = [
        "ยื่นคำร้องรอการตรวจสอบ",
        "ตรวจสอบแล้ว",
        "ส่งไปที่เจ้าหน้าที่",
        "คำร้องอนุมัติ",
        "เสร็จสิ้น",
    ];
    const coopapplication_steps = [
        "ยื่นเอกสารรอการตรวจสอบ",
        "เข้าที่ประชุม",
        "อนุมัติคำร้อง",
        "ส่งไปที่เจ้าหน้าที่",
        "ออกหนังสือส่งตัว",
    ];

      // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const fetchStudentPetition = async () => {
            console.log(student_id)
            if(Petition_name == "คำร้องขอเป็นนิสิตสหกิจศึกษา"){
                console.log(location.state)
                try {
                    const response = await axios.get(`http://localhost:5000/studentcoopapplication/${ApplicationID}`);
                    console.log("คำร้องขอเป็นนิสิตสหกิจศึกษา")
                    console.log( response.data)
                    setData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด

                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
            else if(Petition_name == "คำร้องขอปฏิบัติงานสหกิจศึกษา"){
                try {
                    const response = await axios.get(`http://localhost:5000/coopapplication/${ApplicationID}`);
                    console.log("คำร้องขอปฏิบัติงานสหกิจศึกษา")
                    console.log( response.data)
                    setData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }  
        };
        fetchStudentPetition();
      }, []);

     // ฟังก์ชันสำหรับอัปเดตข้อมูลไปยัง Backend
    const handleStudentUpdate = async () => {
        if (isApprove === null) {
        alert("กรุณาเลือกสถานะก่อนดำเนินการ");
        return;
        }

        try {
        const response = await axios.put("http://localhost:5000/updateStudentApplication", {
            ApplicationID: ApplicationID,
            Is_approve: isApprove,
            Progress_State: 2,
        });

        if (response.status === 200) {
            alert("อัปเดตสถานะสำเร็จ!");
            navigate(-1);

        }
        } catch (err) {
        console.error("Error updating data:", err);
        alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
        
    };

         // ฟังก์ชันสำหรับอัปเดตข้อมูลไปยัง Backend
    const handleCoopUpdate = async () => {
            if (isApprove === null) {
            alert("กรุณาเลือกสถานะก่อนดำเนินการ");
            return;
            }
            if (isVerified === false) {
                alert("กรุณายืนยันการลงนาม");
                return;
            }
    
            try {
            const response = await axios.put("http://localhost:5000/updateCoopApplication", {
                ApplicationID: ApplicationID,
                Is_approve: isApprove,
                Progress_State: 2,
            });
    
            if (response.status === 200) {
                alert("อัปเดตสถานะสำเร็จ!");
                navigate(-1);
    
            }
            } catch (err) {
            console.error("Error updating data:", err);
            alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
            }
            
    };

    if(!data){
        return (
            <div className="prof-petition">
            <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box">
                            <div className="table-container">
                                <div className="petition-detail-header ">
                                    <div className="sub-header-square" />
                                    <h1 className="table-title">แบบบันทึกการนิเทศงานสหกิจศึกษา ครั้งที่ 1</h1>
                                    
                                </div>
                                <div className="petition-detail-container">

                                    <div className="petition-detail-content">
                                        <p className="infomation-text" style={{textAlign :"center"}}>Loading...</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
        );
    }
   
}

export default Prof_evaluation;
