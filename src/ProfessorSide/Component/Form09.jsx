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
                    label={`${item.maxScore} คะแนน`}
                    name={item.name}
                    value={formData[sectionKey][item.name] || ""}
                    onChange={(e) => handleChange(e, sectionKey)}
                    inputProps={{ min: 1, max: item.maxScore }}
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
      <Typography
        sx={{
          position: "absolute",
          top: 10,
          right: 20,
          opacity: 0.5, 
          fontSize: 14,
        }}
      >
        หมายเลขเอกสาร 09
      </Typography>
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
          <Grid item xs={12}>
          <Typography variant="h6">หัวข้อรายงาน / Report title</Typography>
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
      {renderTableSection("หัวข้อประเมิน / Items ", "Items", [
        { label: "กิตติกรรมประกาศ (Acknowledgement)", name: "Acknowledgement" , maxScore: 5 },
        { label: "บทคัดย่อ (Abstract)", name: "Abstract" , maxScore: 5 },
        { label: "สารบัญ  สารบัญรป และสารบัญตาราง (Table of contents)", name: "TableOfContents" , maxScore: 5 },
        { label: "วัตถุประสงค์ (Objectives)", name: "Objectives" , maxScore: 5 },
        { label: "วิธีการศึกษา (Method of Education)", name: "MethodOfEducation" , maxScore: 5 },
        { label: "ผลการศึกษา (Result) ", name: "Result" , maxScore: 20 },
        { label: "วิเคราะห์ผลการศึกษา (Analysis)", name: "Analysis" , maxScore: 10 },
        { label: "สรุปผลการศึกษา (Conclusion)", name: "Conclusion" , maxScore: 10 },
        { label: "ข้อเสนอแนะ (Comment)", name: "Comment" , maxScore: 5 },
        { label: "สำนวนการเขียน และการสื่อความหมาย (Idiom and meaning) ", name: "IdiomAndMeaning" , maxScore: 10 },
        { label: "ความถูกต้องตัวสะกด (Spelling)", name: "Spelling" , maxScore: 5 },
        { label: "รูปแบบ และความสวยงาม ของรูปเลม (Pattern)", name: "Pattern" , maxScore: 5 },
        { label: "เอกสารอ้างอิง (References)", name: "References" , maxScore: 5 },
        { label: "ภาคผนวก (Appendix)", name: "Appendix" , maxScore: 5 },
      ], )}
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

export default Form09;
