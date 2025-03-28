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
} from "@mui/material";

const Form09 = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    department: "",
    faculty: "",
    companyName: "",
    supervisorName: "",
    supervisorPosition: "",
    supervisorDepartment: "",
    ReportTitleTH: "",
    ReportTitleENG: "",
    Items: {
      Acknowledgement: "",
      Abstract: "",
      TableOfContents: "",
      Objectives: "",
      MethodOfEducation: "",
      Result: "",
      Analysis: "",
      Conclusion: "",
      Comment: "",
      IdiomAndMeaning: "",
      Spelling: "",
      Pattern: "",
      References: "",
      Appendix: "",
    },
    additionalComments: "",
  });
  
  const [evaluationItems, setEvaluationItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (section) {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [name]: value,
          },
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    const fetchEvaluationCriteria = async () => {
      try {
        const sectionsResponse = await axios.get('http://localhost:5000/reportevaluation_sections');
        const items = await Promise.all(
          sectionsResponse.data.map(async (section) => {
            const criteriaResponse = await axios.get(
              `http://localhost:5000/criteria/${section.section_id}`
            );
            console.log(criteriaResponse)
            return criteriaResponse.data.map(criteria => ({
              id: criteria.criteria_id,
              name: criteria.criteria_text, // หรือ field ที่เก็บชื่อหัวข้อใน DB
              label: criteria.criteria_text, // ตัวอย่างรูปแบบ
              maxScore: 5
            }));
          })
        );

        // 3. แปลงโครงสร้างข้อมูล
        const flattenedItems = items.flat();
        setEvaluationItems(flattenedItems);
        
        // 4. เตรียมโครงสร้างสำหรับเก็บคะแนน
        const initialItems = flattenedItems.reduce((acc, item) => {
          acc[item.name] = "";
          return acc;
        }, {});
        
        setFormData(prev => ({
          ...prev,
          Items: initialItems
        }));

      } catch (error) {
        console.error("Failed to fetch evaluation items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationCriteria();
  }, []);

  const renderTableSection = (title, sectionKey, items) => (
    <>
      <Typography variant="h6" mt={3} gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 3}}>
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{fontFamily:"Noto Sans Thai, san-serif",p:4 }}>{item.label}</TableCell>
                <TableCell align="right" >
                  <TextField
                    type="number"
                    label={`${item.maxScore} คะแนน`}
                    name={item.name}
                    value={formData[sectionKey][item.name] || ""}
                    onChange={(e) => handleChange(e, sectionKey)}
                    inputProps={{ 
                      min: 0, 
                      max: item.maxScore,
                      step: 0.5 // อนุญาตให้ใส่ทศนิยมได้
                    }}
                    size="small"
                    sx={{fontWeight: 'medium',fontFamily:"Noto Sans Thai, san-serif", width: 120 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
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
              value={formData.studentName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="รหัสประจำตัว"
              fullWidth
              margin="normal"
              name="studentID"
              value={formData.studentID}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="คณะ"
              fullWidth
              margin="normal"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="สาขาวิชา"
              fullWidth
              margin="normal"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อสถานประกอบการ"
              fullWidth
              margin="normal"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ชื่อ-นามสกุลผู้ประเมิน"
              fullWidth
              margin="normal"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="ตำแหน่งผู้ประเมิน"
              fullWidth
              margin="normal"
              name="supervisorPosition"
              value={formData.supervisorPosition}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="แผนก"
              fullWidth
              margin="normal"
              name="supervisorDepartment"
              value={formData.supervisorDepartment}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
          <Typography variant="h6" sx={{mt:2,fontWeight: 'bold', color: 'primary.main',fontFamily:"Noto Sans Thai, san-serif" }}>หัวข้อรายงาน / Report title</Typography>
            <TextField
              label="ภาษาไทย / Thai"
              fullWidth
              margin="normal"
              name="ReportTitleTH"
              value={formData.ReportTitleTH}
              onChange={handleChange}
            />
            <TextField
              label="ภาษาอังฤษ / English"
              fullWidth
              margin="normal"
              name="ReportTitleENG"
              value={formData.ReportTitleENG}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* หัวข้อประเมิน/Items */}
      {renderTableSection(
        "หัวข้อประเมิน / Items",
        "Items",
        evaluationItems,
        100 // คะแนนรวมสูงสุด
      )}

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
          value={formData.additionalComments}
          onChange={handleChange}
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
