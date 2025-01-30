import React, { useEffect, useState } from "react";
import "./PetitionTable.css"; // ไฟล์ CSS แยกต่างหาก

const PetitionTable = () => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    fetch("http://localhost:5000/allpetitions")
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

  if (loading) {
    return <div className="loading-text">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="sub-header-square" />
        <h1 className="table-title">คำร้องทั้งหมด</h1>
        {/* Search Bar */}
        <input
          type="text"
          id="searchInput"
          className="search-bar"
          placeholder="ค้นหาคำร้อง, รหัสนิสิต, ชื่อนามสกุล"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="petition-table" id="petitionTable">
        <thead>
          <tr>
            <th>สถานะ</th>
            <th>รหัสนิสิต</th>
            <th>ชื่อ - นามสกุล</th>
            <th>สาขาวิชา</th>
            <th>ชั้นปี</th>
            <th>รายละเอียดคำร้อง</th>

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
              <tr key={index} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                <td>{item.Progress_State}</td>
                <td>{item.StudentID}</td>
                <td>{item.FullName}</td>
                <td>{item.Major}</td>
                <td>{item.Year}</td>
                <td>{item.Petition_name} ฉบับที่ {item.Petition_version}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PetitionTable;
