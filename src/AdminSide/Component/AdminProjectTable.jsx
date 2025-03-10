import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProjectTable.css"; 

const AdminProjectTable = () => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]); // ข้อมูลที่ผ่านการกรอง
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ปรับ mapping สถานะตามข้อมูล SQL
  const steps = ["รอการตรวจสอบ", "อนุมัติ", "ไม่อนุมัติ"];

  useEffect(() => {
    fetchProjects();
  }, []);

  // ฟังก์ชันดึงข้อมูลโปรเจค
  const fetchProjects = () => {
    setLoading(true);
    fetch("http://localhost:5000/allprojects") 
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setFilteredData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  // ฟังก์ชันกรองข้อมูลในตาราง (แก้ไขให้รองรับ undefined/null)
  const filterTable = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item)
        .map((value) => value?.toString() || "") // ป้องกันค่า null หรือ undefined
        .join(" ")
        .toLowerCase()
        .includes(lowerCaseTerm)
    );
    setFilteredData(filtered);
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงใน Search Bar
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterTable(term);
  };

  // ฟังก์ชันเมื่อกดเลือกแถว (ป้องกัน ProjectID เป็น undefined)
  const handleRowClick = (item) => {
    navigate(`/admin/project-detail`, {
      state: {
        ProjectID: item.ProjectID || "Unknown",
        ProjectTitle: item.ProjectTitle || "ไม่มีชื่อโปรเจค",
      },
    });
  };

  if (loading) {
    return (
      <div className="project-loading-text">
        กำลังโหลดข้อมูล...
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-table-container"> 
      <div className="project-table-header">
        <div className="sub-header-square" />
        <h1 className="table-title">โครงงานทั้งหมด</h1>
        <div className="search-container">
          <input
            type="text"
            id="searchInput"
            className="project-search-bar"
            placeholder="ค้นหาโปรเจค, รหัสนิสิต, ชื่อนามสกุล"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="project-refresh-button" onClick={fetchProjects}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zM-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            ></path>
          </svg>
          รีเฟรชข้อมูล
        </button>
        </div>
      </div>
      <table className="project-table">
        <thead>
          <tr>
            <th>สถานะ</th>
            <th>รหัสนิสิต</th>
            <th>ชื่อ - นามสกุล</th>
            <th>สาขาวิชา</th>
            <th>ชั้นปี</th>
            <th>ชื่อโปรเจค</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                ไม่พบข้อมูลโปรเจค
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "row-even" : "row-odd"}
                onClick={() => handleRowClick(item)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ fontSize: "12px" }}>
                  {steps[ 
                    item.project_state >= 0 && item.project_state < steps.length
                      ? item.project_state
                      : 0
                  ]}
                </td>
                <td>{item.StudentID}</td>
                <td>{item.FullName}</td>
                <td>{item.Major}</td>
                <td>{item.Year}</td>
                <td>{item.ProjectTitle}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProjectTable;
