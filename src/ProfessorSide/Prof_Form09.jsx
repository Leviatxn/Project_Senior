import React, { useEffect, useState,useRef  } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import axios from "axios";
import Fetch_Form08 from "./Component/Fetch_Form08";
import { CircularProgress } from "@mui/material";
import Fetch_Form09 from "./Component/Fetch_Form09";

const Prof_Form09 = () => {
    const location = useLocation();
    const { studentID } = location.state || {};
    const [studentInfo, setStudentInfo] = useState(null);
    const [coopInfo, setCoopInfo] = useState(null);
    const [evaluationID, setEvaluationID] = useState();

    const checkExistingEvaluation = async (studentID) => {
            try {
                const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'coop_report'}/${'last'}`);
                console.log(response.data)
                console.log(response.data.evaluation_id)
                if(response.data.evaluation_id){
                    setEvaluationID(response.data.evaluation_id);
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
      };

            // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const fetchCoopData = async () => {
          console.log(studentID);
      
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
            setCoopInfo(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
      
          // ตรวจสอบว่ามี evaluation อยู่แล้วหรือไม่
          checkExistingEvaluation(studentID);
        };
        fetchCoopData();
      }, [studentID]);

    if(!evaluationID){
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                    <CircularProgress />
                                  </div>
    }
    return (
        <div className="prof-home-background" style={{height:'auto'}}>
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <Fetch_Form09 evaluationID={evaluationID}/>
                </div>
            </div>

        </div>
    );
}

export default Prof_Form09;
