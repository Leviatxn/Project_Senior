import React, { useEffect, useState,useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Fetch_Form08 = ({evaluationID}) => {
  const pdfRef = useRef();
  
  const [info, setInfo] = useState({
      studentName: "",
      studentID: "",
      major: "",
      companyName: "",
      supervisorName: "",
      supervisorPosition: "",
      supervisorDepartment: "",
  });
  const [scored, setScored] = useState({
    sections: {}
  });
  const [offer,setOffer] = useState({    
    studentStrenght: "",
    studentImprovement: "",
    additionalComments: "",
    jobOffer: ""
  })
  
  const [responses, setResponses] = useState({});
  const [evaluationData, setEvaluationData] = useState([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (evaluationID) {
          console.log(evaluationID)
          fetchScores(evaluationID);
        }
      }, [evaluationID, evaluationData]); 

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

  const fetchScores = async (evaluationID) => {
    try {
      const response = await axios.get(`http://localhost:5000/evaluation_scores/${evaluationID}`);
      if (response.data) {
        setIsEvaluated(true);
        const scores = response.data.reduce((acc, score) => {
          const section = evaluationData.find((item) =>
            item.subcategories.some((sub) => sub.criteria_id === score.criteria_id)
          );
          if (section) {
            const subcategory = section.subcategories.find((sub) => sub.criteria_id === score.criteria_id);
            if (subcategory) {
              acc[section.section_name] = acc[section.section_name] || {};
              acc[section.section_name][subcategory.criteria_text] = score.score;
            }
          }
          return acc;
        }, {});
        setResponses(scores);
        const evalResponse = await axios.get(`http://localhost:5000/evaluation_by_id/${evaluationID}`);
        console.log(evalResponse.data)
        if (evalResponse.data) {
            if(evalResponse.data.student_id){
               const studentResponse = await axios.get(`http://localhost:5000/user_info/${evalResponse.data.student_id}`);
               setInfo({
                studentID : evalResponse.data.student_id || '',
                supervisorName: evalResponse.data.evaluator_name|| "",
                studentName: (studentResponse.data.first_name ) +(" ")+ (studentResponse.data.last_name )|| "",
                major: studentResponse.data.major ||""
               });

            }
        }
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลแบบประเมิน
        const sectionsResponse = await axios.get('http://localhost:5000/projectevaluation_sections');
        const sections = sectionsResponse.data;
        
        const data = await Promise.all(
          sections.map(async (section) => {
            const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
            return {
              ...section,
              subcategories: criteriaResponse.data
            };
          })
        );
        
        setEvaluationData(data);
        
        // ดึงข้อมูลคะแนนถ้ามี evaluationID
        if (evaluationID) {
          await fetchScores(evaluationID);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [evaluationID]);
  
  const renderTableSectionFromData = (sectionId) => {
    const section = evaluationData.find((item) => item.section_id === sectionId);
    if (!section) return null;
  
    return (
      <Box sx={{ 
        marginBottom: 3,
        breakInside: 'avoid' // ป้องกันไม่ให้ตารางถูกแบ่งระหว่างหน้า
      }}>
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: 'black',
          fontFamily: "Noto Sans Thai, sans-serif",
          fontSize: '1.2rem'
        }}>
          {section.section_name}
        </Typography>
        <TableContainer component={Paper} sx={{ 
          boxShadow: 3,
          breakInside: 'avoid'
        }}>
          <Table sx={{
            width: '100%',
            tableLayout: 'fixed'
          }}> 
            <TableBody>
              {section.subcategories.map((sub) => (
                <TableRow key={sub.criteria_id} sx={{
                  breakInside: 'avoid'
                }}>
                  <TableCell sx={{
                    fontFamily: "Noto Sans Thai, sans-serif",
                    p: 2,
                    width: '70%',
                    border: '1px solid #ddd'
                  }}>
                    {sub.criteria_text}
                  </TableCell>
                  <TableCell align="right" sx={{
                    px: 2,
                    fontFamily: "Noto Sans Thai, sans-serif",
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}>
                    {responses[section.section_name]?.[sub.criteria_text] || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const handleDownloadPDF = async () => {
    try {
      const input = pdfRef.current;
      if (!input) throw new Error('Element not found');
  
      // เพิ่มสไตล์ชั่วคราวเพื่อให้แน่ใจว่าการแสดงผลถูกต้อง
      const style = document.createElement('style');
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai&display=swap');
        * {
          font-family: 'Noto Sans Thai', sans-serif !important;
          box-sizing: border-box;
        }
        table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        body {
          margin: 0;
          padding: 0;
        }
      `;
      document.head.appendChild(style);
  
      const canvas = await html2canvas(input, {
        scale: 2,
        logging: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
        backgroundColor: null // ทำให้พื้นหลังโปร่งใส
      });
  
      document.head.removeChild(style);
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // คำนวณอัตราส่วนเพื่อให้พอดีกับหน้า PDF
      const ratio = Math.min((pdfWidth - 40) / imgWidth, (pdfHeight - 40) / imgHeight); // ลบ 40mm เพื่อให้มีขอบ
      
      // คำนวณตำแหน่งให้อยู่กึ่งกลาง
      const imgX = (pdfWidth - (imgWidth * ratio)) / 2;
      const imgY = 20; // เริ่มต้นที่ 20mm จากด้านบน
      

      // เพิ่มเนื้อหา
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
       
      pdf.save(`แบบบันทึกการประเมินผลนิสิตสหกิจศึกษา${info.studentID}.pdf`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      Swal.fire('ผิดพลาด', 'ไม่สามารถสร้าง PDF ได้', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="h6" sx={{ fontFamily: "Noto Sans Thai, sans-serif" }}>
          กำลังโหลดข้อมูล...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: 3, 
      maxWidth: 1200, 
      margin: 'auto',
      fontFamily: "Noto Sans Thai, sans-serif"
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px',alignItems:'center' }}>
                                          <a
                                            onClick={handleDownloadPDF}
                                            style={{
                                              cursor:'pointer',
                                              textDecoration:'underline',
                                              fontSize: "14px",
                                              fontFamily: "Noto Sans Thai, sans-serif",
                                              position:'absolute'
                                            }}
                                          >
                                            ดาวน์โหลดเป็น PDF
                                          </a>
                                </div>
      <div ref={pdfRef} >
      <Typography
        sx={{
          top: 10,
          right: 20,
          opacity: 0.5,
          fontSize: 14,
        }}
      >
        หมายเลขเอกสาร 08
      </Typography>
      <div style={{flex:'1',display:'flex',alignItems:'center'}}>
                                      <div className="sub-header-square" />
                                      <h1 className="table-title">แบบบันทึกการประเมินผลนิสิตสหกิจศึกษา</h1>
      </div>
                                       

      {/* ข้อมูลทั่วไป */}
      <Paper sx={{ 
        paddingY:2,
        paddingX:5, 
        marginBottom: 3, 
        boxShadow: 3,
        borderRadius: 2
      }}>
        <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                            <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                            <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลทั่วไป  / Work Term Information </h1>
         </div>
        <Grid container spacing={2} sx={{mt:2,px:5,pt:2,pb:5}}>
          <Grid item xs={6}>
            <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
              ชื่อ-นามสกุลนิสิต:
            </Typography>
            <Typography variant="p" sx={{ mb: 1,ml:5}}>
              {info.studentName || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
          <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
          รหัสประจำตัว:
            </Typography>
            <Typography variant="p" sx={{ mb: 1,ml:5}}>
              {info.studentID || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
          คณะสาขาวิชา:
            </Typography>
            <Typography variant="p" sx={{ mb: 1 ,ml:5}}>
              {getMajorName(info.major) || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
          ชื่อสถานประกอบการ:
            </Typography>
            <Typography variant="p" sx={{ mb: 1,ml:5 }}>
              {info.companyName || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
          ชื่อ-นามสกุลผู้ประเมิน:
            </Typography>
            <Typography variant="p" sx={{ mb: 1,ml:5 }}>
              {info.supervisorName || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
          <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
          ตำแหน่งผู้ประเมิน:
            </Typography>
            <Typography variant="p" sx={{ mb: 1,ml:5 }}>
              {info.supervisorPosition || "-"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
          <Typography variant="p" sx={{mb: 1 ,color:'#767676'}}>
          แผนก:
            </Typography>
            <Typography variant="p" sx={{ mb: 1,ml:5 }}>
              {info.supervisorDepartment || "-"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ส่วนการประเมิน */}
      {renderTableSectionFromData(8)}
      {renderTableSectionFromData(9)}
      {renderTableSectionFromData(10)}
      {renderTableSectionFromData(11)}
      </div>
    </Box>
  );
};

export default Fetch_Form08;