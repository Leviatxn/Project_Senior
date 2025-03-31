import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

const MyPetitionTable = () => {
  const [data, setData] = useState([]);
  const [petitionData, setPetitionData] = useState(null);
  const [currentpetition, setCurrentPetition] = useState('');

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  const steps = [
    "ยื่นคำร้องรอการตรวจสอบ",
    "เข้าที่ประชุม",
    "เจ้าหน้าที่รับคำร้อง",
    "คำร้องอนุมัติ",
    "เสร็จสิ้น",
  ];

  const getState = (step,Is_reject)=>{
    console.log(Is_reject)
    if(!Is_reject){
      return steps[step]
    }
    else if (Is_reject){
      return "คำร้องถูกปฏิเสธ"
    }
  }

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

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
          return "#DFE201";
      case 1:
          return "#00A6A2"; // สีเขียว
      case 2:
        return "#0EE178"; // สีเขียว
      case 3:
        return "#44FF00"; // สีแดง
      case 4:
        return "#44FF00"; // สีฟ้า

      default:
        return "default";
    }
  };
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  useEffect(() => {
    fetch(`http://localhost:5000/petitions/${studentId}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        console.log(fetchedData)
        setData(fetchedData);
        setFilteredData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterTable(term);
  };

  const handleRowClick = (petition,applicationID) => {
    setOpen(true);
    handlePetitionClick(petition,applicationID)
    setCurrentPetition(petition)
  };

  const handleClosePopup = () => {
    setOpen(false);
    setPetitionData(null);
    setCurrentPetition('')

  };

  const handlePetitionClick= async(petition,applicationID) => {
    console.log(petition,applicationID)
    if(petition === 'คำร้องขอปฏิบัติงานสหกิจศึกษา'){
      try {
        const response = await axios.get(`http://localhost:5000/coopapplication/${applicationID}`);
        console.log("คำร้องขอปฏิบัติงานสหกิจศึกษา")
        console.log( response.data)
        setPetitionData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
      } catch (err) {
          console.error("Error fetching user data:", err);
      }
    }
    else if(petition === 'คำร้องขอเป็นนิสิตสหกิจศึกษา'){
      try {
        const response = await axios.get(`http://localhost:5000/studentcoopapplication/${applicationID}`);
        console.log("คำร้องขอเป็นนิสิตสหกิจศึกษา")
        console.log( response.data)
        setPetitionData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด

      } catch (err) {
          console.error("Error fetching user data:", err);
      }
    }
  };


  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
    <TableContainer sx={{ maxWidth: "100%", marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif",color:"#999 ",fontWeight: "400"}}>วันที่</TableCell>
            <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif",color:"#999 ",fontWeight: "400"}}>คำร้อง</TableCell>
            <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif",color:"#999 ",fontWeight: "400"}}>ฉบับ</TableCell>
            <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif",color:"#999 ",fontWeight: "400"}}>สถานะ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body1" color="textSecondary">
                  ไม่พบข้อมูลคำร้อง
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(item.Petition_name,item.ApplicationID)}
                sx={{
                  cursor: "pointer",
                  "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif"}}>{formatDate(item.SubmissionDate)}</TableCell>
                <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif"}}>{item.Petition_name}</TableCell>
                <TableCell sx={{fontFamily: "Noto Sans Thai, sans-serif"}}>{item.Petition_version}</TableCell>
                <TableCell 
                  sx={{
                    fontFamily: "Noto Sans Thai, sans-serif",
                    ...(item.Is_reject && {
                      color: 'red',
                      fontWeight: 'bold'
                    })
                  }}
                >{getState(item.Progress_State,item.Is_reject)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>


    <Dialog open={open} onClose={handleClosePopup} 
         maxWidth="md" fullWidth
                              sx={{
                                "& .MuiDialog-paper": {
                                  borderRadius: "12px",
                                  padding: "10px 20px 50px 20px",
                                }
          }}>
      <DialogTitle >
        <div style={{display:'flex'}}>
          <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
          <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
           <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลคำร้อง </h1>
                                        </div>
                                        <Button onClick={handleClosePopup} color="primary" sx={{fontFamily: "Noto Sans Thai, sans-serif" }}>
                                          ปิด
                                        </Button>
        </div>
        </DialogTitle>
        <DialogContent dividers>
          {(!petitionData) ? (
             // แสดง Loading ขณะรอข้อมูล
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
               <CircularProgress />
            </div>
            ) : 
            (currentpetition === 'คำร้องขอปฏิบัติงานสหกิจศึกษา') ? (
              <div>
                <div style={{ textAlign: "center"}}>
                  <p style={{fontSize:'20px',fontWeight:'500'}}> {petitionData.Petition_name} {''}
                    <a style={{fontSize:'20px',color:'#006765',fontWeight:'400'}}>ฉบับที่ {petitionData.Petition_version}</a>
                  </p>
                </div>
                <div style={{borderRadius:'10px',padding:'40px 30px 20px 30px'}}>
                  <div style={{flex: '3',display:'flex'}}>
                              <div style={{flex: '1'}}>
                                <p style={{color:'#767676'}}>ช่วงเวลาที่ฝึกงาน :</p>
                                <p style={{color:'#767676'}}>ชื่อบริษัท (ภาษาไทย) :</p>
                                <p style={{color:'#767676'}}>ชื่อบริษัท (ภาษาอังกฤษ) :</p>
                              </div>
                              <div style={{flex: '3'}}>
                                <p>{formatDate(petitionData.Coop_StartDate)} - {formatDate(petitionData.Coop_EndDate)}</p>
                                <p>{petitionData.CompanyNameTH}</p>
                                <p>{petitionData.CompanyNameEN}</p>
                              </div>                  
                  </div>
                  <div style={{flex: '3',display:'flex'}}>
                              <div style={{flex: '1'}}>
                                <p style={{color:'#767676'}}>ที่ตั้ง :</p>
                                <p style={{color:'#767676'}}>จังหวัดที่ฝึกงาน :</p>
                                <p style={{color:'#767676'}}>เบอร์โทรบริษัท :</p>
                                <p style={{color:'#767676'}}>เบี้ยเลี้ยง :</p>

                              </div>
                              <div style={{flex: '3'}}>
                                <p>{petitionData.CompanyAddress}</p>
                                <p>{petitionData.CompanyProvince}</p>
                                <p>{petitionData.CompanyPhoneNumber}</p>
                                <p>{petitionData.Allowance} บาท / ต่อวัน</p>
                              </div>             
                  </div>
                  <div style={{marginTop:"20px",paddingTop: '20px',borderTop:'1px solid #ddd'}}>
                    <p>ไฟล์ที่เกี่ยวข้อง</p>
                                {petitionData.FilePath ? (
                                  petitionData.FilePath.split(",").map((file, index) => (
                                    <a
                                      key={index}
                                      onClick={() => window.open(`http://localhost:5000/uploads/RelatedFiles/${encodeURIComponent(file.trim())}`)}
                                      download={file.trim()} 
                                      style={{ display: 'flex', alignItems: 'center', marginBottom: '5px',cursor:'pointer',textDecoration:'underline'}}
                                    >
                                      <img src="/pdf.png" alt="pdf" style={{ width: '18px', height: '18px', marginRight: '10px' }} />
                                      เอกสารที่เกี่ยวข้อง {index+1} {petitionData.StudentID}.pdf
                                      {/* {file.trim()} */}
                                    </a>
                                  ))
                                ) : (
                                  <p>ไม่มีไฟล์</p>
                                )}
                              </div>  
                </div>
              </div>
            ) : 
            (currentpetition === 'คำร้องขอเป็นนิสิตสหกิจศึกษา') ? (
              <div>
                <div style={{ textAlign: "center"}}>
                  <p style={{fontSize:'20px',fontWeight:'500'}}> {petitionData.Petition_name} {''}
                    <a style={{fontSize:'20px',color:'#006765',fontWeight:'400'}}>ฉบับที่ {petitionData.Petition_version}</a>
                  </p>
                </div>
                <div style={{borderRadius:'10px',padding:'40px 30px 20px 30px'}}>
                  <div style={{flex: '3',display:'flex'}}>
                              <div style={{flex: '1'}}>
                                <p style={{color:'#767676'}}>ชื่อ-นามสกุล :</p>
                                <p style={{color:'#767676'}}>เลขประจำตัวนิสิต :</p>
                                <p style={{color:'#767676'}}>สาขาวิชาและชั้นปี :</p>
                              </div>
                              <div style={{flex: '3'}}>
                                <p>{petitionData.FullName}</p>
                                <p>{petitionData.StudentID}</p>
                                <p>{getMajorName(petitionData.Major)} ชั้นปี {petitionData.Year}</p>

                              </div>                  
                  </div>
                  <div style={{flex: '3',display:'flex'}}>
                              <div style={{flex: '1'}}>
                                <p style={{color:'#767676'}}>อีเมล์ :</p>
                                <p style={{color:'#767676'}}>เบอร์โทรศัพท์ที่ติดต่อได้ :</p>

                              </div>
                              <div style={{flex: '3'}}>
                                <p>{petitionData.Email}</p>
                                <p>{petitionData.PhoneNumber}</p>
                              </div>             
                  </div>
                  <div style={{paddingTop: '20px'}}>
                    <p>ไฟล์ผลการเรียนเทียบหลักสูตร</p>
                      <div>
                                                {petitionData.TotalCredits_File ? (
                                                        <button 
                                                        onClick={() => window.open(`http://localhost:5000/${petitionData.TotalCredits_File}`)}
                                                        className="download-button"
                                                        style={{display:'flex',justifyContent: 'center',alignItems: 'center'}}  
                                                        >
                                                        <img src="/public/pdf.png" alt="pdf" style={{ width: '18px', height: '18px', cursor: 'pointer',marginRight: '10px'}}/>                                          
                                                        {petitionData.StudentID} grade.pdf
                                                        </button>
                                                    ) : (
                                                        "ไม่มีไฟล์"
                                                    )}
                      </div>
                  </div>  
                </div>
                 <div>
                  <p>สถานะคำร้อง</p>
                </div>
              </div>

            ) : 
            (
            <>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyPetitionTable;
