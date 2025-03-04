import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import "./Prof_Home.css";
import "../Main.css";
import "./Prof_Project.css";
import "./Prof_ProjectDetail.css";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const Prof_ProjectDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ProjectID, ProjectTitle } = location.state || {};

  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // สถานะที่เลือก (1 = อนุมัติ, 2 = ไม่อนุมัติ)
  const [selectedStatus, setSelectedStatus] = useState(null);

  // ดึงข้อมูลโปรเจคจากเซิร์ฟเวอร์
  useEffect(() => {
    if (ProjectID) {
      fetch(`http://localhost:5000/projectdetails/${ProjectID}`)
        .then((response) => response.json())
        .then((data) => {
          // สมมติว่าข้อมูลที่ได้มาเป็น array หากเป็น object ให้แก้ไขตามความเหมาะสม
          setProjectDetails(data[0] || data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
          setError("ไม่สามารถโหลดข้อมูลโปรเจคได้");
          setLoading(false);
        });
    }
  }, [ProjectID]);

  // ฟังก์ชันอัพเดตสถานะโปรเจค (return promise เพื่อให้ handleSave ใช้งานต่อได้)
  const updateProjectStatus = (status) => {
    return fetch(`http://localhost:5000/updateProjectStatus/${ProjectID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_state: status }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("อัปเดตสถานะสำเร็จ");
        setProjectDetails((prev) => ({ ...prev, project_state: status }));
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูลและย้อนกลับ
  const handleSave = () => {
    if (selectedStatus === null) {
      alert("กรุณาเลือกสถานะโปรเจคก่อนบันทึก");
      return;
    }
    updateProjectStatus(selectedStatus).then(() => {
      navigate(-1);
    });
  };

  if (loading) return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="prof-project">
      <div className="background">
        <Sidebar />
        <Banner />
        <div className="main-container">
          <div className="Side-Space" />
          <div className="home-content-container">
            <div className="prof_detail-table-container">
              <div className="prof_detail-table-box" style={{ position: "relative" }}>
                {/* แถวแรก: กล่องสี่เหลี่ยมและรหัสนิสิต */}
                <div
                  className="header-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="sub-header-square" />
                    <h2 style={{ marginLeft: "10px" }}>
                      โครงงานของนิสิตรหัส : {projectDetails?.student_id || "ไม่พบข้อมูล"}
                    </h2>
                  </div>
                </div>

                {/* ชื่อโครงงาน */}
                <h1>ชื่อโครงงาน: {ProjectTitle || "ไม่ระบุชื่อโครงงาน"}</h1>
                <p>
                  วันที่:{" "}
                  {projectDetails?.SubmissionDate
                    ? new Date(projectDetails.SubmissionDate).toLocaleDateString()
                    : "ไม่ระบุ"}
                </p>

                {/* หัวข้อและกล่องรายละเอียดโปรเจค */}
                <h3>รายละเอียดโปรเจค</h3>
                <div className="details-box">
                  {projectDetails?.ProjectDetails || "ไม่มีรายละเอียดโปรเจค"}
                </div>

                {/* หัวข้อและกล่องอาจารย์ที่ปรึกษา */}
                <h3>อาจารย์ที่ปรึกษา</h3>
                <div className="details-box">
                  {projectDetails?.Advisor || "ไม่ระบุ"}
                </div>

                {/* หัวข้อและกล่องกรรมการ 1 */}
                <h3>กรรมการ 1</h3>
                <div className="details-box">
                  {projectDetails?.Committee1 || "ไม่ระบุ"}
                </div>

                {/* หัวข้อและกล่องกรรมการ 2 */}
                <h3>กรรมการ 2</h3>
                <div className="details-box">
                  {projectDetails?.Committee2 || "ไม่ระบุ"}
                </div>

                {/* หัวข้อและกล่องไฟล์ที่แนบ */}
                <h3>ไฟล์ที่แนบ</h3>
                <div className="details-box">
                  {projectDetails?.FilePath ? (
                    <a
                      href={projectDetails.FilePath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ดาวน์โหลดไฟล์
                    </a>
                  ) : (
                    "ไม่มีไฟล์ที่แนบ"
                  )}
                </div>

                {/* ส่วนของ checkbox สำหรับเลือกสถานะ */}
                <div
                  className="status-checkboxes"
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    gap: "20px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatus === 1}
                        onChange={() => setSelectedStatus(1)}
                      />
                    }
                    label="อนุมัติ"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatus === 2}
                        onChange={() => setSelectedStatus(2)}
                      />
                    }
                    label="ไม่อนุมัติ"
                  />
                </div>

                {/* ปุ่ม Save สำหรับบันทึกข้อมูลและย้อนกลับ */}
                <div
                  className="action-buttons"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    startIcon={<CheckIcon />}
                    sx={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      textTransform: "none",
                    }}
                  >
                    บันทึกข้อมูล
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prof_ProjectDetail;
