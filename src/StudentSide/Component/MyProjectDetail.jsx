import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProjectDetail.css";

const MyProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      console.error("ไม่พบ student_id ใน localStorage");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/coopproject/${studentId}`)
      .then((response) => {
        if (response.data) {
          setProject(response.data); // กำหนดค่าข้อมูลโครงงานที่ได้รับ
        } else {
          console.error("ไม่พบข้อมูลโครงงาน");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  }

  if (!project) {
    return <div className="error-text">ไม่พบข้อมูลโครงงาน</div>;
  }

  return (
    <div className="project-container">
      <h2>รายละเอียดโครงงานสหกิจ</h2>
      <div className="project-details">
        <p><strong>ชื่อหัวข้อโครงงาน:</strong> {project.ProjectTitle}</p>
        <p><strong>รายละเอียดโครงงาน:</strong> {project.ProjectDetails}</p>
        <p><strong>อาจารย์ที่ปรึกษา:</strong> {project.Advisor}</p>
        <p><strong>กรรมการท่านที่ 1:</strong> {project.Committee1}</p>
        <p><strong>กรรมการท่านที่ 2:</strong> {project.Committee2}</p>
      </div>
    </div>
  );
};

export default MyProjectDetail;
