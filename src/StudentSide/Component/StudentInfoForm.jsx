import React, { useState } from "react";
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
    import Swal from "sweetalert2";
  
const StudentInfoForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    student_id: "",
    major: "",
    year: "",
    email: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/studentsinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
        });
        setFormData({
          first_name: "",
          last_name: "",
          student_id: "",
          major: "",
          year: "",
          email: "",
          phone_number: "",
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Error updating data',
          text: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        บันทึกข้อมูลส่วนตัว
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* ชื่อ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ชื่อ"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* นามสกุล */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="นามสกุล"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* รหัสนักศึกษา */}
          <Grid item xs={12}>
            <TextField
              label="รหัสนักศึกษา"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* สาขาวิชา */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>สาขาวิชา</InputLabel>
              <Select
                name="major"
                value={formData.major}
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
              label="ชั้นปี"
              name="year"
              value={formData.year}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* อีเมล */}
          <Grid item xs={12}>
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* เบอร์โทรศัพท์ */}
          <Grid item xs={12}>
            <TextField
              label="เบอร์โทรศัพท์"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* ปุ่มบันทึก */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              บันทึกข้อมูล
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default StudentInfoForm;
