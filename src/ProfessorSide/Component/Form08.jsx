import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Form08 = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    department: "",
    companyName: "",
    supervisorName: "",
    supervisorPosition: "",
    workTermInfo: {
      quantityOfWork: "",
      qualityOfWork: "",
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
    additionalComments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleWorkTermChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to backend)
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        แบบประเมินผลนิสิตสหกิจศึกษา
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6">ข้อมูลทั่วไป</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ชื่อ-นามสกุลนิสิต"
              variant="outlined"
              fullWidth
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="รหัสประจำตัว"
              variant="outlined"
              fullWidth
              name="studentID"
              value={formData.studentID}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="สาขาวิชา"
              variant="outlined"
              fullWidth
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ชื่อสถานประกอบการ"
              variant="outlined"
              fullWidth
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ชื่อ-นามสกุลผู้ประเมิน"
              variant="outlined"
              fullWidth
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ตำแหน่งผู้ประเมิน"
              variant="outlined"
              fullWidth
              name="supervisorPosition"
              value={formData.supervisorPosition}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" mt={3}>
          ผลสำเร็จของงาน
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "ปริมาณงาน (Quantity of work)", name: "quantityOfWork" },
            { label: "คุณภาพงาน (Quality of work)", name: "qualityOfWork" },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.name}>
              <FormControl fullWidth>
                <InputLabel>{item.label}</InputLabel>
                <Select
                  label={item.label}
                  name={item.name}
                  value={formData.workTermInfo[item.name]}
                  onChange={(e) => handleWorkTermChange(e, "workTermInfo")}
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <MenuItem key={score} value={score}>
                      {score}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" mt={3}>
          ความรับผิดชอบต่อหน้าที่
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "ความรับผิดชอบและเป็นผู้ไว้วางใจได้", name: "dependability" },
            { label: "ความสนใจอุตสาหะในการทำงาน", name: "interestInWork" },
            { label: "ความสามารถเริ่มต้นทำงานได้ด้วยตนเอง", name: "initiative" },
            { label: "การตอบสนองต่อการสั่งการ", name: "responseToSupervision" },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.name}>
              <FormControl fullWidth>
                <InputLabel>{item.label}</InputLabel>
                <Select
                  label={item.label}
                  name={item.name}
                  value={formData.responsibility[item.name]}
                  onChange={(e) => handleWorkTermChange(e, "responsibility")}
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <MenuItem key={score} value={score}>
                      {score}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" mt={3}>
          ลักษณะส่วนบุคคล
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "บุคลิกภาพและการวางตัว", name: "personality" },
            { label: "มนุษยสัมพันธ์", name: "interpersonalSkills" },
            { label: "ความมีระเบียบวินัย", name: "disciplineAndAdaptability" },
            { label: "คุณธรรมและจริยธรรม", name: "ethicsAndMorality" },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.name}>
              <FormControl fullWidth>
                <InputLabel>{item.label}</InputLabel>
                <Select
                  label={item.label}
                  name={item.name}
                  value={formData.personality[item.name]}
                  onChange={(e) => handleWorkTermChange(e, "personality")}
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <MenuItem key={score} value={score}>
                      {score}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" mt={3}>
          ข้อคิดเห็นเพิ่มเติม
        </Typography>
        <TextField
          label="ข้อคิดเห็นเพิ่มเติม"
          variant="outlined"
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
      </Paper>
    </Box>
  );
};

export default Form08;
