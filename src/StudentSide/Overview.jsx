import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import axios from "axios";
import "./Home.css";
import "../Main.css";
import "./Cooperative.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Swal from "sweetalert2";
import StudentEvaluation_Chart from "../MainComponent/DataVisualization/Student_Graph";


const Overview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const studentID = localStorage.getItem("studentId");
    const { version } = location.state || {}; // รับค่าที่ส่งมา
    const today = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ทั้งหมด
    const [currentPetition, setCurrentPetition] = useState(""); // เก็บค่า current_petition จากฐานข้อมูล

    const [coopData, setCoopData] = useState(null); // เก็บข้อมูลทั้งหมด
    const [studentInfo, setStudentInfo] = useState(null); // เก็บข้อมูลทั้งหมด
    const [evaluationData, setEvaluationData] = useState();

      // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const fetchCoopData = async () => {
          console.log(studentID, version);
      
          try {
            const response = await axios.get(`http://localhost:5000/user_info/${studentID}`);
            if (response.data) {
              console.log(response.data);
              setStudentInfo(response.data);
            } else {
              console.error("ไม่พบข้อมูลผู้ใช้");
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
      
          try {
            const response = await axios.get(`http://localhost:5000/coop_info/${studentID}`);
            console.log(response.data);
            setCoopData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
      
          // ตรวจสอบว่ามี evaluation อยู่แล้วหรือไม่
          checkExistingEvaluation(studentID, version);
        };
        fetchCoopData();
      }, [studentID, version]);

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

      const checkExistingEvaluation = async (studentID) => {
        if(version === 1){
            try {
                const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'first'}`);
                console.log(response.data)
                if (response.data && response.data.evaluation_id) {
                  setEvaluationData({ evaluation_id: response.data.evaluation_id });
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
        }
        else if(version === 2){
            try {
                const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'second'}`);
                console.log(response.data)
                if (response.data && response.data.evaluation_id) {
                  setEvaluationData({ evaluation_id: response.data.evaluation_id });
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
        }
        else if(version === 3){
            try {
                const response = await axios.get(`http://localhost:5000/evaluations_type/${studentID}/${'self_evaluate'}`);
                console.log(response.data)
                if (response.data && response.data.evaluation_id) {
                  setEvaluationData({ evaluation_id: response.data.evaluation_id });
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
        }
      };

    return (
        <div className="background" style={{height:'auto', paddingBottom: '80px'}}>
            <Sidebar />
            <Banner />
            <div className="main-container">
                <div className="Side-Space" />
                <div className="cooperative-content-container">
                    <div className="cooperative-header" style={{marginTop:'20px'}}>
                        <div style={{flex:'1'}}>
                            <h1>สถิติโดยรวม </h1>
                            <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>
                        </div>
                        <div className="cooperative-detail">
                            <a href="/cooperative-detail">รายละเอียดการฝึกงานสหกิจ</a>
                        </div>
                    </div>

                    <div className="first-cooperative-container" style={{paddingBottom:'0'}}>
                        <div className="coop-status-box" style={{paddingBottom:'10px',flex:'1',marginTop:'50px',height:'250px'}}>
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{fontSize:'18px'}}>
                                จำนวนนิสิตสหกิจ
                                </h3>
                            </div>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            </div>

                        </div>
                        <div className="coop-schedule-box" style={{marginLeft:'40px',paddingBottom:'10px',flex:'3',height:'300px'}}>
                            <div className="sub-header">
                                <div className="sub-header-square" />
                                <h3 style={{fontSize:'18px'}}>
                                    อัตราส่วนการฝึกงานในแต่ละจังหวัด
                                </h3>
                            </div>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            </div>
                        </div>
                    </div>

                    <div className="coop-project-container">
                        <div style={{flex:'7'}}>
                            <div className="coop-document-box" >
                                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <div className="sub-header" style={{display:'flex',alignItems:'center',marginTop:'20px'}}>
                                        <div className="sub-header-square" />
                                        <h3 style={{fontSize:'18px'}}>ตำแหน่งงานที่นิยม</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="coop-document-box" style={{marginTop: '30px'}}>
                                    <div className="sub-header">
                                        <div className="sub-header-square" />
                                        <h3 style={{fontSize:'18px'}}>เครื่องมือที่บริษัทนิยมใช้งาน</h3>
                                    </div>
                            </div>
                        </div>
                        <div style={{marginLeft:'30px',flex:'3'}}>
                            <div className="coop-document-box" style={{flex:'1',height:'400px'}}>
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3>คุณภาพนิสิตหลังฝึกงาน</h3>
                                </div>
                                <StudentEvaluation_Chart evaluationID={'self_evaluate'}/>
                            </div>
                            <div className="coop-document-box" style={{marginTop: '30px',flex:'1',height:'auto'}}>
                                <div className="sub-header">
                                    <div className="sub-header-square" />
                                    <h3>ผลคะแนนสหกิจ</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
