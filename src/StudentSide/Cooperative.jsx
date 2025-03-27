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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const Cooperative = () => {
    const navigate = useNavigate();

    const today = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ทั้งหมด
    const [currentPetition, setCurrentPetition] = useState(""); // เก็บค่า current_petition จากฐานข้อมูล
    const [coopInfo, setCoopInfo] = useState(null); 
    const [isNotCoop, setIsNotCoop] = useState(false); 
    const [coopState, setCoopState] = useState(null); 


    const steps = [
        "ยื่นคำร้องรอการตรวจสอบ",
        "เข้าที่ประชุม",
        "ส่งไปที่เจ้าหน้าที่",
        "คำร้องอนุมัติ",
        "เสร็จสิ้น",
    ];
    const getCoopStatusColor = (status) => {
        switch (status) {
          case "pass":
            return "#41D70B"; // สีเขียว
          case "reject":
            return "#A60003"; // สีแดง
          case "working":
            return "#00A6A2"; // สีฟ้า
          case "wait":
                return "#3297DB"; // สีฟ้า
          default:
            return "default";
        }
      };

    const getCoopStatus = (status) => {
        if(status === "pass"){
          return "ผ่านการฝึกงาน";
        }
        else if(status === "reject"){
          return "ไม่ผ่านการฝึกงาน";
    
        }
        else if(status === "working"){
          return "กำลังฝึกงาน";
    
        }
        else if(status === "wait"){
          return "ยังไม่เริ่มการฝึกงาน";
    
        }
      };

      const formatCoopDate = (isoString) => {
        if(isoString == null){
          return '-'
        }
        const date = new Date(isoString);
        return date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      };

      const formatThaiDate = (isoString) => {
        if(isoString == null){
          return '-'
        }
        const date = new Date(isoString);
        return date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };
    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId) {
                console.error("No student ID found");
                return;
            }
            if (isNotCoop) {
                Swal.fire({
                    icon: "error",
                    title: "คุณยังไม่ได้ลงทะเบียนขอปฎิบัติงานสหกิจศึกษา",
                    text: "กรุณาลงทะเบียนก่อนครับ !",
                });
                navigate('/home')
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
                console.log(response.data)
                setUser(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด

            } catch (err) {
                console.error("Error fetching user data:", err);
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/coop_info/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(response.data)
                setCoopInfo(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
                if(formatThaiDate(response.data.Coop_StartDate) === today){
                    console.log('today is your day')
                            try{
                              // ส่งข้อมูลไปยัง API
                              const response = await axios.put(`http://localhost:5000/updateCoopState/${studentId}`,{
                                currentState: 'working'
                              },);
                              console.log('update Currently  State');
                            }
                            catch(error){
                              console.error('Error submitting data:', error);
                            }
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setIsNotCoop(true)
            }
            
        };

        fetchUserData();
    }, [isNotCoop]);

    if(!user || !coopInfo){
        return(
            <div className="cooperative-background">
            <Sidebar />
            <Banner />
            <div className="main-container">
                <div className="Side-Space" />
                <div className="cooperative-content-container">
                    <div className="cooperative-header" style={{marginTop:'20px'}}>
                        <div style={{flex:'1'}}>
                            <h1>การฝึกงานสหกิจศึกษา</h1>
                            <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>
                        </div>
                        <div className="cooperative-detail">
                            <a href="/cooperative-detail">รายละเอียดการฝึกงานสหกิจ</a>
                        </div>
                    </div>

                    <div className="first-cooperative-container">
                        <div className="coop-status-box">
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{fontSize:'18px'}}>
                                    สถานะนิสิตสหกิจ
                                </h3>
                            </div>
                            <div>
                                    
                            </div>
                        </div>
                        <div className="coop-schedule-box" style={{marginLeft:'20px'}}>
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{fontSize:'18px'}}>
                                    กำหนดวันฝึกงาน
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="coop-project-container">
                        <div>
                            <div className="coop-document-box">
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3 style={{fontSize:'18px'}}>เอกสารฝึกงาน</h3>
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
                            <div className="coop-document-box" style={{marginTop: '30px'}}>
                                    <div className="sub-header">
                                        <div className="sub-header-square" />
                                        <h3 style={{fontSize:'18px'}}>การนิเทศสหกิจ</h3>
                                    </div>
                                    <div className="petition-underline" />
                                    <div className="coop-document-menu">
                                        <nav>
                                            <ul>
                                                <li>
                                                    <a href="/appointment-1">
                                                        การนิเทศครั้งที่ 1
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/appointment-2">
                                                        การนิเทศครั้งที่ 2
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                        <div className="petition-underline" />
                                    </div>
                            </div>
                        </div>
                        <div style={{marginLeft:'30px',flex:'7'}}>
                            <div className="coop-project-box">
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3>โครงงานสหกิจ</h3>
                                </div>

                                <div className="coop-underline" />
                                <div style={{paddingLeft:'30px',marginTop:'20px',flex:'1'}}>
=
                                </div>
                                
                                <div style={{padding:'20px 30px 20px 30px',marginTop:'20px'}}>
                                    <div className="coop-underline" />
                                    <p style={{marginLeft:'30px'}}>สถานะโครงงาน :</p>

                                </div>
                            </div>
                            <div className="coop-project-box" style={{marginTop: '30px'}}>
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
    }

    return (
        <div className="cooperative-background">
            <Sidebar />
            <Banner />
            <div className="main-container">
                <div className="Side-Space" />
                <div className="cooperative-content-container">
                    <div className="cooperative-header" style={{marginTop:'20px'}}>
                        <div style={{flex:'1'}}>
                            <h1>การฝึกงานสหกิจศึกษา</h1>
                            <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>
                        </div>
                        <div className="cooperative-detail">
                            <a href="/cooperative-detail">รายละเอียดการฝึกงานสหกิจ</a>
                        </div>
                    </div>

                    <div className="first-cooperative-container">
                        <div className="coop-status-box" style={{paddingBottom:'10px'}}>
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{fontSize:'18px'}}>
                                    สถานะนิสิตสหกิจ
                                </h3>
                            </div>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <h1 style={{fontWeight:'500',color:(getCoopStatusColor(user.coop_state))}}>{getCoopStatus(user.coop_state)}</h1>
                            </div>

                        </div>
                        <div className="coop-schedule-box" style={{marginLeft:'20px',paddingBottom:'10px'}}>
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{fontSize:'18px'}}>
                                    กำหนดวันฝึกงาน
                                </h3>
                            </div>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <h1 style={{fontWeight:'400',fontSize:'28px',color:(getCoopStatusColor(user.coop_state))}}>วันที่ {formatThaiDate(coopInfo.Coop_StartDate)} - {formatThaiDate(coopInfo.Coop_EndDate)}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="coop-project-container">
                        <div>
                            <div className="coop-document-box" >
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3 style={{fontSize:'18px'}}>เอกสารฝึกงาน</h3>
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
                            <div className="coop-document-box" style={{marginTop: '30px'}}>
                                    <div className="sub-header">
                                        <div className="sub-header-square" />
                                        <h3 style={{fontSize:'18px'}}>การนิเทศสหกิจ</h3>
                                    </div>
                                    <div className="petition-underline" />
                                    <div className="coop-document-menu">
                                        <nav>
                                            <ul>
                                                <li>
                                                    <a href="/appointment-1">
                                                        การนิเทศครั้งที่ 1
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/appointment-2">
                                                        การนิเทศครั้งที่ 2
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                        <div className="petition-underline" />
                                    </div>
                            </div>
                        </div>
                        <div  className="coop-project-box" style={{marginLeft:'30px',flex:'7'}}>
                            <div >
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3>โครงงานสหกิจ</h3>
                                </div>
                                <div style={{padding:'10px 0px 0px 80px'}}>
                                  <MyProjectTitle />
                                </div>
                                <div style={{paddingLeft:'80px'}}>
                                    <div className="coop-underline" />                                    
                                </div>
                                <div style={{padding:'20px 60px 20px 60px',flex:'1'}}>
                                < MyProjectDetail/>
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
