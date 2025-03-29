import React, { useState,useEffect } from "react";
import axios from "axios";

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
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";

const Form09 = () => {

  const [info, setInfo] = useState({
      studentName: "",
      studentID: "",
      major: "",
      companyName: "",
      supervisorName: "",
      supervisorPosition: "",
      supervisorDepartment: "",
  });

  const [report,setReport] = useState({
    ReportTitleTH: "",
    ReportTitleENG: "",
    additionalComments: "",
  })

    const [scored, setScored] = useState({
      sections: {}
    });
  
  const [evaluationData, setEvaluationData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));
  };

  const handleScoredChange = (sectionId, criteriaId, value) => {
    setScored(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          [criteriaId]: value
        }
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // ตรวจสอบว่ามีการประเมินแล้วหรือไม่
      const checkResponse = await axios.get(
        `http://localhost:5000/checkEvaluation/${info.studentID}/coop_report/last`
      );
      
      if (checkResponse.data.exists) {
        Swal.fire({
          icon: 'warning',
          title: 'แจ้งเตือน',
          text: 'นิสิตดังกล่าวถูกประเมินรายงานไปแล้ว',
          confirmButtonText: 'ตกลง'
        });
        return;
      }
      
      // ส่งข้อมูลประเมินหลัก
      const evaluationResponse = await axios.post('http://localhost:5000/addevaluation', {
        student_id: info.studentID,
        company_id: 1, // ควรดึงจากข้อมูลจริง
        evaluator_name: info.supervisorName,
        evaluate_by: 'professor',
        evaluation_version: 'last',
        evaluation_for: 'student',
        evaluation_type: 'coop_report'
      });
      
      // ส่งข้อมูลรายงาน
      await axios.post('http://localhost:5000/addcoopreport', {
        evaluation_id: evaluationResponse.data.evaluation_id,
        student_id: info.studentID,
        report_title_th: report.ReportTitleTH,
        report_title_eng: report.ReportTitleENG,
        additional_comments: report.additionalComments
      });
      
      // ส่งข้อมูลคะแนน (ถ้ามี)
      if (Object.keys(scored.sections).length > 0) {
        const scoresData = [];
        Object.entries(scored.sections).forEach(([sectionId, criteria]) => {
          Object.entries(criteria).forEach(([criteriaId, score]) => {
            scoresData.push({
              evaluation_id: evaluationResponse.data.evaluation_id,
              section_id: sectionId,
              criteria_id: criteriaId,
              score: score
            });
          });
        });
        
        await axios.post('http://localhost:5000/evaluation_scores', {
          scores: scoresData
        });
      }
      
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'การประเมินรายงานเสร็จสมบูรณ์',
        confirmButtonText: 'ตกลง'
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งแบบประเมินได้',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  useEffect(() => {
    const fetchEvaluationCriteria = async () => {
      try {
        const sectionsResponse = await axios.get('http://localhost:5000/reportevaluation_sections');
        const sections = await Promise.all(
          sectionsResponse.data.map(async (section) => {
            const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
            return {
              ...section,
              criteria: criteriaResponse.data
            };
          })
        );
        
        // ตั้งค่าเริ่มต้นสำหรับ scored
        const initialScores = {};
        sections.forEach(section => {
          initialScores[section.section_id] = {};
          section.criteria.forEach(criteria => {
            initialScores[section.section_id][criteria.criteria_id] = "";
          });
        });
        
        setScored({ sections: initialScores });
        setEvaluationData(sections);
        
      } catch (error) {
        console.error("Failed to fetch evaluation items:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvaluationCriteria();
  }, []);

  const renderTableSection = (section) => (
    <Box key={section.section_id} sx={{ marginBottom: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', fontFamily: "Noto Sans Thai, sans-serif" }}>
        {section.section_name}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {section.criteria.map((criteria) => (
              <TableRow key={criteria.criteria_id}>
                <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", p: 4 }}>
                  {criteria.criteria_text}
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    label="คะแนน"
                    value={scored.sections[section.section_id]?.[criteria.criteria_id] || ""}
                    onChange={(e) => handleScoredChange(section.section_id, criteria.criteria_id, e.target.value)}
                    inputProps={{ 
                      min: 0, 
                      max: 5, // หรือค่าสูงสุดตามที่กำหนด
                      step: 0.5
                    }}
                    size="small"
                    sx={{ width: 120 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );


  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3, maxWidth: 1200, margin: 'auto',mt:2 }}>
      <Typography
        sx={{
          top: 10,
          right: 20,
          opacity: 0.5,
          fontSize: 14,
          fontFamily:"Noto Sans Thai, san-serif"
        }}
      >
        หมายเลขเอกสาร 09
      </Typography>
      <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' , fontFamily:"Noto Sans Thai, san-serif"}}> 
        แบบประเมินผลรายงานนิสิตสหกิจศึกษา
      </Typography>
      <FormLabel component="legend" sx={{ textAlign: 'center', display: 'block', marginBottom: 3,fontFamily:"Noto Sans Thai, san-serif"}}>
        โครงการสหกิจศึกษา มหาวิทยาลัยเกษตรศาสตร์ 
      </FormLabel>
      <Paper sx={{ padding: 5, marginBottom: 3, boxShadow: 3 ,borderRadius: 2}}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>ข้อมูลทั่วไป / Work Term Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="ชื่อ-นามสกุลนิสิต"
              fullWidth
              margin="normal"
              name="studentName"
              value={info.studentName}
              onChange={handleInfoChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="รหัสประจำตัว"
              fullWidth
              margin="normal"
              name="studentID"
              value={info.studentID}
              onChange={handleInfoChange}
            />
          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>คณะสาขาวิชา</InputLabel>
              <Select
                label="คณะ"
                name="major"
                value={info.major}
                onChange={handleInfoChange}
                sx={{
                  textAlign: 'left',
                  '& .MuiSelect-select': {
                    padding: '16.5px 14px'
                  }
                }}
              >
                  <MenuItem value="T12">T12 - วิศวกรรมคอมพิวเตอร์และสารสนเทศศาสตร์</MenuItem>
                  <MenuItem value="T13">T13 - วิศวกรรมเครื่องกลและการออกแบบ</MenuItem>
                  <MenuItem value="T14">T14 - วิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์</MenuItem>
                  <MenuItem value="T17">T17 - วิศวกรรมอุตสาหการและระบบ</MenuItem>
                  <MenuItem value="T20">T20 - วิศวกรรมระบบการผลิตดิจิทัล</MenuItem>
                  <MenuItem value="T23">T23 - วิศวกรรมดิจิทัลและอีเล็กทรอนิกส์อัจฉริยะ</MenuItem>
                  <MenuItem value="T18">T18 - วิศวกรรมเครื่องกลและระบบการผลิต</MenuItem>
                  <MenuItem value="T19">T19 - วิศวกรรมหุ่นยนต์และระบบอัตโนมัติ</MenuItem>
                  <MenuItem value="T22">T22 - วิศวกรรมยานยนต์</MenuItem>
                </Select>
          </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อสถานประกอบการ"
              fullWidth
              margin="normal"
              name="companyName"
              value={info.companyName}
              onChange={handleInfoChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อ-นามสกุลผู้ประเมิน"
              fullWidth
              margin="normal"
              name="supervisorName"
              value={info.supervisorName}
              onChange={handleInfoChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ตำแหน่งผู้ประเมิน"
              fullWidth
              margin="normal"
              name="supervisorPosition"
              value={info.supervisorPosition}
              onChange={handleInfoChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="แผนก"
              fullWidth
              margin="normal"
              name="supervisorDepartment"
              value={info.supervisorDepartment}
              onChange={handleInfoChange}
            />
          </Grid>
          <Grid item xs={12}>
          <Typography variant="h6" sx={{mt:2,fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>หัวข้อรายงาน / Report title</Typography>
            <TextField
              label="ภาษาไทย / Thai"
              fullWidth
              margin="normal"
              name="ReportTitleTH"
              value={report.ReportTitleTH}
              onChange={handleReportChange}
            />
            <TextField
              label="ภาษาอังฤษ / English"
              fullWidth
              margin="normal"
              name="ReportTitleENG"
              value={report.ReportTitleENG}
              onChange={handleReportChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ส่วนประเมินคะแนน */}
      {evaluationData.map(section => renderTableSection(section))}

      <Paper sx={{ padding: 5, marginBottom: 3, boxShadow: 3 ,borderRadius:"10px"}}>
        <Typography variant="h6"  sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>
          ข้อคิดเห็นเพิ่มเติม / Other comments 
        </Typography>
        <TextField
          sx={{mt:3}}
          label="ข้อคิดเห็นเพิ่มเติม"
          fullWidth
          multiline
          rows={4}
          name="additionalComments"
          value={report.additionalComments}
          onChange={handleReportChange}
        />
      </Paper>


      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ padding: '10px 30px', fontSize: 16 }}>
          ส่งข้อมูล
        </Button>
      </Box>
    </Box>
  );
};

export default Form09;
