import React, { useEffect, useState } from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate

import "./Component/AdminPetitionTable.css";
import "./Component/AdminUserTable.css";



const AdminUserTable = ({role}) => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า
  
  console.log(role)
  const getRole = (role) => {
    if(role === "student"){
      return "นิสิตนักศึกษา";
    }
    else if(role === "admin"){
      return "เจ้าหน้าที่";

    }
    else if(role === "professor"){
      return "อาจารย์";

    }
    else if(role === "agency"){
      return "บริษัท";

    }
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
    if (!role){
        setLoading(true);
    } 
    if(role == 'allusers'){
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
    }
    //nisit
    else if(role == 'students'){
        fetch("http://localhost:5000/studentsinfo")
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
    }
        //Ajarn
    else if(role == 'professors'){
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
    }
    else if(role == 'admins'){
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
    }
    else if(role == 'company'){
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
    }
  }, [role]);

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

 if(role == 'allusers'){
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
                    <td style={{fontSize:'12px'}}>{index+1}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td className={`role-${item.role}`}>{getRole(item.role)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
 }
 else if(role == 'students'){
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
          <table className="student-table" id="userTable">
            <thead>
              <tr>
                <th></th>
                <th>ชื่อ-นามสกุล</th>
                <th>รหัสนิสิต</th>
                <th>สาขา</th>
                <th>บริษัทที่ฝึกงาน</th>
                <th>สถานะสหกิจ</th>

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
                    <td style={{fontSize:'12px'}}>{index+1}</td>
                    <td>{item.first_name} {item.last_name}</td>
                    <td>{item.student_id}</td>
                    <td>{item.major} - {item.year}</td>
                    <td>{item.company_name}</td>
                    <td className={`is-coopstudent-${item.is_coopstudent}`}>{item.is_coopstudent ? "เป็นนิสิตสหกิจ" : "ไม่ได้เป็น"}</td>


                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
 }
};

const Admin_UserManagement = () => {
    const [rolestate, setRoleState] = useState("allusers");
    const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

    const year = new Date().toLocaleDateString("th-TH", {
        year: "numeric"
      });
    const today = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
        <div className="home-background">
            <AdminSidebar   />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container" style={{marginTop:'20px'}}>
                    <div className="admin-cooperative-header">
                            <div style={{flex:'6'}}>
                                <h1 style={{fontSize:'26px',marginBottom:'0'}}>การจัดการผู้ใช้
                                </h1>
                                <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>

                            </div>
                            <div style={{flex:'1'}}>
                                <div>
                                <MenuStyledWrapper>
                                <label className="popup">
                                        <input type="checkbox" />
                                        <div className="burger" tabIndex={0}>
                                        <span />
                                        <span />
                                        <span />
                                        </div>
                                        <nav className="popup-window">
                                        <legend style={{fontWeight:'500'}}>Users</legend>
                                        <ul>
                                            <li>
                                            <button onClick={() => setRoleState("allusers")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle r={5} cy={7} cx={9} />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>ผู้ใช้ทั้งหมด</span>
                                            </button>
                                            </li>
                                            <li>
                                            <button onClick={() => setRoleState("students")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle r={5} cy={7} cx={9} />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>นิสิตนักศึกษา</span>
                                            </button>
                                            </li>
                                            <li>
                                            <button onClick={() => setRoleState("professors")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle r={5} cy={7} cx={9} />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>อาจารย์</span>
                                            </button>
                                            </li>
                                            <li>
                                            <button onClick={() => setRoleState("admins")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle r={5} cy={7} cx={9} />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>เจ้าหน้าที่</span>
                                            </button>
                                            </li>
                                            <li>
                                            <button onClick={() => setRoleState("company")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle r={5} cy={7} cx={9} />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>บริษัท</span>
                                            </button>
                                            </li>
                                            <hr />
                                            <li>
                                            <button onClick={() => navigate("/admin/prof-register")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                                                    <circle cx="10" cy="8" r="5"></circle>
                                                    <path d="M19 16v6"></path>
                                                    <path d="M22 19h-6"></path>
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>ลงทะเบียนอาจารย์</span>
                                            </button>
                                            </li>
                                            <li>
                                            <button onClick={() => navigate("/admin/register")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                                                    <circle cx="10" cy="8" r="5"></circle>
                                                    <path d="M19 16v6"></path>
                                                    <path d="M22 19h-6"></path>
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>ลงทะเบียนเจ้าหน้าที่</span>
                                            </button>
                                            </li>
                                            <li>
                                            <button onClick={() => navigate("/admin/company-register")}>
                                                <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" height={14} width={14} xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 21a8 8 0 0 1 13.292-6"></path>
                                                    <circle cx="10" cy="8" r="5"></circle>
                                                    <path d="M19 16v6"></path>
                                                    <path d="M22 19h-6"></path>
                                                </svg>
                                                <span style={{fontFamily:'Noto Sans Thai'}}>ลงทะเบียนบริษัท</span>
                                            </button>
                                            </li>

                                        </ul>
                                        </nav>
                                    </label>
                                    </MenuStyledWrapper>
                                </div>
                            </div>
                    </div>
                    <div style={{flex:'9'}}>
                        <AdminUserTable role = {rolestate}/>
                    </div>
                </div>
            </div>

        </div>
    );
}

const MenuStyledWrapper = styled.div`

  /* The design is inspired from the mockapi.io */

  .popup {
    --burger-line-width: 1.125em;
    --burger-line-height: 0.125em;
    --burger-offset: 0.625em;
    --burger-bg: rgba(0, 0, 0, 0);
    --burger-color: #333;
    --burger-line-border-radius: 0.1875em;
    --burger-diameter: 2.125em;
    --burger-btn-border-radius: calc(var(--burger-diameter) / 2);
    --burger-line-transition: .3s;
    --burger-transition: all .1s ease-in-out;
    --burger-hover-scale: 1.1;
    --burger-active-scale: .95;
    --burger-enable-outline-color: var(--burger-bg);
    --burger-enable-outline-width: 0.125em;
    --burger-enable-outline-offset: var(--burger-enable-outline-width);
    /* nav */
    --nav-padding-x: 1em;
    --nav-padding-y: 0.625em;
    --nav-border-radius: 0.375em;
    --nav-border-color: #ccc;
    --nav-border-width: 0.0625em;
    --nav-shadow-color: rgba(0, 0, 0, .2);
    --nav-shadow-width: 0 1px 5px;
    --nav-bg: #eee;
    --nav-font-family: Noto Sans Thai, sans-serif;
    --nav-default-scale: .8;
    --nav-active-scale: 1;
    --nav-position-left: 0;
    --nav-position-right: unset;
    /* if you want to change sides just switch one property */
    /* from properties to "unset" and the other to 0 */
    /* title */
    --nav-title-size: 0.625em;
    --nav-title-color: #777;
    --nav-title-padding-x: 1rem;
    --nav-title-padding-y: 0.25em;
    /* nav button */
    --nav-button-padding-x: 1.25rem;
    --nav-button-padding-y: 0.400em;
    --nav-button-border-radius: 0.375em;
    --nav-button-font-size: 12px;
    --nav-button-hover-bg: #006765;
    --nav-button-hover-text-color: #fff;
    --nav-button-distance: 0.875em;
    /* underline */
    --underline-border-width: 0.0625em;
    --underline-border-color: #ccc;
    --underline-margin-y: 0.3125em;
  }

  /* popup settings 👆 */

  .popup {
    display: inline-block;
    text-rendering: optimizeLegibility;
    position: relative;
  }

  .popup input {
    display: none;
  }

  .burger {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background: var(--burger-bg);
    width: var(--burger-diameter);
    height: var(--burger-diameter);
    border-radius: var(--burger-btn-border-radius);
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: var(--burger-transition);
    outline: var(--burger-enable-outline-width) solid transparent;
    outline-offset: 0;
  }

  .burger span {
  
    height: var(--burger-line-height);
    width: var(--burger-line-width);
    background: var(--burger-color);
    border-radius: var(--burger-line-border-radius);
    position: absolute;
    transition: var(--burger-line-transition);
  }

  .burger span:nth-child(1) {
    top: var(--burger-offset);
  }

  .burger span:nth-child(2) {
    bottom: var(--burger-offset);
  }

  .burger span:nth-child(3) {
    top: 50%;
    transform: translateY(-50%);
  }

  .popup-window {
    transform: scale(var(--nav-default-scale));
    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: var(--nav-padding-y) var(--nav-padding-x);
    background: var(--nav-bg);
    font-family: var(--nav-font-family);
    color: var(--nav-text-color);
    border-radius: var(--nav-border-radius);
    box-shadow: var(--nav-shadow-width) var(--nav-shadow-color);
    border: var(--nav-border-width) solid var(--nav-border-color);
    top: calc(var(--burger-diameter) + var(--burger-enable-outline-width) + var(--burger-enable-outline-offset));
    left: var(--nav-position-left);
    right: var(--nav-position-right);
    transition: var(--burger-transition);
  }

  .popup-window legend {
    padding: var(--nav-title-padding-y) var(--nav-title-padding-x);
    margin: 0;
    color: var(--nav-title-color);
    font-size: var(--nav-title-size);
    text-transform: uppercase;
  }

  .popup-window ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .popup-window ul button {
    outline: none;
    width: 100%;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    color: var(--burger-color);
    font-size: var(--nav-button-font-size);
    padding: var(--nav-button-padding-y) var(--nav-button-padding-x);
    white-space: nowrap;
    border-radius: var(--nav-button-border-radius);
    cursor: pointer;
    column-gap: var(--nav-button-distance);
  }

  .popup-window ul li:nth-child(1) svg,
  .popup-window ul li:nth-child(2) svg,
  .popup-window ul li:nth-child(3) svg,
  .popup-window ul li:nth-child(4) svg,
  .popup-window ul li:nth-child(5) svg,{
    color: #006765;
  }

  .popup-window ul li:nth-child(7) svg,
  .popup-window ul li:nth-child(8) svg
  .popup-window ul li:nth-child(9) svg {
    color: rgb(0, 0, 0);
  }

  .popup-window ul li:nth-child(10) svg {
    color: red;
  }

  .popup-window hr {
    margin: var(--underline-margin-y) 0;
    border: none;
    border-bottom: var(--underline-border-width) solid var(--underline-border-color);
  }

  /* actions */

  .popup-window ul button:hover,
  .popup-window ul button:focus-visible,
  .popup-window ul button:hover svg,
  .popup-window ul button:focus-visible svg {
    color: var(--nav-button-hover-text-color);
    background: var(--nav-button-hover-bg);
  }

  .burger:hover {
    transform: scale(var(--burger-hover-scale));
  }

  .burger:active {
    transform: scale(var(--burger-active-scale));
  }

  .burger:focus:not(:hover) {
    outline-color: var(--burger-enable-outline-color);
    outline-offset: var(--burger-enable-outline-offset);
  }

  .popup input:checked+.burger span:nth-child(1) {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }

  .popup input:checked+.burger span:nth-child(2) {
    bottom: 50%;
    transform: translateY(50%) rotate(-45deg);
  }

  .popup input:checked+.burger span:nth-child(3) {
    transform: translateX(calc(var(--burger-diameter) * -1 - var(--burger-line-width)));
  }

  .popup input:checked~nav {
    transform: scale(var(--nav-active-scale));
    visibility: visible;
    opacity: 1;
  }`;


export default Admin_UserManagement;
