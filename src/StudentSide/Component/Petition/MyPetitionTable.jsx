import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate

import "./MyPetitionTable.css"; // ไฟล์ CSS แยกต่างหาก

const MyPetitionTable = () => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

  const steps = [
    "ยื่นคำร้องรอการตรวจสอบ",
    "เข้าที่ประชุม",
    "เจ้าหน้าที่รับคำร้อง",
    "คำร้องอนุมัติ",
    "เสร็จสิ้น",
];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // รูปแบบ DD/MM/YYYY
  };

  const filterTable = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(lowerCaseTerm)
    );
    setFilteredData(filtered);
  };

  // ดึงข้อมูลจาก Backend
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    fetch(`http://localhost:5000/petitions/${studentId}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setFilteredData(fetchedData); // ตั้งค่าเริ่มต้นให้ข้อมูลทั้งหมด
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงใน Search Bar
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterTable(term);
  };

  // ฟังก์ชันเมื่อกดเลือกแถว
  const handleRowClick = (item) => {
    navigate(`/professor/petition-detail`, { 
      state: { ApplicationID: item.ApplicationID, Petition_name: item.Petition_name }
    });
  };

  if (loading) {
    return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="table-container">
      <table className="mypetition-table" id="petitionTable">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>คำร้อง</th>
            <th>ฉบับ</th>
            <th>สถานะ</th>

          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                ไม่พบข้อมูลคำร้อง
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "row-even" : "row-odd"}
              onClick={() => handleRowClick(item)} // เมื่อคลิกจะส่งค่าไปยังหน้าใหม่
              style={{ cursor: "pointer" }}
              >
                <td>{formatDate(item.SubmissionDate)}</td>
                <td>{item.Petition_name}</td>
                <td>{item.Petition_version}</td>
                <td style={{fontSize:'12px'}}>{steps[item.Progress_State]}</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyPetitionTable;
