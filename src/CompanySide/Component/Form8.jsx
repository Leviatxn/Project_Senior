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
} from "@mui/material";
import axios from "axios";

const Form08 = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    department: "",
    faculty: "",
    companyName: "",
    supervisorName: "",
    supervisorPosition: "",
    supervisorDepartment: "",
    achievement: {
      quantityOfWork: "",
      qualityOfWork: "",
    },
    KnowledgeAndAblility: {
      AcademicAbility: "",
      AbilityToLearnAndApplyKnowledge: "",
      PracticalAbility: "",
      JudgementAndDecisionMaking: "",
      OrganizationAndPlanning: "",
      CommunicationSkills: "",
      ForeignLanguageAndCulturalDevelopment: "",
      SuitabilityForJobPosition: "",
    },
    responsibility: {
      dependability: "",
      interestInWork: "",
      initiative: "",
      responseToSupervision: "",
    },
    personality: {
      personality: "",
      interpersonalSkills: "",
      disciplineAndAdaptability: "",
      ethicsAndMorality: "",
    },
    studentStrenght: "",
    studentImprovement: "",
    additionalComments: "",
    jobOffer: "",
  });

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

    const handleAppoveInfo = async () => {
      try {
        const response = await axios.post('http://localhost:5000/addevaluation', {
          student_id: formData.studentID,
          company_id: 1,
          evaluator_name: formData.supervisorName,
          evaluate_by: 'company',
          evaluation_version: 'last',
          evaluation_for: 'student',
          evaluation_type: 'coop_project'
        });
    
        if (response.data && response.data.evaluation_id) {
          console.log('Data submitted successfully:', response.data);
          alert('บันทึกข้อมูลสำเร็จ!');
          setEvaluationData({ evaluation_id: response.data.evaluation_id }); // บันทึก evaluation_id ลงใน state
        } else {
          console.error('Invalid response from server');
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
  }
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

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      jobOffer: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const renderTableSectionFromData = (sectionId, sectionKey, maxScore) => {
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
                  <TableCell sx={{ fontWeight: 'medium',fontFamily:"Noto Sans Thai, san-serif",p:4 }}>{sub.criteria_text}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      label={`${maxScore} คะแนน`}
                      name={sub.criteria_text}
                      value={formData[sectionKey][sub.criteria_text] || ""}
                      onChange={(e) => handleChange(e, sectionKey)}
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
        </Grid>
      </Paper>

      {renderTableSectionFromData(8, "achievement", 20)}
      {renderTableSectionFromData(9, "KnowledgeAndAblility", 10)}
      {renderTableSectionFromData(10, "responsibility", 10)}
      {renderTableSectionFromData(11, "personality", 10)}

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
              value={formData.studentStrenght}
              onChange={handleChange}
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
              value={formData.studentImprovement}
              onChange={handleChange}
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
          value={formData.jobOffer}
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

export default Form08;