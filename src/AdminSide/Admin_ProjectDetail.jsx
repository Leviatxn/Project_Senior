import React, { useState, useEffect } from "react"; // เพิ่ม useState, useEffect
import { useLocation, useNavigate } from "react-router-dom"; // เพิ่ม useLocation, useNavigate
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";

const Admin_ProjectDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { ProjectID, ProjectTitle } = location.state || {};
  
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null); // 1 = อนุมัติ, 2 = ไม่อนุมัติ
  
    useEffect(() => {
      if (ProjectID) {
        fetch(`http://localhost:5000/projectdetails/${ProjectID}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data); // ตรวจสอบข้อมูลที่ได้รับจาก API
            setProjectDetails(data[0] || data);  // จัดการกับข้อมูลที่ได้รับ
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching project details:", error);
            setError("ไม่สามารถโหลดข้อมูลโปรเจคได้");
            setLoading(false);
          });
      }
    }, [ProjectID]);

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleGoBack = () => {
        navigate(-1); // กลับไปยังหน้าก่อนหน้า
    };

    return (
        <div className="home-background">
            <AdminSidebar />
            <AdminHeader />
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div style={{ border: "1px solid #ddd" }}>
                        <div className="prof_detail-table-box" style={{ position: "relative" }}>
                            <div
                                className="header-row"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between", // ปรับให้ปุ่มอยู่ขวาสุด
                                    marginBottom: "20px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="sub-header-square" />
                                    <h2 style={{ marginLeft: "10px" }}>
                                        โครงงานของนิสิตรหัส : {projectDetails?.student_id || "ไม่พบข้อมูล"}
                                    </h2>
                                </div>
                                <button
                                class="bg-blue-500 text-center w-48 rounded-2xl h-14 relative text-white text-xl font-semibold group" // เปลี่ยนพื้นหลังปุ่มเป็นสีน้ำเงิน, ข้อความเป็นสีขาว
                                type="button"
                                onClick={() => navigate(-1)} // เพิ่มฟังก์ชันย้อนกลับเมื่อคลิก
                                >
                                <div
                                    class="bg-red-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500" // เปลี่ยนสีแถบเป็นสีแดง
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1024 1024"
                                    height="25px"
                                    width="25px"
                                    >
                                    <path
                                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                                        fill="#006765" // เปลี่ยนสีไอคอน
                                    ></path>
                                    <path
                                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                                        fill="#006765" // เปลี่ยนสีไอคอน
                                    ></path>
                                    </svg>
                                </div>
                                </button>

                            </div>

                            <h1>ชื่อโครงงาน: {ProjectTitle || "ไม่ระบุชื่อโครงงาน"}</h1>
                            <p>
                                วันที่:{" "}
                                {projectDetails?.SubmissionDate
                                    ? new Date(projectDetails.SubmissionDate).toLocaleDateString()
                                    : "ไม่ระบุ"}
                            </p>

                            <h3>รายละเอียดโปรเจค</h3>
                            <div className="prof_detail-table-box">
                                {projectDetails?.ProjectDetails || "ไม่มีรายละเอียดโปรเจค"}
                            </div>

                            <h3>อาจารย์ที่ปรึกษา</h3>
                            <div className="prof_detail-table-box">
                                {projectDetails?.Advisor || "ไม่ระบุ"}
                            </div>

                            <h3>กรรมการ</h3>
                            <div className="committee-container">
                                <div className="committee-box">
                                    {projectDetails?.Committee1 || "ไม่ระบุ"}
                                </div>
                                <div className="committee-box">
                                    {projectDetails?.Committee2 || "ไม่ระบุ"}
                                </div>
                            </div>

                            <h3>ไฟล์ที่แนบ</h3>
                            <div className="prof_detail-table-box">
                                {projectDetails?.FilePath ? (
                                    <a
                                        href={projectDetails.FilePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {projectDetails.FilePath}
                                    </a>
                                ) : (
                                    "ไม่มีไฟล์ที่แนบ"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin_ProjectDetail;
