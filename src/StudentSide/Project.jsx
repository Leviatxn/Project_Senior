import React, { useState, useEffect } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import "./Home.css";
import "../Main.css";
import "./myproject.css";
import ProjectForm from "./Component/ProjectForm";
import axios from "axios";
import ReturnButton from "../MainComponent/ReturnButton";
const Project = () => {
    const [projectData, setProjectData] = useState({
        student_id: "", // เริ่มต้นเป็นค่าว่าง
        title: "",
        details: "",
        advisor: "",
        file: null,
        committee1: "",
        committee2: "",
    });

    useEffect(() => {
        const fetchProjectData = async () => {
            const studentId = localStorage.getItem("studentId");
            console.log(studentId)
            setProjectData({student_id:studentId})

            if (!studentId) {
                console.error("ไม่พบ student_id ใน localStorage");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/coopproject/${studentId}`);

                if (response.data) {
                    setProjectData({
                        ...response.data, // กำหนดค่าจากข้อมูลที่ดึงมา
                    });
                } else {
                    console.error("ไม่พบข้อมูลโครงงาน");
                }
            } catch (err) {
                console.error("Error fetching project data:", err);
            }
        };

        fetchProjectData();
    }, []); // คำสั่งนี้จะทำงานเมื่อโหลดคอมโพเนนต์

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleFileChange = (e) => {
        setProjectData({ ...projectData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("student_id", projectData.student_id);
        formData.append("ProjectTitle", projectData.title);
        formData.append("ProjectDetails", projectData.details);
        formData.append("Advisor", projectData.advisor);
        formData.append("Committee1", projectData.committee1);
        formData.append("Committee2", projectData.committee2);

        if (projectData.file) {
            formData.append("FilePath", projectData.file);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/coopproject", formData);
            console.log("ส่งข้อมูลสำเร็จ:", response.data);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
        }
    };

    return (
        <div className="background">
            <Sidebar />
            <Banner />
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="petition-content-container">
                    <div className="request-header">
                        <h1>ยื่นโครงงาน</h1>
                        <div className="request-back">
                        </div>
                    </div>
                    <div className="request-container">
                        <div className="myproject-box">
                             <div className="request-box-header" >
                                <div className="request-sub-header">
                                    <div className="sub-header-square"/>
                                    <h3>คำร้อง <a>ยื่นโครงงานนสหกิจศึกษา</a></h3>
                                </div>
                            </div>
                            <div className="myproject-box-content">
                                <ProjectForm
                                    handleSubmit={handleSubmit}
                                    handleInputChange={handleInputChange}
                                    handleFileChange={handleFileChange}
                                    projectData={projectData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Project;
