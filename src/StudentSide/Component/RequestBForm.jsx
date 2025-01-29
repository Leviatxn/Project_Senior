import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  Button,
  Select,
  Grid,
  InputLabel,
  MenuItem,
  Grid2,
} from "@mui/material";
import axios from "axios";
import {useNavigate } from 'react-router-dom';

const RequestBForm = () => {

  const navigate = useNavigate();
  
  const [studentInfo, setStudentInfo] = useState({
    FullName: "",
    StudentID: "",
    Major: "",
    Year: "",
    Email: "",
    PhoneNumber: "",
    PetitionName:"คำร้องขอปฏิบัติงานสหกิจศึกษา"

  });

  const [companyInfo, setCompanyInfo] = useState({
    CompanyNameTH: "",
    CompanyNameEN: "",
    CompanyAddress: "",
    CompanyProvince: "",
    CompanyPhoneNumber: "",
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

  const handleRemoveFile = (index) => {
    setCompanyInfo((prev) => ({
      ...prev,
      relatedFiles: prev.relatedFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (companyInfo.relatedFiles.length === 0) {
      setError("กรุณาอัปโหลดไฟล์ PDF อย่างน้อย 1 ไฟล์");
      return;
    }
  
    // สร้าง FormData สำหรับส่งข้อมูล
    const formData = new FormData();
  
    // เพิ่มข้อมูล studentInfo ลงใน formData
    Object.keys(studentInfo).forEach((key) => {
      formData.append(key, studentInfo[key]);
    });
  
    // เพิ่มข้อมูล companyInfo (ยกเว้นไฟล์)
    Object.keys(companyInfo).forEach((key) => {
      if (key !== "relatedFiles") {
        formData.append(key, companyInfo[key]);
      }
    });
  
    // เพิ่มไฟล์ PDF ลงใน formData
    companyInfo.relatedFiles.forEach((file) => {
      formData.append("relatedFiles", file);
    });
  
    try {
      // ส่งข้อมูลไปยัง Backend
      const response = await axios.post("http://localhost:5000/coopapplicationsubmit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // ตรวจสอบว่า response สำเร็จหรือไม่
      if (response.status === 200) {
        console.log("ส่งคำขอแรกสำเร็จ:", response.data);

        // ส่งคำขอที่สองไปยัง `current_petition`
        const info_response = await axios.post("http://localhost:5000/current_petition",formData,
        {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (info_response.status === 200) {
          console.log("ส่งข้อมูลไปยัง current_petition สำเร็จ:", info_response.data);
          alert("ส่งคำร้องสำเร็จ!");
          navigate("/petition");
        } else {
          console.error("Failed to submit additional data:", info_response.data);
          alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("เกิดข้อผิดพลาดในการส่งคำร้อง");
    }
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
                name="FullName"
                label="ชื่อ-นามสกุล"
                fullWidth
                variant="outlined"
                value={studentInfo.FullName}
                onChange={handleStudentChange}
                sx={{mt:2, mb: 3 }}
                required
                />
                <TextField
                name="StudentID"
                label="เลขประจำตัวนิสิต"
                fullWidth
                variant="outlined"
                value={studentInfo.StudentID}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <FormControl fullWidth>
                  <InputLabel>สาขาวิชา</InputLabel>
                  <Select
                    name="Major"
                    value={studentInfo.Major}
                    onChange={handleStudentChange}
                    sx={{ mb: 3 }}
                    required
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
                <TextField
                name="Year"
                label="ชั้นปี"
                type="number"
                fullWidth
                variant="outlined"
                value={studentInfo.Year}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <TextField
                name="Email"
                label="อีเมล"
                type="email"
                fullWidth
                variant="outlined"
                value={studentInfo.Email}
                onChange={handleStudentChange}
                sx={{ mb: 3 }}
                required
                />
                <TextField
                name="PhoneNumber"
                label="เบอร์โทรศัพท์ (ที่สะดวกติดต่อ)"
                type="tel"
                fullWidth
                variant="outlined"
                value={studentInfo.PhoneNumber}
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
              name="CompanyNameTH"
              label="ชื่อบริษัท (ภาษาไทย)"
              fullWidth
              variant="outlined"
              value={companyInfo.CompanyNameTH}
              onChange={handleCompanyChange}
              sx={{mt:2, mb: 3 }}
              required
            />
            <TextField
              name="CompanyNameEN"
              label="ชื่อบริษัท (ภาษาอังกฤษ)"
              fullWidth
              variant="outlined"
              value={companyInfo.CompanyNameEN}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              name="CompanyAddress"
              label="ที่ตั้ง"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={companyInfo.CompanyAddress}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              name="CompanyProvince"
              label="จังหวัดที่ฝึกงาน"
              fullWidth
              variant="outlined"
              value={companyInfo.CompanyProvince}
              onChange={handleCompanyChange}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              name="CompanyPhoneNumber"
              label="เบอร์โทรบริษัท"
              type="tel"
              fullWidth
              variant="outlined"
              value={companyInfo.CompanyPhoneNumber}
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
