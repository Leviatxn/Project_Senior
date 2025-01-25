import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid,
} from "@mui/material";

const RequestAForm = () => {
  const [formValues, setFormValues] = useState({
    StudentID: "",
    FullName: "",
    Major: "",
    Year: "",
    Email: "",
    PhoneNumber: "",
    TotalCredits_File: null,
    PetitionName:"คำร้องขอเป็นนิสิตปฏิบัติงานสหกิจศึกษา"
  });
  



  // ฟังก์ชันสำหรับจัดการเปลี่ยนค่าของฟิลด์
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับจัดการการอัปโหลดไฟล์
  const handleFileChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      TotalCredits_File: e.target.files[0], // เก็บไฟล์ใน state
    }));
  };

  // ฟังก์ชันสำหรับส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();


    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      const response = await fetch("http://localhost:5000/coopstudentapplication", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setFormValues({
          StudentID: "",
          FullName: "",
          Major: "",
          Year: "",
          Email: "",
          PhoneNumber: "",
          TotalCredits_File: null,
        });
      } else {
        alert("Failed to submit application.");
      }

      const studentId = localStorage.getItem("studentId");
      console.log(studentId);
      const info_response = await fetch(`http://localhost:5000/current_petition/${studentId}`, {
        method: "POST",
        body: formData,
      });

      if (!info_response.ok) {
        alert("Failed to submit additional data to user_info.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={3}>
          {/* เลขประจําตัวนิสิต */}
          <Grid item xs={12}>
            <TextField
              name="StudentID"
              label="เลขประจําตัวนิสิต"
              fullWidth
              variant="outlined"
              value={formValues.StudentID}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* ชื่อ-นามสกุล */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="FullName"
              label="ชื่อ-นามสกุล"
              fullWidth
              variant="outlined"
              value={formValues.FullName}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* สาขาวิชา */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>สาขาวิชา</InputLabel>
              <Select
                name="Major"
                value={formValues.Major}
                onChange={handleChange}
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
          </Grid>

          {/* ชั้นปี */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="Year"
              label="ชั้นปี"
              fullWidth
              variant="outlined"
              value={formValues.Year}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* อีเมล */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="Email"
              label="E-MAIL"
              type="email"
              fullWidth
              variant="outlined"
              value={formValues.Email}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* เบอร์โทรศัพท์ */}
          <Grid item xs={12}>
            <TextField
              name="PhoneNumber"
              label="เบอร์โทรศัพท์ (ที่สะดวกติดต่อ)"
              type="tel"
              fullWidth
              variant="outlined"
              value={formValues.PhoneNumber}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* แนบไฟล์ PDF */}
          <Grid item xs={12}>
            <Typography variant="body1">
              แนบไฟล์จำนวนหน่วยกิต (PDF เท่านั้น)
            </Typography>
            <TextField
              name="TotalCredits_File"
              type="file"
              fullWidth
              inputProps={{ accept: ".pdf" }} // จำกัดประเภทไฟล์เป็น PDF
              onChange={handleFileChange}
              required
            />
          </Grid>

          {/* ปุ่มส่ง */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              ยืนยันข้อมูล
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RequestAForm;
