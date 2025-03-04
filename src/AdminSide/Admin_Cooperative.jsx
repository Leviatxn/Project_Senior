import React, { useEffect, useState } from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import './Admin_Cooperative.css';
import {   Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    TableSortLabel,
    Chip } from "@mui/material";

import "./Component/AdminPetitionTable.css";
import "./Component/AdminUserTable.css";



const AdminUserTable = ({currentstate}) => {
  const [data, setData] = useState([]); // เก็บข้อมูลทั้งหมด
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const visibleData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const sortedData = [...filteredData].sort((a, b) => {
      return isAsc
        ? (a[property] > b[property] ? 1 : -1)
        : (a[property] < b[property] ? 1 : -1);
    });
    setFilteredData(sortedData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pass":
        return "success"; // สีเขียว
      case "reject":
        return "error"; // สีแดง
      case "working":
        return "info"; // สีฟ้า
      case "wait":
            return "default"; // สีฟ้า
      default:
        return "default";
    }
  };

  const getCoopStatus = (status) => {
    if(status === "pass"){
      return "ผ่านการฝึกงาน";
    }
    else if(status === "reject"){
      return "ไม่ผ่านการฝึกงาน";

    }
    else if(status === "working"){
      return "กำลังฝึกงาน";

    }
    else if(status === "wait"){
      return "ยังไม่เริ่มการฝึกงาน";

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
    if (!currentstate){
        setLoading(true);
        console.log(currentstate)
    } 
    else if(currentstate == 'students'){
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
    else if(currentstate == 'professors'){
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
    else if(currentstate == 'admins'){
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

  }, [currentstate]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงใน Search Bar
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterTable(term);
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

 if(currentstate == 'students'){
    return (
        <div className="user-table-container"  style={{  padding: "20px 20px 20px 20px"}}>
          <div className="table-header" style={{padding:'10px 10px 10px 40px'}}>
            <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                    <div className="sub-header-square" />
                    <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px'}}>การฝึกงานและสถานการฝึกงาน </h1>
                </div>
                <div style={{flex:'1',paddingRight:'10px'}}>
                    <input
                    type="text"
                    id="searchInput"
                    className="search-bar"
                    style={{marginLeft:'0',maxWidth:'430px'}}
                    placeholder="ค้นหาคำร้อง, รหัสนิสิต, ชื่อนามสกุล"
                    value={searchTerm}
                    onChange={handleSearch}
                    />
                </div>
          </div>

          <div style={{padding:'10px 0 10px 40px'}}>
            <TableContainer >
                <Table >
                    {/* ✅ หัวตาราง */}
                    <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                            <TableSortLabel
                                active={orderBy === "student_id"}
                                direction={orderBy === "student_id" ? order : "asc"}
                                onClick={() => handleSort("student_id")}
                            >
                               <strong>รหัสนิสิต</strong>
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                            <TableSortLabel
                                    active={orderBy === "first_name"}
                                    direction={orderBy === "first_name" ? order : "asc"}
                                    onClick={() => handleSort("first_name")}
                                >
                                <strong>ชื่อ-นามสกุล</strong>
                            </TableSortLabel>

                        </TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                        <TableSortLabel
                                    active={orderBy === "major"}
                                    direction={orderBy === "major" ? order : "asc"}
                                    onClick={() => handleSort("major")}
                                >
                                <strong>สาขา</strong>
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                        <TableSortLabel
                                    active={orderBy === "company_name"}
                                    direction={orderBy === "company_name" ? order : "asc"}
                                    onClick={() => handleSort("company_name")}
                                >
                                <strong>บริษัทที่ฝึกงาน</strong>
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                        <TableSortLabel
                                    active={orderBy === "coop_state"}
                                    direction={orderBy === "coop_state" ? order : "asc"}
                                    onClick={() => handleSort("coop_state")}
                                >
                                <strong>สถานะการฝึกงาน   </strong>
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                    </TableHead>

                    {/* ✅ ข้อมูลในตาราง */}
                    <TableBody>
                    {visibleData.map((item, index) => (
                        <TableRow key={index} hover onClick={() => handleRowClick(item)} sx={{ cursor: "pointer" }}>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.student_id}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.first_name} {item.last_name}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.major} - {item.year}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.company_name ? NULL : '-'}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                            <Chip sx={{ fontFamily: "Noto Sans Thai, sans-serif",fontWeight:'bold'}} label={getCoopStatus(item.coop_state)} color={getStatusColor(item.coop_state)} />
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                      {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                    }}
                />
                      {/* Popup Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>รายละเอียดนิสิต</DialogTitle>
                    <DialogContent>
                    {selectedRow && (
                        <div>
                        <p><strong>รหัสนิสิต:</strong> {selectedRow.student_id}</p>
                        <p><strong>ชื่อ-นามสกุล:</strong> {selectedRow.first_name}</p>
                        <p><strong>สาขา:</strong> {selectedRow.major}</p>
                        <p><strong>บริษัทที่ฝึกงาน:</strong> {selectedRow.company_name}</p>
                        <p><strong>สถานะการฝึกงาน:</strong> {selectedRow.coop_state}</p>
                        </div>
                    )}
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">ปิด</Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
          </div>
        </div>
      );
 }
};

const Admin_Cooperative = () => {
    const [currentstate, setCurrentState] = useState("students");
    
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
                <div className="admin-cooperative-content-container">
                    <div className="admin-cooperative-content-box">
                        <div className="admin-cooperative-header" >
                            <div >
                                <h1 style={{fontSize:'26px',marginBottom:'0'}}>การฝึกงานสหกิจศึกษา</h1>
                                <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>
                            </div>
                            <div className="cooperative-detail">
                            </div>
                        </div>
                        <div className="admin-cooperative-main-content" >
                                <div className="coop-document-box">
                                    <div className="petition-underline" />
                                    <div className="coop-document-menu">
                                        <nav>
                                            <ul>
                                            <li>
                                                    <a onClick={() => setCurrentState("students")} style={{cursor:'pointer'}}>
                                                        ข้อมูลนิสิตสหกิจ
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={() => setCurrentState("first_supervisor")} style={{cursor:'pointer'}}>
                                                        นิเทศครั้งที่ 1
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={() => setCurrentState("second_supervisor")} style={{cursor:'pointer'}}>
                                                        นิเทศครั้งที่ 2
                                                    </a>
                                                </li> 
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="admin-coop-table-box" style={{flex: '8',marginLeft: '20px'}}>
                                    <AdminUserTable currentstate = {currentstate}/>
                                </div>
                        </div>  
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Admin_Cooperative;
