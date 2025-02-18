import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate

import "./AdminPetitionTable.css"; // ไฟล์ CSS แยกต่างหาก
import "./AdminUserTable.css"; // ไฟล์ CSS แยกต่างหาก

const AdminUserTable = () => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า
  

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
    fetch("http://localhost:5000/user")
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
    navigate(`/admin/petition-detail`, { 
      state: { ApplicationID: item.ApplicationID, Petition_name: item.Petition_name }
    });
  };

  if (loading) {
    return(
    <div className="loading-text">กำลังโหลดข้อมูล...
      <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'20px'}}>
        <div class="loader"></div>
      </div>
    </div>
    )
    
  }

  return (
    <div className="user-table-container" >
      <div className="table-header">
        <div className="sub-header-square" />
        <div style={{display: 'flex'}}>
            <h1 className="table-title" style={{fontWeight:'400'}}>จำนวนผู้ใช้ </h1>
            <p style={{fontWeight:'500',fontSize:'20px',marginLeft:'20px'}}>{data.length} </p>
        </div>
        <input
          type="text"
          id="searchInput"
          className="search-bar"
          style={{marginLeft:'50%',maxWidth:'500px'}}
          placeholder="ค้นหาคำร้อง, รหัสนิสิต, ชื่อนามสกุล"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="user-table" id="userTable">
        <thead>
          <tr>
            <th></th>
            <th>ชื่อ-นามสกุล</th>
            <th>อีเมล์</th>
            <th>ตำแหน่ง</th>

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
                <td style={{fontSize:'12px'}}>{index}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
