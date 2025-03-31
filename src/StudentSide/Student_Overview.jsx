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
import InternshipByProvinceDonut from "../MainComponent/DataVisualization/InternshipByProvinceDonut";
import MostCoopProvince from "../MainComponent/DataVisualization/MostCoopProvince";
import JobChart from "../MainComponent/DataVisualization/JobChart";
import ToolsDonutChart from "../MainComponent/DataVisualization/ToolDonutChart";
import Overview from "../MainComponent/DataVisualization/Overview";


const Student_Overview = () => {
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

     const [dataLengh, setDataLengh] = useState()

      useEffect(() => {
                 fetch("http://localhost:5000/studentsCoopinfo")
                 .then((response) => response.json())
                 .then((fetchedData) => {
                     setDataLengh(fetchedData.length)
                 })
                 .catch((error) => {
                   console.error("Error fetching data:", error);
                 });   
         
      }, []);
    
      // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const StudentLength = async() =>{
          fetch("http://localhost:5000/studentsCoopinfo")
          .then((response) => response.json())
          .then((fetchedData) => {
              setDataLengh(fetchedData.length)
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });   
        }
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
        StudentLength();
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
                  <Overview/>
                </div>
            </div>
        </div>
    );
};

export default  Student_Overview;
