import React, { useEffect, useState } from "react";
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
const Form08 = () => {
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

  const [evaluationData, setEvaluationData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get('http://localhost:5000/projectevaluation_sections');
        const sections = sectionsResponse.data;
        const data = await Promise.all(sections.map(async (section) => {
          const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
          return {
            ...section,
            subcategories: criteriaResponse.data
          };
        }));
        setEvaluationData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
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
  
  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOffer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (e) => {
    setOffer(prev => ({ ...prev, jobOffer: e.target.value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(info)
    console.log(scored)
    console.log(offer)
    try {
        // ตรวจสอบว่ามีการประเมินแล้วหรือไม่
        const checkResponse = await axios.get(`http://localhost:5000/checkEvaluation/${info.studentID}/coop_project/last}`);
        if (checkResponse.data.exists) {
          // แสดงข้อความแจ้งเตือนถ้ามีการประเมินแล้ว
          Swal.fire({
            icon: 'warning',
            title: 'แจ้งเตือน',
            text: 'นิสิตดังกล่าวถูกบริษัทประเมินไปแล้ว',
            confirmButtonText: 'ตกลง'
          });
          return; // ออกจากฟังก์ชันไม่ทำการประเมินต่อ
        }
        else {
          const baseResponse = await axios.post('http://localhost:5000/addevaluation', {
            student_id: info.studentID,
            company_id: 1,
            evaluator_name: info.supervisorName,
            evaluate_by: 'company',
            evaluation_version: 'last',
            evaluation_for: 'student',
            evaluation_type: 'coop_project'
          }); 
          if (baseResponse.data?.evaluation_id) {
            const evaluation_id = baseResponse.data.evaluation_id;
          
            // 2. เตรียมข้อมูลคะแนนให้ตรงกับรูปแบบที่ API ต้องการ
            const scoresData = [];
            
            // วนลูปผ่านทุก sections ใน scored state
            Object.entries(scored.sections).forEach(([section_id, criteria]) => {
              Object.entries(criteria).forEach(([criteria_id, score]) => {
                scoresData.push({
                  evaluation_id: evaluation_id,
                  section_id: section_id,
                  criteria_id: criteria_id,
                  score: score,
                  evaluation_type: 'coop_project',
                  comments: null
                });
              });
            });
            console.log(scoresData)
  
            // 3. ส่งข้อมูลคะแนนไปยัง API
            await axios.post('http://localhost:5000/evaluation_scores', {
              scores: scoresData
            });
                      // // ส่งข้อมูลเพิ่มเติม
            // await axios.post('http://localhost:5000/addevaluation_comments', {
            //   evaluation_id: baseResponse.data.evaluation_id,
            //   ...offer
            // });
            // แจ้งเตือนเมื่อประเมินสำเร็จ
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: 'การประเมินนิสิตเสร็จสมบูรณ์',
              confirmButtonText: 'ตกลง'
            });
        }
        
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // แสดงข้อความ error จาก backend
        Swal.fire({
          icon: 'error',
          title: 'ข้อมูลไม่ถูกต้อง',
          text: error.response.data.error,
          confirmButtonText: 'ตกลง'
        });
      } else {
        // Error อื่นๆ
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถตรวจสอบการประเมินได้',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };
  
  const renderTableSectionFromData = (sectionId, maxScore) => {
    const section = evaluationData.find((item) => item.section_id === sectionId);
    if (!section) return null;
  
    return (
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>
          {section.section_name}
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table> 
            <TableBody>
              {section.subcategories.map((sub) => (
                <TableRow key={sub.criteria_id}>
                  <TableCell sx={{fontFamily:"Noto Sans Thai, san-serif",p:4 }}>{sub.criteria_text}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      label={`${maxScore} คะแนน`}
                      value={scored.sections[sectionId]?.[sub.criteria_id] || ""}
                      onChange={(e) => handleScoredChange(sectionId, sub.criteria_id, e.target.value)}
                      inputProps={{ min: 1, max: maxScore }}
                      size="small"
                      sx={{ width: 120,fontFamily:"Noto Sans Thai, san-serif" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3, maxWidth: 1200, margin: 'auto' }}>
      <Typography
        sx={{
          top: 10,
          right: 20,
          opacity: 0.5,
          fontSize: 14,
          fontFamily:"Noto Sans Thai, san-serif"
        }}
      >
        หมายเลขเอกสาร 08
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' , fontFamily:"Noto Sans Thai, san-serif"}}>
        แบบประเมินผลนิสิตสหกิจศึกษา
      </Typography>
      <FormLabel component="legend" sx={{ textAlign: 'center', display: 'block', marginBottom: 3,fontFamily:"Noto Sans Thai, san-serif"}}>
        โครงการสหกิจศึกษา มหาวิทยาลัยเกษตรศาสตร์ 
      </FormLabel>

      <Paper sx={{ padding: 5, marginBottom: 3, boxShadow: 3 ,borderRadius: 2}}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>
          ข้อมูลทั่วไป / Work Term Information
        </Typography>
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
        </Grid>
      </Paper>

      {renderTableSectionFromData(8, 20)}
      {renderTableSectionFromData(9, 10)}
      {renderTableSectionFromData(10, 10)}
      {renderTableSectionFromData(11, 10)}

      <Paper sx={{ padding: 5, marginBottom: 3, boxShadow: 3,borderRadius:"10px" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif"}}>
          ข้อคิดเห็นที่เป็นประโยชน์แก่นิสิต / Please give comments on the student
        </Typography>
        <Grid container spacing={2} sx={{mt:3}}>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium',fontFamily:"Noto Sans Thai, san-serif" }}>
              จุดเด่นของนิสิต / Strength
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              name="studentStrenght"
              value={offer.studentStrenght}
              onChange={handleOfferChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium',fontFamily:"Noto Sans Thai, san-serif" }}>
              ข้อควรปรับปรุงของนิสิต / Improvement
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              name="studentImprovement"
              value={offer.studentImprovement}
              onChange={handleOfferChange}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ padding: 5, marginBottom: 3, boxShadow: 3,borderRadius:"10px" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>
          ข้อเสนอการจ้างงาน / Job Offer
        </Typography>
        <FormLabel component="legend" sx={{ marginBottom: 2 }}>
          หากนิสิตจบการศึกษาแล้ว ท่านจะรับเขาทำงานในสถานประกอบการนี้หรือไม่? (หากมีโอกาสเลือก)
          <br />
          Once this student graduates, will you be interested to offer him/her a job?
        </FormLabel>
        <RadioGroup
          name="jobOffer"
          value={offer.jobOffer}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="yes" control={<Radio />} label="รับ / Yes" />
          <FormControlLabel value="not_sure" control={<Radio />} label="ไม่แน่ใจ / Not sure" />
          <FormControlLabel value="no" control={<Radio />} label="ไม่รับ / No" />
        </RadioGroup>
      </Paper>

      <Paper sx={{ padding: 5, marginBottom: 3, boxShadow: 3 ,borderRadius:"10px"}}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>
          ข้อคิดเห็นเพิ่มเติม / Other comments
        </Typography>
        <TextField
        sx={{mt:2}}
          label="ข้อคิดเห็นเพิ่มเติม"
          fullWidth
          multiline
          rows={4}
          name="additionalComments"
          value={offer.additionalComments}
          onChange={handleOfferChange}
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

export default Form08;