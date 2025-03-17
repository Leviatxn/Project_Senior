import React, { useEffect, useState } from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import './Admin_Cooperative.css';
import {   
  Avatar,
  Table,
  Box,
  FormControl,
  Select,
  Grid,
  MenuItem,
  Typography,
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
    CircularProgress ,
    Chip } from "@mui/material";

import "./Component/AdminPetitionTable.css";
import "./Component/AdminUserTable.css";

import axios from "axios";
import styled from 'styled-components';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminCoopTable = ({currentstate}) => {
  const [data, setData] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [coopInfo, setCoopInfo] = useState(null);
  const [firstSupervisor, setFirstSupervisor] = useState();
  const [secondSupervisor, setSecondSupervisor] = useState();
  const [isEmptyInfo, setIsEmptyInfo] = useState();
  const [schedule, setSchedule] = useState(false);
  const [isApprove, setIsApprove] = useState(false);

  const [localstudentID, setLocalStudentID] = useState()

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");

  
  const navigate = useNavigate();
  const visibleData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function formatDate(dateString) {
    if (!dateString || dateString === "0000-00-00") return ""; // กรณีเป็น NULL หรือค่าเริ่มต้น

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 1 เพราะ getMonth() เริ่มจาก 0
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  const formatCoopDate = (isoString) => {
    if(isoString == null){
      return '-'
    }
    const date = new Date(isoString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatThaiDate = (isoString) => {
    if(isoString == null){
      return '-'
    }
    const date = new Date(isoString);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleStudentClick = (student_id) => {
    handleStudentInfo(student_id)
    setOpen(true);
  };

  const handleFirstSupervisorClick = (student_id) => {
    handleFirstSupervisorInfo(student_id)
    setOpen(true);
  };

  const handleSecondSupervisorClick = (student_id) => {
    handleSecondSupervisorInfo(student_id)
    setOpen(true);
  };

  const handleSetScheduleClick = (student_id) => {
    console.log(student_id)
    setSchedule(true);
  };

  const handleClose = () => {
    setIsEmptyInfo(0);
    setFirstSupervisor(null)
    setStudentInfo(null);
    setCoopInfo(null)
    setOpen(false);

  };

  const handleStudentInfo = async(studentID) => {
    if (!studentID) {
      console.error("ไม่พบ studentId หรือ token");
      return;
  }
    try {
        const response = await axios.get(`http://localhost:5000/user_info/${studentID}`, {
        });

        if (response.data) {
            console.log(response.data);
            setStudentInfo(response.data);
        } else {
            console.error("ไม่พบข้อมูลผู้ใช้");
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
    try {
      const response = await axios.get(`http://localhost:5000/coop_info/${studentID}`, {
      });

      if (response.data) {
          setIsEmptyInfo(0);

          console.log(response.data);
          setCoopInfo(response.data);
      } else {

          console.error("ไม่พบข้อมูลผู้ใช้");
      }
  } catch (err) {
    setIsEmptyInfo(1);
    console.log("sadass")
      console.error("Error fetching user data:", err);
  }
  }

  const handleFirstSupervisorInfo = async(studentID) => {
    setLocalStudentID(studentID);
    if (!studentID) {
      console.error("ไม่พบ studentId หรือ token");
      return;
  }
    try {
      const response = await axios.get(`http://localhost:5000/user_info/${studentID}`, {
      });

      if (response.data) {
          console.log(response.data);
          setStudentInfo(response.data);
      } else {
          console.error("ไม่พบข้อมูลผู้ใช้");
      }
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
    try {
      const response = await axios.get(`http://localhost:5000/coop_info/${studentID}`, {
      });

      if (response.data) {
          console.log(response.data);
          setCoopInfo(response.data);
      } else {
          console.error("ไม่พบข้อมูลผู้ใช้");
      }
  } catch (err) {
      console.error("Error fetching user data:", err);
  }
    try {
        const response = await axios.get(`http://localhost:5000/first_appointment/${studentID}`, {
        });

        if (response.data) {
            console.log(response.data);
            setFirstSupervisor(response.data);
            setIsEmptyInfo(0);

        } else {
            console.error("ไม่พบข้อมูลผู้ใช้");
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        setIsEmptyInfo(1);
    }
  }   

  const handleSecondSupervisorInfo = async(studentID) => {
    setLocalStudentID(studentID);
    if (!studentID) {
      console.error("ไม่พบ studentId หรือ token");
      return;
  }
    try {
      const response = await axios.get(`http://localhost:5000/user_info/${studentID}`, {
      });

      if (response.data) {
          console.log(response.data);
          setStudentInfo(response.data);
      } else {
          console.error("ไม่พบข้อมูลผู้ใช้");
      }
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
    try {
      const response = await axios.get(`http://localhost:5000/coop_info/${studentID}`, {
      });

      if (response.data) {
          console.log(response.data);
          setCoopInfo(response.data);
      } else {
          console.error("ไม่พบข้อมูลผู้ใช้");
      }
  } catch (err) {
      console.error("Error fetching user data:", err);
  }
    try {
        const response = await axios.get(`http://localhost:5000/second_appointment/${studentID}`, {
        });

        if (response.data) {
            console.log(response.data);
            setSecondSupervisor(response.data);
            setIsEmptyInfo(0);

        } 

        else {
            console.error("ไม่พบข้อมูลผู้ใช้");
        }
    } catch (err) {
        setIsEmptyInfo(1);
        console.log(isEmptyInfo)
        console.error("Error fetching user data:", err);

  
    }
  }

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
      case 0:
          return "default";
      case 1:
          return "success"; // สีเขียว
      case "pass":
        return "success"; // สีเขียว
      case "reject":
        return "error"; // สีแดง
      case "working":
        return "info"; // สีฟ้า
      case "wait" :
            return "default";
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
  const getSupervisorStatus = (status) => {
      if(status === 0){
        return "ยังไม่ได้รับการนิเทศน์";
      }
      else if(status === 1){
        return "ได้รับการนิเทศน์เรียบร้อย";
      }
      else
      {
        return "error";
      }
    };
  const getMajorName= (major) => {
      switch (major) {
        case 'T12':
            return "วิศวกรรมคอมพิวเตอร์และสารสนเทศศาสตร์";
        case 'T13':
            return "วิศวกรรมเครื่องกลและการออกแบบ";
        case 'T14':
            return "วิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์";
        case 'T17':
            return "วิศวกรรมอุตสาหการและระบบ";
        case 'T20':
            return "วิศวกรรมระบบการผลิตดิจิทัล";
        case 'T23':
            return "วิศวกรรมดิจิทัลและอีเล็กทรอนิกส์อัจฉริยะ";
        case 'T18':
            return "วิศวกรรมเครื่องกลและระบบการผลิต";
        case 'T19':
            return "วิศวกรรมหุ่นยนต์และระบบอัตโนมัติ";
        case 'T22':
            return "วิศวกรรมยานยนต์";                  
        default:
          return "default";
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
        fetch("http://localhost:5000/studentsCoopinfo")
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
    else if(currentstate == 'first_supervisor' || currentstate == 'second_supervisor'){
        fetch("http://localhost:5000/studentsCoopinfo")
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

  const handleFirstAppointmentDataChange = (e) => {
    const { name, value } = e.target;
    setFirstSupervisor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSecondAppointmentDataChange = (e) => {
    const { name, value } = e.target;
    setSecondSupervisor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleFirstAppointmentEdit = async (e) => {   
      e.preventDefault();
      console.log(firstSupervisor)
      console.log(localstudentID);
  
        try {
          const response = await axios.put(
            `http://localhost:5000/updateAdvisorInAppointment1/${localstudentID}`,
            {
              advisor_date: firstSupervisor.advisor_date,
              advisor_time: firstSupervisor.advisor_time,
              travel_type: firstSupervisor.travel_type,
              appointment_type: firstSupervisor.appointment_type
            },
            { headers: { "Content-Type": "application/json" } }
          );
          if (response.status === 200) {
            setSchedule(false);
            Swal.fire({
              position: "top",
              icon: "success",
              title: "แก้ไขข้อมูลเสร็จสิ้น!",
              text: "โปรดรอการตรวจสอบจากอาจารย์",
              timer: 2000
            });
          } else {
            alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
          }      
        } catch (error) {
          alert(
            error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
          );
        }
    
  };
  
  const handleSubmitFirstAccept = async (studentID) => {
    if(isApprove === true){
      const response = await axios.put(
        `http://localhost:5000/acceptAppointment1/${studentID}`,
        {
          is_accept: 1
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "แก้ไขข้อมูลเสร็จสิ้น!",
          text: "โปรดรอการตรวจสอบจากอาจารย์",
          timer: 2000
        });
      } else {
        alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
      }   
    }
    else if(isApprove === false){
      return 0;
    } 
  }

  const handleFirstAppointmentAccept = (studentID) => {   
    console.log(studentID);
      try {
        handleClose();
        Swal.fire({
          title: "ต้องการยืนยันเวลาหรือไม่?",
          text: "หากคุณยืนยันเวลาดังกล่าวจะไม่สามารถแก้ไขได้อีก",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน"
        }).then((result) => {
          if (result.isConfirmed) {
            setIsApprove(true);
             // รอให้ isApprove อัปเดตก่อนเรียก handleSubmitFirstAccept
            setTimeout(() => handleSubmitFirstAccept(studentID), 0);
          }
          else{
            setIsApprove(false)
          }
        }); 
      } catch (error) {
        alert(
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
        );
      }  
  };


  const handleSecondAppointmentEdit = async (e) => {   
    e.preventDefault();
    console.log(secondSupervisor)
    console.log(localstudentID);

      try {
        const response = await axios.put(
          `http://localhost:5000/updateAdvisorInAppointment2/${localstudentID}`,
          {
            advisor_date: secondSupervisor.advisor_date,
            advisor_time: secondSupervisor.advisor_time,
            travel_type: secondSupervisor.travel_type,
            appointment_type: secondSupervisor.appointment_type
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          setSchedule(false);
          Swal.fire({
            position: "top",
            icon: "success",
            title: "แก้ไขข้อมูลเสร็จสิ้น!",
            text: "โปรดรอการตรวจสอบจากอาจารย์",
            timer: 2000
          });
        } else {
          alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
        }      
      } catch (error) {
        alert(
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
        );
      }
  
  };
  
  const handleSubmitSecondAccept = async (studentID) => {
    if(isApprove === true){
      const response = await axios.put(
        `http://localhost:5000/acceptAppointment2/${studentID}`,
        {
          is_accept: 1
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "แก้ไขข้อมูลเสร็จสิ้น!",
          text: "โปรดรอการตรวจสอบจากอาจารย์",
          timer: 2000
        });
      } else {
        alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
      }   
    }
    else if(isApprove === false){
      return 0;
    } 
  }

  const handleSecondAppointmentAccept = (studentID) => {   
    console.log(studentID);
      try {
        handleClose();
        Swal.fire({
          title: "ต้องการยืนยันเวลาหรือไม่?",
          text: "หากคุณยืนยันเวลาดังกล่าวจะไม่สามารถแก้ไขได้อีก",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน"
        }).then((result) => {
          if (result.isConfirmed) {
            setIsApprove(true);
            // รอให้ isApprove อัปเดตก่อนเรียก handleSubmitFirstAccept
            setTimeout(() => handleSubmitSecondAccept(studentID), 0);
          }
          else{
            setIsApprove(false)
          }
        }); 
      } catch (error) {
        alert(
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
        );
      }  
  };

    // ฟังก์ชันเมื่อกดเลือกแถว
  const handleEvaluationClick = (item) => {
    navigate(`/professor/evaluation`, { 
      state: { studentID: item }
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
                    style={{marginLeft:'0',maxWidth:'380px'}}
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
                        <TableRow key={index} hover onClick={() => handleStudentClick(item.student_id)} sx={{ cursor: "pointer" }}>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.student_id}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.first_name} {item.last_name}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.major} - {item.year}</TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.company_name}</TableCell>
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
                <Dialog open={open} onClose={handleClose}
                  maxWidth="md" fullWidth
                  sx={{
                    "& .MuiDialog-paper": {
                      borderRadius: "12px",
                      padding: "20px 20px 50px 20px",
                    }
                  }}>

                    <DialogTitle >
                      <div style={{display:'flex'}}>
                        <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                          <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                          <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลนิสิต </h1>
                        </div>
                        <Button onClick={handleClose} color="primary" sx={{fontFamily: "Noto Sans Thai, sans-serif" }}>
                          ปิด
                        </Button>
                      </div>
                      </DialogTitle>
                    <DialogContent >
                    {(!studentInfo) ? (
                        // แสดง Loading ขณะรอข้อมูล
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                          <CircularProgress />
                        </div>
                      ) : (
                        <div style={{display:'flex',borderRadius:'10px',border:'1px solid rgba(0, 0, 13, 0.15)',padding:'20px 0px 20px 30px'}}>
                          <div style={{flex: '1'}}>
                            <p style={{color:'#767676'}}>รหัสนิสิต :</p>
                            <p style={{color:'#767676'}}>ชื่อ-นามสกุล :</p>
                            <p style={{color:'#767676'}}>เบอร์โทรศัพท์ :</p>
                            <p style={{color:'#767676'}}>อีเมล์ :</p>
                            <p style={{color:'#767676'}}>สาขา :</p>
                          </div>
                          <div style={{flex: '3'}}>
                            <p>{studentInfo.student_id}</p>
                            <p>{studentInfo.first_name} {studentInfo.last_name}</p>
                            <p> {studentInfo.phone_number}</p>
                            <p>{studentInfo.email}</p>
                            <p>{getMajorName(studentInfo.major)} ชั้นปีที่ {studentInfo.year}</p>
                          </div>
                          <div style={{flex: '3',display:'flex',justifyContent: 'center',alignItems:'center'}}>
                            <Avatar  src={`http://localhost:5000${studentInfo.profile_img}`} sx={{ width: 150, height: 150, mx: "auto" }} />
                          </div>
                        </div>
                    )}
                    </DialogContent>

                    <DialogTitle >
                    <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                        <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                        <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลสหกิจศึกษา </h1>
                    </div>
                    </DialogTitle>               
                    <DialogContent >
                    {(!coopInfo) ? (
                                (isEmptyInfo === 1) ? (
                                  <div style={{ textAlign: "center", padding: "20px", color: "#767676" }}>
                                    <p>ไม่มีข้อมูล</p>
                                  </div>
                                ) : (
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                    <CircularProgress />
                                  </div>
                                )
                                ) : (
                        <div style={{display:'flex',borderRadius:'10px',border:'1px solid rgba(0, 0, 13, 0.15)',padding:'20px 30px 20px 30px'}}>
                          <div style={{flex: '3',display:'flex',borderRight:'1px solid #ddd'}}>
                            <div style={{flex: '1'}}>
                              <p style={{color:'#767676'}}>สถานะสหกิจศึกษา :</p>
                              <p style={{color:'#767676'}}>ช่วงเวลาที่ฝึกงาน :</p>
                              <p style={{color:'#767676'}}>ชื่อบริษัท (ภาษาไทย) :</p>
                              <p style={{color:'#767676'}}>ชื่อบริษัท (ภาษาอังกฤษ) :</p>
                            </div>
                            <div style={{flex: '1'}}>
                              <Chip sx={{ fontFamily: "Noto Sans Thai, sans-serif",fontWeight:'bold',mt:1,ml:-2}} label={getCoopStatus(studentInfo.coop_state)} color={getStatusColor(studentInfo.coop_state)} />
                              <p>{formatCoopDate(coopInfo.Coop_StartDate)} - {formatCoopDate(coopInfo.Coop_EndDate)}</p>
                              <p>{coopInfo.CompanyNameTH}</p>
                              <p>{coopInfo.CompanyNameEN}</p>
                            </div>
                          </div>

                          <div style={{flex: '3',marginLeft:"30px"}}>
                            <div style={{flex: '1',display: 'flex'}}>
                              <div style={{flex: '1'}}>
                                <p style={{color:'#767676'}}>ที่อยู่บริษัท :</p>
                              </div>
                              <div style={{flex: '2',textAlign:'end'}}>
                                <p>{coopInfo.CompanyAddress}</p>
                              </div>
                            </div>

                            <div style={{flex: '1',display: 'flex'}}>
                              <div style={{flex: '1'}}>
                                <p style={{color:'#767676'}}>จังหวัดที่ฝึกงาน :</p>
                                <p style={{color:'#767676'}}>เบอร์โทรบริษัท :</p>
                                <p style={{color:'#767676'}}>เบี้ยเลี้ยง :</p>

                              </div>
                              <div style={{flex: '2',textAlign:'end'}}>
                                <p>{coopInfo.CompanyProvince}</p>
                                <p>{coopInfo.CompanyPhoneNumber}</p>
                                <p>{coopInfo.Allowance} บาท / ต่อวัน</p>

                              </div>
                            </div>
                          </div>
                        </div>
                    )}
                    </DialogContent>

                    
                </Dialog>
            </TableContainer>
          </div>
        </div>
      );
 }

else if(currentstate == 'first_supervisor'){
  return (
      <div className="user-table-container"  style={{  padding: "20px 20px 20px 20px"}}>
        <div className="table-header" style={{padding:'10px 10px 10px 40px'}}>
          <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                  <div className="sub-header-square" />
                  <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px'}}> การนิเทศน์ครั้งที่ 1 </h1>
              </div>
              <div style={{flex:'1',paddingRight:'10px'}}>
                  <input
                  type="text"
                  id="searchInput"
                  className="search-bar"
                  style={{marginLeft:'0',maxWidth:'380px'}}
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
                              <strong>สถานะการนิเทศน์   </strong>
                          </TableSortLabel>
                      </TableCell>
                  </TableRow>
                  </TableHead>

                  {/* ✅ ข้อมูลในตาราง */}
                  <TableBody>
                  {visibleData.map((item, index) => (
                      <TableRow key={index} hover onClick={() => handleFirstSupervisorClick(item.student_id)} sx={{ cursor: "pointer" }}>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.student_id}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.first_name} {item.last_name}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.major} - {item.year}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.company_name}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                          <Chip sx={{ fontFamily: "Noto Sans Thai, sans-serif",fontWeight:'bold'}}           
                          label={getSupervisorStatus(item.is_firstappointment)} color={getStatusColor(item.is_firstappointment)}         
                          />
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
              <Dialog open={open} onClose={handleClose}
                            maxWidth="md" fullWidth
                            sx={{
                              "& .MuiDialog-paper": {
                                borderRadius: "12px",
                                padding: "20px 20px 50px 20px",
                              }
                            }}>
                             {(!schedule) ? (
                              <div>
                                <DialogTitle >
                                <div style={{display:'flex'}}>
                                  <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                    <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                    <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลนิสิต </h1>
                                  </div>
                                  <Button onClick={handleClose} color="primary" sx={{fontFamily: "Noto Sans Thai, sans-serif" }}>
                                    ปิด
                                  </Button>
                                </div>
                                </DialogTitle>
                                <DialogContent >
                                {(!studentInfo) ? (
                                    // แสดง Loading ขณะรอข้อมูล
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                      <CircularProgress />
                                    </div>
                                  ) : (
                                    <div style={{display:'flex',borderRadius:'10px',padding:'20px 0px 20px 30px'}}>
                                      <div style={{flex: '1'}}>
                                        <p style={{color:'#767676'}}>รหัสนิสิต :</p>
                                        <p style={{color:'#767676'}}>ชื่อ-นามสกุล :</p>
                                        <p style={{color:'#767676'}}>สาขา :</p>
                                        <p style={{color:'#767676'}}>เบอร์โทรศัพท์ :</p>
                                      </div>
                                      <div style={{flex: '3'}}>
                                        <p>{studentInfo.student_id}</p>
                                        <p>{studentInfo.first_name} {studentInfo.last_name}</p>
                                        <p>{getMajorName(studentInfo.major)} ชั้นปีที่ {studentInfo.year}</p>
                                        <p> {studentInfo.phone_number}</p>
                                      </div>
                                      <div style={{flex: '3',display:'flex',justifyContent: 'center',alignItems:'center'}}>
                                        <Avatar  src={`http://localhost:5000${studentInfo.profile_img}`} sx={{ width: 150, height: 150, mx: "auto" }} />
                                      </div>
                                    </div>
                                )}
                                </DialogContent>
                                <DialogTitle >
                                  <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                      <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                      <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>รายละเอียดนิเทศครั้งที่ 1 </h1>
                                  </div>
                                </DialogTitle>
                                <DialogContent >  
                              {(!coopInfo) || (!firstSupervisor) ? (
                               (isEmptyInfo === 1) ? (
                                  <div style={{ textAlign: "center", padding: "20px", color: "#767676" }}>
                                    <p>ไม่มีข้อมูล</p>
                                  </div>
                                ) : (
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                    <CircularProgress />
                                  </div>
                                )
                                ) : (
                                  <div style={{display:'flex',borderRadius:'10px',border:'1px solid rgba(0, 0, 13, 0.15)',padding:'20px 30px 20px 30px'}}>
                                    <div style={{flex: '3',display:'flex',borderRight:'1px solid #ddd'}}>
                                      <div style={{flex: '1',display:'flex',flexDirection:'column'}}>
                                        <div style={{flex: '1',display:'flex'}}>
                                          <div style={{flex: '1'}}>
                                              <p style={{color:'#767676'}}>ชื่อบริษัท :</p>
                                              <p style={{color:'#767676'}}>ช่วงเวลาที่ฝึกงาน :</p>
                                              <p style={{color:'#767676'}}>ที่อยู่บริษัท :</p>
                                          </div>
                                          <div style={{flex: '1'}}>
                                              <p>{coopInfo.CompanyNameTH}</p>
                                              <p>{formatCoopDate(coopInfo.Coop_StartDate)} - {formatCoopDate(coopInfo.Coop_EndDate)}</p> 
                                              <p>{coopInfo.CompanyAddress}</p>
                                          </div>
                                        </div>
                                        <div style={{flex: '1',display:'flex'}}>
                                          <div style={{flex:'1'}}>
                                            <p style={{color:'#767676'}}>สถานะการนิเทศน์ :</p>
                                          </div>
                                          <div style={{flex:'1'}}>
                                            <p>{firstSupervisor.status}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{flex: '3',marginLeft:"30px"}}>
                                      <div style={{flex: '1',display: 'flex'}}>
                                        <div style={{flex: '1'}}>
                                          <p style={{color:'#767676'}}>วันเวลาที่นิสิตนัดหมาย :</p>
                                        </div>
                                        <div style={{flex: '1',textAlign:'end'}}>
                                          <p>{formatThaiDate(firstSupervisor.appointment_date)} </p>
                                          <p>เวลา {firstSupervisor.appointment_time}</p>
                                        </div>
                                      </div>
                                      <div style={{flex: '1',display: 'flex'}}>
                                        <div style={{flex: '1'}}>
                                          <p style={{color:'#767676'}}>วันเวลาที่อาจารย์นัดหมาย :</p>
                                        </div>
                                        <div style={{flex: '1',textAlign:'end'}}>
                                          <p>{formatThaiDate(firstSupervisor.advisor_date)} </p>
                                          <p>เวลา {firstSupervisor.advisor_time}</p>
                                        </div>
                                      </div>

                                      <div style={{flex: '1',display: 'flex'}}>
                                        <div style={{flex: '1'}}>
                                          <p style={{color:'#767676'}}>รูปแบบการนิเทศน์ :</p>
                                          <p style={{color:'#767676'}}>รูปแบบการเดินทาง :</p>

                                        </div>
                                        <div style={{flex: '1',textAlign:'end'}}>
                                          <p>{firstSupervisor.appointment_type}</p>
                                          <p>{firstSupervisor.travel_type}</p>
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                              )}
                              {(firstSupervisor) ? (
                               (firstSupervisor.is_accept === 0) ? (
                                <div style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center'}}>
                                  <div >
                                    <Button 
                                      variant="contained" color="success"
                                      onClick={() => (handleFirstAppointmentAccept(firstSupervisor.student_id))} 
                                      sx={{
                                        mt: 3,
                                        width: "190px",
                                        color: "#FFFFFF", 
                                        borderRadius: "16px",
                                        fontSize: "14px",
                                        fontFamily :"Noto Sans Thai , sans-seriff",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                    }}
                                    >
                                      <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>ยืนยันวันเวลาดังกล่าว</div>
                                    </Button>
                                  </div>
                                  <div>
                                    <Button onClick={() => (handleSetScheduleClick(firstSupervisor.student_id))} 
                                    sx={{
                                      ml:5,
                                      mt: 3,
                                      width: "150px",
                                      backgroundColor: "#00A6A2",
                                      color: "#FFFFFF", 
                                      borderRadius: "16px",
                                      fontSize: "14px",
                                      fontFamily :"Noto Sans Thai , sans-seriff",
                                      padding: "10px 20px",
                                      textTransform: "none",
                                      "&:hover": {
                                        backgroundColor: "#006765",
                                      },
                                    }}
                                    >
                                      <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>กำหนดวันเวลาใหม่</div>
                                    </Button>
                                  </div>
                                </div>
                                ) : (
                                  <div>
                                      <div style={{flex:1,textAlign:'end'}}>
                                          <p style={{color:'#767676'}}>กำหนดวันเวลาแล้ว</p>
                                      </div>
                                      <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        <Button 
                                        variant="contained" color="success"
                                        onClick={()=>{handleEvaluationClick(studentInfo.student_id)}}
                                        sx={{
                                          width: "200px",
                                          color: "#FFFFFF", 
                                          borderRadius: "16px",
                                          fontSize: "14px",
                                          fontFamily :"Noto Sans Thai , sans-seriff",
                                          padding: "10px 20px",
                                          textTransform: "none",
                                        }}
                                        >
                                          <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>ประเมินการนิเทศน์ครั้งที่ 1</div>
                                        </Button>
                                      </div>  
                                  </div>                             
                                  
                                )
                                ) : (
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                                  </div>
                               )}
                              </DialogContent>      
                              </div>
                              ):(
                                <div>
                                  <DialogTitle >
                                    <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                        <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                        <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>กำหนดนิเทศครั้งที่ 1 </h1>
                                    </div>
                                  </DialogTitle>
                                  <DialogContent >
                                  {(!firstSupervisor) ? (
                                      // แสดง Loading ขณะรอข้อมูล
                                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                        <CircularProgress />
                                      </div>
                                    ) : (
                                      <form onSubmit={handleFirstAppointmentEdit}>
                                      <Grid container spacing={3}>
                                        {/* ข้อมูลบริษัทและกำหนดการฝึกงาน */}
                                        <Grid item xs={12}  sx={{pb:3, borderBottom :"1px solid rgb(227, 227, 227)"}} >
                                          <Grid container spacing={2} sx={{ mb: 0 ,mt: 2,display:"flex" ,justifyContent:"center" ,alignItems :"center"}} >
                                            <Grid item xs={8}>
                                            <FormControl fullWidth sx={{ mb: 0 }}>       
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.5)"}}>วัน/เดือน/ปี ที่พี่เลี้ยง/บริษัทสะดวก </Typography>
                                                <TextField
                                                  name="appointment_date"
                                                  type="date"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={formatDate(firstSupervisor.appointment_date) || ""}
                                                  onChange={handleFirstAppointmentDataChange}
                                                  InputLabelProps={{ shrink: true }}
                                                  disabled
                              
                                                  required
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={2}>
                                            <FormControl fullWidth sx={{ mb: 0 }}>
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.5)"}}>เริ่มต้น</Typography>
                                                <TextField
                                                  name="appointment_time"
                                                  type="time"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={firstSupervisor.appointment_time || ""}
                                                  onChange={handleFirstAppointmentDataChange}
                                                  InputLabelProps={{ shrink: true }}
                                                  disabled
                              
                                                  required
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={10}>
                                            <FormControl fullWidth sx={{ mb: 3 }}>
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.5)"}}>หมายเหตุ</Typography>
                                                <TextField
                                                  name="notes"
                                                  type="text"
                                                  fullWidth
                                                  variant="outlined"
                                                  placeholder="ระบุรายละเอียดเพิ่มเติม หรือข้อมูลต่างๆที่มีการเปลี่ยนแปลง (หากไม่มีไม่จำเป็นต้องระบุ)"
                                                  value={firstSupervisor.notes || ""}
                                                  onChange={handleFirstAppointmentDataChange}
                                                  InputLabelProps={{ shrink: true }}
                                                  disabled
                              
                                                  
                                                />
                                            </FormControl>
                                            </Grid>
                                          </Grid>        
                                        </Grid>
                              
                                        <Grid item xs={12} sx={{pb:3,mt:2,borderBottom :"1px solid rgba(227, 227, 227,0.5)"}}>
                                          <Grid container spacing={2} sx={{ mb: 0 ,mt: 2,display:"flex" ,justifyContent:"center" ,alignItems :"center"}} >
                                            <Grid item xs={8}>
                                            <FormControl fullWidth sx={{ mb: 0}}>       
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>วัน/เดือน/ปี ที่อาจารย์นิเทศน์สะดวก</Typography>
                                                <TextField
                                                  name="advisor_date"
                                                  type="date"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={formatDate(firstSupervisor.advisor_date) || "ยังไม่ระบุ"}
                                                  InputLabelProps={{ shrink: true }}
                                                  onChange={handleFirstAppointmentDataChange}

                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={2}>
                                            <FormControl fullWidth sx={{ mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>เริ่มต้น</Typography>
                                                <TextField
                                                  name="advisor_time"
                                                  type="time"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={firstSupervisor.advisor_time}
                                                  InputLabelProps={{ shrink: true }}
                                                  onChange={handleFirstAppointmentDataChange}

                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={5}>
                                              <FormControl fullWidth>
                                                <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการเดินทาง</Typography>
                                                <Select
                                                  name="travel_type"
                                                  value={firstSupervisor.travel_type}
                                                  onChange={handleFirstAppointmentDataChange}

                                                  sx={{ mb: 3 }}
                                                >
                                                <MenuItem value="personal">ยานพาหนะส่วนตัว</MenuItem>
                                                <MenuItem value="university">ยานพาหนะที่มหาลัยจัดเตรียม</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                            <Grid item xs={5} sx={{}}>
                                              <FormControl fullWidth>
                                                <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการนิเทศน์</Typography>
                                                <Select
                                                  name="appointment_type"
                                                  value={firstSupervisor.appointment_type}
                                                  onChange={handleFirstAppointmentDataChange}

                                                  sx={{ mb: 3 }}
                                                >
                                                <MenuItem value="Onsite">onsite (ไปยังสถานที่จริง)</MenuItem>
                                                <MenuItem value="Online">online ()</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>                           
                                    </form>
                                  )}
                                  </DialogContent>
                                  <form onSubmit={handleFirstAppointmentEdit}>
                                    <div style={{flex:1,textAlign:'end'}}>
                                        {/* แสดงปุ่มบันทึกและยกเลิกเมื่ออยู่ในโหมดแก้ไข */}
                                        <Button type="submit" variant="contained" color="success" 
                                        sx={{
                                            mt: 2,
                                            mr: 2 ,
                                            width: "130px",
                                            color: "#FFFFFF", 
                                            borderRadius: "16px",
                                            fontSize: "14px",
                                            fontFamily :"Noto Sans Thai , sans-seriff",
                                            padding: "10px 20px",
                                            textTransform: "none",
                                            }}>
                                            บันทึกข้อมูล
                                        </Button>
                                        <Button type="button" variant="outlined" color="secondary" onClick={() => (setSchedule(false))}
                                            sx={{
                                                mt: 2,
                                                mr: 2 ,
                                                width: "100px",
                                                borderRadius: "16px",
                                                fontSize: "14px",
                                                fontFamily :"Noto Sans Thai , sans-seriff",
                                                padding: "10px 20px",
                                                textTransform: "none",
                                                }}
                                            >
                                            ยกเลิก
                                        </Button>
                                  </div>
                                  </form>
                                </div>
                              )}                                                
                </Dialog>
          </TableContainer>
        </div>
      </div>
    );
}

else if(currentstate == 'second_supervisor'){
  return (
      <div className="user-table-container"  style={{  padding: "20px 20px 20px 20px"}}>
        <div className="table-header" style={{padding:'10px 10px 10px 40px'}}>
          <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                  <div className="sub-header-square" />
                  <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px'}}>การนิเทศน์ครั้งที่ 2 </h1>
              </div>
              <div style={{flex:'1',paddingRight:'10px'}}>
                  <input
                  type="text"
                  id="searchInput"
                  className="search-bar"
                  style={{marginLeft:'0',maxWidth:'380px'}}
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
                              <strong>สถานะการนิเทศน์   </strong>
                          </TableSortLabel>
                      </TableCell>
                  </TableRow>
                  </TableHead>

                  {/* ✅ ข้อมูลในตาราง */}
                  <TableBody>
                  {visibleData.map((item, index) => (
                      <TableRow key={index} hover onClick={() => handleSecondSupervisorClick(item.student_id)} sx={{ cursor: "pointer" }}>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.student_id}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.first_name} {item.last_name}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.major} - {item.year}</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>{item.company_name }</TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
                          <Chip sx={{ fontFamily: "Noto Sans Thai, sans-serif",fontWeight:'bold'}} label={getSupervisorStatus(item.is_secondappointment)} color={getStatusColor(item.is_secondappointment)} />
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
              <Dialog open={open} onClose={handleClose}
                            maxWidth="md" fullWidth
                            sx={{
                              "& .MuiDialog-paper": {
                                borderRadius: "12px",
                                padding: "20px 20px 50px 20px",
                              }
                            }}>
                             {(!schedule) ? (
                              <div>
                                <DialogTitle >
                                <div style={{display:'flex'}}>
                                  <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                    <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                    <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลนิสิต </h1>
                                  </div>
                                  <Button onClick={handleClose} color="primary" sx={{fontFamily: "Noto Sans Thai, sans-serif" }}>
                                    ปิด
                                  </Button>
                                </div>
                                </DialogTitle>
                                <DialogContent >
                                {(!studentInfo) ? (
                                    // แสดง Loading ขณะรอข้อมูล
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                      <CircularProgress />
                                    </div>
                                  ) : (
                                    <div style={{display:'flex',borderRadius:'10px',padding:'20px 0px 20px 30px'}}>
                                      <div style={{flex: '1'}}>
                                        <p style={{color:'#767676'}}>รหัสนิสิต :</p>
                                        <p style={{color:'#767676'}}>ชื่อ-นามสกุล :</p>
                                        <p style={{color:'#767676'}}>สาขา :</p>
                                        <p style={{color:'#767676'}}>เบอร์โทรศัพท์ :</p>
                                      </div>
                                      <div style={{flex: '3'}}>
                                        <p>{studentInfo.student_id}</p>
                                        <p>{studentInfo.first_name} {studentInfo.last_name}</p>
                                        <p>{getMajorName(studentInfo.major)} ชั้นปีที่ {studentInfo.year}</p>
                                        <p> {studentInfo.phone_number}</p>
                                      </div>
                                      <div style={{flex: '3',display:'flex',justifyContent: 'center',alignItems:'center'}}>
                                        <Avatar  src={`http://localhost:5000${studentInfo.profile_img}`} sx={{ width: 150, height: 150, mx: "auto" }} />
                                      </div>
                                    </div>
                                )}
                                </DialogContent>
                                <DialogTitle >
                                  <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                      <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                      <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>รายละเอียดนิเทศครั้งที่ 2 </h1>
                                  </div>
                                </DialogTitle>
                                <DialogContent >  
                              {(!coopInfo) || (!secondSupervisor) ? (
                               (isEmptyInfo === 1) ? (
                                  <div style={{ textAlign: "center", padding: "20px", color: "#767676" }}>
                                    <p>ไม่มีข้อมูล</p>
                                  </div>
                                ) : (
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                    <CircularProgress />
                                  </div>
                                )
                                ) : (
                                  <div style={{display:'flex',borderRadius:'10px',border:'1px solid rgba(0, 0, 13, 0.15)',padding:'20px 30px 20px 30px'}}>
                                    <div style={{flex: '3',display:'flex',borderRight:'1px solid #ddd'}}>
                                      <div style={{flex: '1',display:'flex',flexDirection:'column'}}>
                                        <div style={{flex: '1',display:'flex'}}>
                                          <div style={{flex: '1'}}>
                                              <p style={{color:'#767676'}}>ชื่อบริษัท :</p>
                                              <p style={{color:'#767676'}}>ช่วงเวลาที่ฝึกงาน :</p>
                                              <p style={{color:'#767676'}}>ที่อยู่บริษัท :</p>
                                          </div>
                                          <div style={{flex: '1'}}>
                                              <p>{coopInfo.CompanyNameTH}</p>
                                              <p>{formatCoopDate(coopInfo.Coop_StartDate)} - {formatCoopDate(coopInfo.Coop_EndDate)}</p> 
                                              <p>{coopInfo.CompanyAddress}</p>
                                          </div>
                                        </div>
                                        <div style={{flex: '1',display:'flex'}}>
                                          <div style={{flex:'1'}}>
                                            <p style={{color:'#767676'}}>สถานะการนิเทศน์ :</p>
                                          </div>
                                          <div style={{flex:'1'}}>
                                            <p>{secondSupervisor.status}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{flex: '3',marginLeft:"30px"}}>
                                      <div style={{flex: '1',display: 'flex'}}>
                                        <div style={{flex: '1'}}>
                                          <p style={{color:'#767676'}}>วันเวลาที่นิสิตนัดหมาย :</p>
                                        </div>
                                        <div style={{flex: '1',textAlign:'end'}}>
                                          <p>{formatThaiDate(secondSupervisor.appointment_date)} </p>
                                          <p>เวลา {secondSupervisor.appointment_time}</p>
                                        </div>
                                      </div>
                                      <div style={{flex: '1',display: 'flex'}}>
                                        <div style={{flex: '1'}}>
                                          <p style={{color:'#767676'}}>วันเวลาที่อาจารย์นัดหมาย :</p>
                                        </div>
                                        <div style={{flex: '1',textAlign:'end'}}>
                                          <p>{formatThaiDate(secondSupervisor.advisor_date)} </p>
                                          <p>เวลา {secondSupervisor.advisor_time}</p>
                                        </div>
                                      </div>

                                      <div style={{flex: '1',display: 'flex'}}>
                                        <div style={{flex: '1'}}>
                                          <p style={{color:'#767676'}}>รูปแบบการนิเทศน์ :</p>
                                          <p style={{color:'#767676'}}>รูปแบบการเดินทาง :</p>

                                        </div>
                                        <div style={{flex: '1',textAlign:'end'}}>
                                          <p>{secondSupervisor.appointment_type}</p>
                                          <p>{secondSupervisor.travel_type}</p>
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                              )}
                              {(secondSupervisor) ? (
                               (secondSupervisor.is_accept === 0) ? (
                                <div style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center'}}>
                                  <div >
                                    <Button 
                                      variant="contained" color="success"
                                      onClick={() => (handleSecondAppointmentAccept(secondSupervisor.student_id))} 
                                      sx={{
                                        mt: 3,
                                        width: "190px",
                                        color: "#FFFFFF", 
                                        borderRadius: "16px",
                                        fontSize: "14px",
                                        fontFamily :"Noto Sans Thai , sans-seriff",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                    }}
                                    >
                                      <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>ยืนยันวันเวลาดังกล่าว</div>
                                    </Button>
                                  </div>
                                  <div>
                                    <Button onClick={() => (handleSetScheduleClick(secondSupervisor.student_id))} 
                                    sx={{
                                      ml:5,
                                      mt: 3,
                                      width: "150px",
                                      backgroundColor: "#00A6A2",
                                      color: "#FFFFFF", 
                                      borderRadius: "16px",
                                      fontSize: "14px",
                                      fontFamily :"Noto Sans Thai , sans-seriff",
                                      padding: "10px 20px",
                                      textTransform: "none",
                                      "&:hover": {
                                        backgroundColor: "#006765",
                                      },
                                    }}
                                    >
                                      <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>กำหนดวันเวลาใหม่</div>
                                    </Button>
                                  </div>
                                </div>
                                ) : (
                                  <div>
                                      <div style={{flex:1,textAlign:'end'}}>
                                          <p style={{color:'#767676'}}>กำหนดวันเวลาแล้ว</p>
                                      </div>
                                      <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        <Button 
                                        variant="contained" color="success"
                                        sx={{
                                          width: "200px",
                                          color: "#FFFFFF", 
                                          borderRadius: "16px",
                                          fontSize: "14px",
                                          fontFamily :"Noto Sans Thai , sans-seriff",
                                          padding: "10px 20px",
                                          textTransform: "none",
                                        }}
                                        >
                                          <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>ประเมินการนิเทศน์ครั้งที่ 2</div>
                                        </Button>
                                      </div>  
                                  </div>                             
                                  
                                )
                                ) : (
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                                  </div>
                               )}
                              </DialogContent>      
                              </div>
                              ):(
                                <div>
                                  <DialogTitle >
                                    <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                        <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                        <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>กำหนดนิเทศครั้งที่ 2 </h1>
                                    </div>
                                  </DialogTitle>
                                  <DialogContent >
                                  {(!secondSupervisor) ? (
                                      // แสดง Loading ขณะรอข้อมูล
                                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                                        <CircularProgress />
                                      </div>
                                    ) : (
                                      <form onSubmit={handleSecondAppointmentEdit}>
                                      <Grid container spacing={3}>
                                        {/* ข้อมูลบริษัทและกำหนดการฝึกงาน */}
                                        <Grid item xs={12}  sx={{pb:3, borderBottom :"1px solid rgb(227, 227, 227)"}} >
                                          <Grid container spacing={2} sx={{ mb: 0 ,mt: 2,display:"flex" ,justifyContent:"center" ,alignItems :"center"}} >
                                            <Grid item xs={8}>
                                            <FormControl fullWidth sx={{ mb: 0 }}>       
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.5)"}}>วัน/เดือน/ปี ที่พี่เลี้ยง/บริษัทสะดวก </Typography>
                                                <TextField
                                                  name="appointment_date"
                                                  type="date"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={formatDate(secondSupervisor.appointment_date) || ""}
                                                  onChange={handleSecondAppointmentDataChange}
                                                  InputLabelProps={{ shrink: true }}
                                                  disabled
                              
                                                  required
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={2}>
                                            <FormControl fullWidth sx={{ mb: 0 }}>
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.5)"}}>เริ่มต้น</Typography>
                                                <TextField
                                                  name="appointment_time"
                                                  type="time"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={secondSupervisor.appointment_time || ""}
                                                  onChange={handleSecondAppointmentDataChange}
                                                  InputLabelProps={{ shrink: true }}
                                                  disabled
                              
                                                  required
                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={10}>
                                            <FormControl fullWidth sx={{ mb: 3 }}>
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.5)"}}>หมายเหตุ</Typography>
                                                <TextField
                                                  name="notes"
                                                  type="text"
                                                  fullWidth
                                                  variant="outlined"
                                                  placeholder="ระบุรายละเอียดเพิ่มเติม หรือข้อมูลต่างๆที่มีการเปลี่ยนแปลง (หากไม่มีไม่จำเป็นต้องระบุ)"
                                                  value={secondSupervisor.notes || ""}
                                                  onChange={handleSecondAppointmentDataChange}
                                                  InputLabelProps={{ shrink: true }}
                                                  disabled
                              
                                                  
                                                />
                                            </FormControl>
                                            </Grid>
                                          </Grid>        
                                        </Grid>
                              
                                        <Grid item xs={12} sx={{pb:3,mt:2,borderBottom :"1px solid rgba(227, 227, 227,0.5)"}}>
                                          <Grid container spacing={2} sx={{ mb: 0 ,mt: 2,display:"flex" ,justifyContent:"center" ,alignItems :"center"}} >
                                            <Grid item xs={8}>
                                            <FormControl fullWidth sx={{ mb: 0}}>       
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>วัน/เดือน/ปี ที่อาจารย์นิเทศน์สะดวก</Typography>
                                                <TextField
                                                  name="advisor_date"
                                                  type="date"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={formatDate(secondSupervisor.advisor_date) || "ยังไม่ระบุ"}
                                                  InputLabelProps={{ shrink: true }}
                                                  onChange={handleSecondAppointmentDataChange}

                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={2}>
                                            <FormControl fullWidth sx={{ mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>เริ่มต้น</Typography>
                                                <TextField
                                                  name="advisor_time"
                                                  type="time"
                                                  fullWidth
                                                  variant="outlined"
                                                  value={secondSupervisor.advisor_time}
                                                  InputLabelProps={{ shrink: true }}
                                                  onChange={handleSecondAppointmentDataChange}

                                                />
                                            </FormControl>
                                            </Grid>
                                            <Grid item xs={5}>
                                              <FormControl fullWidth>
                                                <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการเดินทาง</Typography>
                                                <Select
                                                  name="travel_type"
                                                  value={secondSupervisor.travel_type}
                                                  onChange={handleSecondAppointmentDataChange}

                                                  sx={{ mb: 3 }}
                                                >
                                                <MenuItem value="personal">ยานพาหนะส่วนตัว</MenuItem>
                                                <MenuItem value="university">ยานพาหนะที่มหาลัยจัดเตรียม</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                            <Grid item xs={5} sx={{}}>
                                              <FormControl fullWidth>
                                                <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการนิเทศน์</Typography>
                                                <Select
                                                  name="appointment_type"
                                                  value={secondSupervisor.appointment_type}
                                                  onChange={handleSecondAppointmentDataChange}

                                                  sx={{ mb: 3 }}
                                                >
                                                <MenuItem value="Onsite">onsite (ไปยังสถานที่จริง)</MenuItem>
                                                <MenuItem value="Online">online ()</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>                           
                                    </form>
                                  )}
                                  </DialogContent>
                                  <form onSubmit={handleSecondAppointmentEdit}>
                                    <div style={{flex:1,textAlign:'end'}}>
                                        {/* แสดงปุ่มบันทึกและยกเลิกเมื่ออยู่ในโหมดแก้ไข */}
                                        <Button type="submit" variant="contained" color="success" 
                                        sx={{
                                            mt: 2,
                                            mr: 2 ,
                                            width: "130px",
                                            color: "#FFFFFF", 
                                            borderRadius: "16px",
                                            fontSize: "14px",
                                            fontFamily :"Noto Sans Thai , sans-seriff",
                                            padding: "10px 20px",
                                            textTransform: "none",
                                            }}>
                                            บันทึกข้อมูล
                                        </Button>
                                        <Button type="button" variant="outlined" color="secondary" onClick={() => (setSchedule(false))}
                                            sx={{
                                                mt: 2,
                                                mr: 2 ,
                                                width: "100px",
                                                borderRadius: "16px",
                                                fontSize: "14px",
                                                fontFamily :"Noto Sans Thai , sans-seriff",
                                                padding: "10px 20px",
                                                textTransform: "none",
                                                }}
                                            >
                                            ยกเลิก
                                        </Button>
                                  </div>
                                  </form>
                                </div>
                              )}                                                
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
                                    <AdminCoopTable currentstate = {currentstate}/>
                                </div>
                        </div>  
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Admin_Cooperative;
