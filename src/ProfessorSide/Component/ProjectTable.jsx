import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PetitionTable.css"; // ใช้ CSS เดียวกัน

const ProjectTable = () => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]); // ข้อมูลที่ผ่านการกรอง
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectStatus, setProjectStatus] = useState({}); // เก็บสถานะโปรเจค
  const navigate = useNavigate();

  // สถานะที่ใช้แสดงในตาราง
  const steps = ["รอการตรวจสอบ", "ไม่อนุมัติ", "อนุมัติแล้ว"];

  useEffect(() => {
    fetch("http://localhost:5000/allprojects") // แก้ให้ตรงกับ API ของโปรเจค
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setFilteredData(fetchedData);

        // กำหนดสถานะเริ่มต้นของทุกโปรเจคเป็น "รอการตรวจสอบ"
        const initialStatus = {};
        fetchedData.forEach((item) => {
          initialStatus[item.ProjectID] = 0; // ใช้ ProjectID แทน ApplicationID
        });
        setProjectStatus(initialStatus);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันกรองข้อมูลในตาราง
  const filterTable = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredData(filtered);
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงใน Search Bar
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterTable(term);
  };

  // ฟังก์ชันเมื่อกดเลือกแถว
  const handleRowClick = (item) => {
    navigate(`/professor/project-detail`, {
      state: { ProjectID: item.ProjectID, ProjectTitle: item.ProjectTitle }, // เปลี่ยนเป็น ProjectID
    });
  };

  // ฟังก์ชันอัพเดทสถานะโปรเจค
  const handleStatusUpdate = (ProjectID, newStatus) => {
    // ทำการอัพเดทสถานะในฐานข้อมูล (สมมติว่ามี API สำหรับการอัพเดทสถานะ)
    fetch(`http://localhost:5000/updateProjectStatus/${ProjectID}`, {
      method: "PUT", // เปลี่ยนจาก POST เป็น PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_state: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectStatus((prevStatus) => ({
          ...prevStatus,
          [ProjectID]: newStatus, // อัพเดทสถานะของโปรเจคที่เลือก
        }));
      })
      .catch((error) => {
        console.error("Error updating project status:", error);
      });
  };

  if (loading) {
    return (
      <div className="loading-text">
        กำลังโหลดข้อมูล...
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="sub-header-square" />
        <h1 className="table-title">โครงงาน</h1>
        <input
          type="text"
          id="searchInput"
          className="search-bar"
          placeholder="ค้นหาโปรเจค, รหัสนิสิต, ชื่อนามสกุล"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="petition-table">
        <thead>
          <tr>
            <th>สถานะ</th> {/* สถานะโปรเจค */}
            <th>รหัสนิสิต</th>
            <th>ชื่อ - นามสกุล</th>
            <th>สาขาวิชา</th>
            <th>ชั้นปี</th>
            <th>ชื่อโปรเจค</th>
            <th>อัพเดทสถานะ</th> {/* เพิ่มคอลัมน์สำหรับปุ่ม */}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">ไม่พบข้อมูลโปรเจค</td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "row-even" : "row-odd"}
                onClick={() => handleRowClick(item)} // ใช้ handleRowClick ที่ส่ง ProjectID
                style={{ cursor: "pointer" }}
              >
                <td style={{ fontSize: "12px" }}>
                  {steps[projectStatus[item.ProjectID] || 0]} {/* แสดงสถานะ */}
                </td>
                <td>{item.StudentID}</td>
                <td>{item.FullName}</td>
                <td>{item.Major}</td>
                <td>{item.Year}</td>
                <td>{item.ProjectTitle}</td>
                <td>
                  {/* ปุ่มอัพเดทสถานะ */}
                  <button onClick={() => handleStatusUpdate(item.ProjectID, 1)}>อนุมัติ</button>
                  <button onClick={() => handleStatusUpdate(item.ProjectID, 2)}>ไม่อนุมัติ</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
