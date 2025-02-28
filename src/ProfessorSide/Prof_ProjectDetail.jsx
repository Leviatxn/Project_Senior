import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import './Prof_Project.css';

const ProjectDetail = () => {
  const location = useLocation();
  const { ProjectID, ProjectTitle } = location.state || {};
  const [projectDetails, setProjectDetails] = useState(null);

  // ฟังก์ชั่นอัพเดทสถานะโปรเจค
  const updateProjectStatus = (status) => {
    fetch(`http://localhost:5000/updateProjectStatus/${ProjectID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_state: status }),
    })
      .then((response) => response.json())
      .then((data) => {
        // อัพเดทข้อมูลใน state หลังจากอัพเดทสถานะสำเร็จ
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          project_state: status,
        }));
      })
      .catch((error) => {
        console.error("Error updating project status:", error);
      });
  };

  useEffect(() => {
    if (ProjectID) {
      fetch(`http://localhost:5000/projectdetails/${ProjectID}`)
        .then((response) => response.json())
        .then((data) => {
          setProjectDetails(data);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
        });
    }
  }, [ProjectID]);

  if (!projectDetails) {
    return <div>กำลังโหลดข้อมูลโปรเจค...</div>;
  }

  return (
    <div className="prof-project">
      <div className="background">
        <Sidebar />
        <Banner />
        <div className="main-container">
          <div className="Side-Space" />
          <div className="home-content-container">
            <div className="project-table-container">
              <div className="project-table-box">
                <div className="project-detail-container">
                  <h2>โครงงานของนิสิตรหัส : {projectDetails.student_id}</h2>
                  <p>วันที่: {new Date(projectDetails.SubmissionDate).toLocaleDateString()}</p>
                  <h1>ชื่อโครงงาน : {ProjectTitle}</h1>
                  <p><strong>รายละเอียดโปรเจค:</strong> {projectDetails.ProjectDetails}</p>
                  <p><strong>อาจารย์ที่ปรึกษา:</strong> {projectDetails.Advisor}</p>
                  <p><strong>คณะกรรมการ 1:</strong> {projectDetails.Committee1}</p>
                  <p><strong>คณะกรรมการ 2:</strong> {projectDetails.Committee2}</p>
                  <p><strong>วันที่:</strong> {new Date(projectDetails.SubmissionDate).toLocaleDateString()}</p>
                  <p><strong>ไฟล์ที่แนบ:</strong> 
                    {projectDetails.Files.map((file, index) => (
                      <a key={index} href={`http://localhost:5000${file}`} download>
                        {`ไฟล์ ${index + 1}`}
                      </a>
                    ))}
                  </p>
                  <div className="status-buttons">
                    <button onClick={() => updateProjectStatus(2)}>ไม่อนุมัติ</button>
                    <button onClick={() => updateProjectStatus(1)}>อนุมัติ</button>
                  </div>
                  <p><strong>สถานะปัจจุบัน:</strong> {projectDetails.project_state === 0 ? "รอ" : projectDetails.project_state === 1 ? "อนุมัติ" : "ไม่อนุมัติ"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
