import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  Button,
  Grid,
  InputLabel,
  Grid2,
} from "@mui/material";

const RequestBForm = () => {
  const [studentInfo, setStudentInfo] = useState({
    fullName: "",
    studentId: "",
    major: "",
    year: "",
    email: "",
    phone: "",
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyNameTh: "",
    companyNameEn: "",
    location: "",
    province: "",
    companyPhone: "",
    relatedFiles: [],
  });

  const [error, setError] = useState("");

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // แปลง FileList เป็น Array
    const validFiles = files.filter(
      (file) => file.type === "application/pdf" // ตรวจสอบเฉพาะไฟล์ PDF
    );

    if (validFiles.length + companyInfo.relatedFiles.length > 4) {
      setError("สามารถอัปโหลดไฟล์ได้สูงสุด 4 ไฟล์เท่านั้น");
      return;
    }

    setError(""); // ล้างข้อความแสดงข้อผิดพลาด (ถ้ามี)
    setCompanyInfo((prev) => ({
      ...prev,
      relatedFiles: [...prev.relatedFiles, ...validFiles],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyInfo.relatedFiles.length === 0) {
      setError("กรุณาอัปโหลดไฟล์ PDF อย่างน้อย 1 ไฟล์");
      return;
    }
    console.log("Student Info:", studentInfo);
    console.log("Company Info:", companyInfo);
    alert("Form submitted!");
  };

  const handleRemoveFile = (index) => {
    setCompanyInfo((prev) => ({
      ...prev,
      relatedFiles: prev.relatedFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box sx={{ p: 4}}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* ข้อมูลนิสิต */}
          <Grid item xs={12} sx={{pb:2, borderBottom :"1px solid #E3E3E3"}}>
            <Grid item xs={10}>
                <Typography variant="h6" gutterBottom sx={{fontFamily:"Noto Sans Thai, sans-serif;"}}>
                ข้อมูลนิสิต *
                </Typography>
                <TextField
                name="fullName"
                label="ชื่อ-นามสกุล"
                fullWidth
                variant="outlined"
                value={studentInfo.fullName}
                onChange={handleStudentChange}
                sx={{mt:2, mb: 3 }}
                required
                />
                <TextField
                name="studentId"
                label="เลขประจำตัวนิสิต"
                fullWidth
                variant="outlined"
                value={studentInfo.studentId}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <TextField
                name="major"
                label="สาขาวิชา"
                fullWidth
                variant="outlined"
                value={studentInfo.major}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <TextField
                name="year"
                label="ชั้นปี"
                type="number"
                fullWidth
                variant="outlined"
                value={studentInfo.year}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <TextField
                name="email"
                label="อีเมล"
                type="email"
                fullWidth
                variant="outlined"
                value={studentInfo.email}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <TextField
                name="phone"
                label="เบอร์โทรศัพท์ (ที่สะดวกติดต่อ)"
                type="tel"
                fullWidth
                variant="outlined"
                value={studentInfo.phone}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
            </Grid>

          </Grid>

          {/* ข้อมูลบริษัทและกำหนดการฝึกงาน */}
          <Grid item xs={12} sx={{pb:5, borderBottom :"1px solid #E3E3E3"}}>
            <Typography variant="h6" gutterBottom sx={{fontFamily:"Noto Sans Thai, sans-serif;"}}>
              ข้อมูลบริษัทและกำหนดการฝึกงาน *
            </Typography>
            <TextField
              name="companyNameTh"
              label="ชื่อบริษัท (ภาษาไทย)"
              fullWidth
              variant="outlined"
              value={companyInfo.companyNameTh}
              onChange={handleCompanyChange}
              sx={{mt:2, mb: 3 }}
              required
            />
            <TextField
              name="companyNameEn"
              label="ชื่อบริษัท (ภาษาอังกฤษ)"
              fullWidth
              variant="outlined"
              value={companyInfo.companyNameEn}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              name="location"
              label="ที่ตั้ง"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={companyInfo.location}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              name="province"
              label="จังหวัดที่ฝึกงาน"
              fullWidth
              variant="outlined"
              value={companyInfo.province}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              name="companyPhone"
              label="เบอร์โทรบริษัท"
              type="tel"
              fullWidth
              variant="outlined"
              value={companyInfo.companyPhone}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <FormControl fullWidth>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 1, backgroundColor: "#00A6A2", color: "#FFF",fontFamily:"Noto Sans Thai, sans-serif;",fontWeight:"400"}}
              >
                อัพโหลดเอกสารที่เกี่ยวข้อง (สูงสุด 4 ไฟล์)
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              {/* แสดงชื่อไฟล์ที่อัปโหลด */}
              {companyInfo.relatedFiles.length > 0 && (
                <Box>
                  {companyInfo.relatedFiles.map((file, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Typography variant="body2">{file.name}</Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFile(index)}
                        sx={{ ml: 2 }}
                      >
                        ลบ
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
              {/* ข้อความแสดงข้อผิดพลาด */}
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* ปุ่มส่งคำร้อง */}
        <Grid container justifyContent="flex-end">
            <Box sx={{mt: 5 }}>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    mt: 2,
                    width: "181px",
                    backgroundColor: "#00A6A2",
                    color: "#FFFFFF", 
                    borderRadius: "16px",
                    fontSize: "16px",
                    fontFamily :"Noto Sans Thai , sans-seriff",
                    padding: "10px 20px",
                    textTransform: "none",
                    "&:hover": {
                    backgroundColor: "#006765",
                    },
                }}
            >
                ส่งคำร้อง
            </Button>
            </Box>
        </Grid>

      </form>
    </Box>
  );
};

export default RequestBForm;
;
