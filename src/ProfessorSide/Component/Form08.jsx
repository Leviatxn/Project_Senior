import React, { useState } from "react";
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
    KnowledgeAndAblility : {
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
      jobOffer: e.target.value, // เก็บค่าที่เลือก
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const renderTableSection = (title, sectionKey, items, maxScore) => (
    <>
      <Typography variant="h6" mt={3} gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.label}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    label={`${maxScore} คะแนน`}
                    name={item.name}
                    value={formData[sectionKey][item.name] || ""}
                    onChange={(e) => handleChange(e, sectionKey)}
                    inputProps={{ min: 1, max: maxScore }}
                    size="small"
                    sx={{ width: 100 }}
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
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        แบบประเมินผลนิสิตสหกิจศึกษา
      </Typography>
      <FormLabel component="legend">
        โครงการสหกิจศึกษา มหาวิทยาลัยเกษตรศาสตร์ 
      </FormLabel>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6">ข้อมูลทั่วไป / Work Term Information</Typography>
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

      {/* ผลสำเร็จของงาน (คะแนนเต็ม 20 คะแนน) */}
      {renderTableSection("ผลสำเร็จของงาน / Work Achievement ", "achievement", [
        { label: "ปริมาณงาน (Quantity of work)", name: "quantityOfWork" },
        { label: "คุณภาพงาน (Quality of work)", name: "qualityOfWork" },
      ], 20)}

      {/* ความรู้ความสามารถ (คะแนนเต็ม 10 คะแนน) */}
      {renderTableSection("ความรู้ความสามารถ / Knowledge and Ablility", "KnowledgeAndAblility", [
        { label: "ความรู้ความสามารถทางวิชาการ (Academic ability)", name: "AcademicAbility" },
        { label: "ความสามารถในการเรียนรู้และประยุกต์วิชาการ (Ability to learn and apply knowledge)", name: "AbilityToLearnAndApplyKnowledge" },
        { label: "ความรู้ความชำนาญด้านปฎิบัติการ (Practical ability)", name: "PracticalAbility" },
        { label: "วิจารณญาณและการตัดสินใจ (Judgement  and  dicision  making)", name: "JudgementAndDecisionMaking" },
        { label: "การจัดการและวางแผน (Organization and planning)", name: "OrganizationAndPlanning" },
        { label: "ทักษะการสื่อสาร (Communication skills)", name: "CommunicationSkills" },
        { label: "การพัฒนาด้านภาษาและวัฒนธรรมต่างประเทศ (Foreign language and cultural development) ", name: "ForeignLanguageAndCulturalDevelopment" },
        { label: "ความเหมาะสมต่อตำแหน่งงานที่ได้รับมอบหมาย (Suitability for Job position)", name: "SuitabilityForJobPosition" },
      ], 10)}

      {/* ความรับผิดชอบต่อหน้าที่ (คะแนนเต็ม 10 คะแนน) */}
      {renderTableSection("ความรับผิดชอบต่อหน้าที่ / Responsibility", "responsibility", [
        { label: "ความรับผิดชอบและเป็นผู้ไว้วางใจได้ (Resposibility  and  dependability)", name: "dependability" },
        { label: "ความสนใจอุตสาหะในการทำงาน (Interest in work)", name: "interestInWork" },
        { label: "ความสามารถเริ่มต้นทำงานได้ด้วยตนเอง (Initiative or self starter)", name: "initiative" },
        { label: "การตอบสนองต่อการสั่งการ (Response to supervision)", name: "responseToSupervision" },
      ], 10)}

      {/* ลักษณะส่วนบุคคล (คะแนนเต็ม 10 คะแนน) */}
      {renderTableSection("ลักษณะส่วนบุคคล / Personality", "personality", [
        { label: "บุคลิกภาพและการวางตัว (Personality)", name: "personality" },
        { label: "มนุษยสัมพันธ์ (Interpersonal skills)", name: "interpersonalSkills" },
        { label: "ความมีระเบียบวินัย ปฏิบัติตามวัฒนธรรมขององค์กร (Discipline and adaptability to formal organization)", name: "disciplineAndAdaptability" },
        { label: "คุณธรรมและจริยธรรม (Ethics and morality)", name: "ethicsAndMorality" },
      ], 10)}

      <Typography variant="h6" mt={3}>
        โปรดให้ข้อคิดเห็นที่เป็นประโยชน์แก่นิสิต / Please give comments on the student 
      </Typography>
      <Grid container spacing={2}>
          <Grid item xs={6}>
          <Typography variant="h6" mt={1}>
            จุดเด่นของนิสิต / Strenght
          </Typography>
            <TextField 
              multiline
              rows={4}
              fullWidth
              margin="normal"
              name="studentStrenght"
              value={formData.studentStrenght}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
          <Typography variant="h6" mt={1}>
            ข้อควรปรับปรุงของนิสิต / Improvement
          </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              margin="normal"
              name="studentImprovement"
              value={formData.studentImprovement}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">ข้อเสนอการจ้างงาน / Job Offer</Typography>
          <FormLabel component="legend">
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
      <Typography variant="h6" mt={3}>
        ข้อคิดเห็นเพิ่มเติม / Other comments 
      </Typography>
      <TextField
        label="ข้อคิดเห็นเพิ่มเติม"
        fullWidth
        multiline
        rows={4}
        name="additionalComments"
        value={formData.additionalComments}
        onChange={handleChange}
      />



      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        ส่งข้อมูล
      </Button>
    </Box>
  );
};

export default Form08;
