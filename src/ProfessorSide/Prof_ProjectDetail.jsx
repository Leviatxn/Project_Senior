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
import Swal from "sweetalert2"; // Import SweetAlert2

const Prof_ProjectDetail = () => {
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

  const updateProjectStatus = (status) => {
    return fetch(`http://localhost:5000/updateProjectStatus/${ProjectID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_state: status }),
    })
      .then((response) => response.json())
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "อัปเดตสถานะสำเร็จ",
          text: "สถานะโปรเจคได้รับการอัปเดตแล้ว",
        });
        setProjectDetails((prev) => ({ ...prev, project_state: status }));
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถอัปเดตสถานะได้",
        });
      });
  };

  const handleSave = () => {
    if (selectedStatus === null) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกสถานะโปรเจค",
        text: "กรุณาเลือกสถานะโปรเจคก่อนบันทึก",
      });
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
            <div className="prof_detail-table-container" >
              <div className="prof_detail-table-box" style={{ position: "relative" }}>
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
                    <h2 style={{ marginLeft: "20px" }}>
                      โครงงานของนิสิตรหัส : {projectDetails?.student_id || "ไม่พบข้อมูล"}
                    </h2>
                  </div>
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
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => window.open(`http://localhost:5000/${projectDetails.FilePath}`)}
                      style={{ display: 'flex', alignItems: 'center', marginBottom: '5px',cursor:'pointer',textDecoration:'underline'}}
                    >
                      {projectDetails.student_id}_Project.pdf
                    </a>
                  ) : (
                    "ไม่มีไฟล์ที่แนบ"
                  )}
                </div>

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
                  className="prof_detail-status-buttons"
                >
                  SAVE
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
