import React, { useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import "./Home.css";
import "../Main.css";
import "./myproject.css";
import ProjectForm from "./Component/ProjectForm";
import axios from "axios";

const MyProject = () => {
    const [projectData, setProjectData] = useState({
        student_id: 123, // ควรดึงจากระบบล็อกอิน
        title: "",
        details: "",
        advisor: "",
        file: null,
        committee1: "",
        committee2: "",
    });

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
            const response = await axios.post("/api/submit-coop-project", formData);
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
                <div className="myproject-container">
                    <div className="myproject-box">
                        <div className="myproject-box-header">
                            <div className="myproject-sub-header">
                                <div className="sub-header-square" />
                                <h3>โครงงานสหกิจ</h3>
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
    );
};

export default MyProject;
