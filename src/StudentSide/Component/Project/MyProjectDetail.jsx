import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProjectDetail.css";

const MyProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        console.error("ไม่พบ student_id ใน localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/coopproject/${studentId}`);

        if (response.data && Object.keys(response.data).length > 0) {
          setProject(response.data);
        } else {
          console.error("ไม่พบข้อมูลโครงงาน");
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  if (loading) {
    return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  }

  if (!project) {
    return <div className="error-text">ไม่พบข้อมูลโครงงาน</div>;
  }

  return (
      <div className="project-details">
      <h2>รายละเอียดโครงงานสหกิจ</h2>
        <p><strong>ชื่อหัวข้อ:</strong> {project.ProjectTitle || "ไม่มีข้อมูล"}</p>
        <p><strong>รายละเอียด:</strong> {project.ProjectDetails || "ไม่มีข้อมูล"}</p>
        <p><strong>อาจารย์ที่ปรึกษา:</strong> {project.Advisor || "ไม่มีข้อมูล"}</p>
        <p><strong>กรรมการท่านที่ 1:</strong> {project.Committee1 || "ไม่มีข้อมูล"}</p>
        <p><strong>กรรมการท่านที่ 2:</strong> {project.Committee2 || "ไม่มีข้อมูล"}</p>
      </div>
  );
};

export default MyProjectDetail;
