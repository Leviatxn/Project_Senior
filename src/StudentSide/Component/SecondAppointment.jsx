import React, { useState ,useEffect} from "react";
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
import Swal from 'sweetalert2';

const SecondAppointment = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [isUserProfile, setIsUserProfile] = useState(false);
  
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("authToken");

  const [appointmentInfo, setAppointmentInfo] = useState({
    Date:"",
    Time:"",
    Notes:""
  });

  const [advisorInfo, setAdvisorInfo] = useState({
    Date:"",
    Time:"",
    Notes:"",
    appointmentType:"",
    travelType:""

  });

  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const studentId = localStorage.getItem("studentId");
  //     const token = localStorage.getItem("authToken");
  
  //     if (!studentId || !token) {
  //       console.error("ไม่พบ studentId หรือ token");
  //       return;
  //     }
  
  //     try {
  //       const response = await axios.get(`http://localhost:5000/user_info/${studentId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  
  //       if (response.data) {
  //         setUser(response.data); // อัปเดต userS
  //         setIsUserProfile(true);
  //         console.log(response.data)
  //       } else {
  //         console.error("ไม่พบข้อมูลผู้ใช้");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user data:", err);
  //     }
  //   };
  
  //   fetchUserData();
  // }, []);

  const handleAppointmentInfoChange = (e) => {
    const { name, value } = e.target;
    setAppointmentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setMessage("");
    console.log(appointmentInfo)
    if (!appointmentInfo.Date || !appointmentInfo.Time) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      console.log('NULL')
      return;
    }


      console.log(studentId);

      try {
        const response = await axios.post(
          `http://localhost:5000/addAppointment/${studentId}`,
          {
            appointment_date: appointmentInfo.Date,
            appointment_time: appointmentInfo.Time,
            Notes: appointmentInfo.Notes,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setMessage("เพิ่มการนัดหมายสำเร็จ");
        setAppointmentInfo({ Date: "", Time: "", Notes: "" }); // รีเซ็ตค่า
      } catch (error) {
        setMessage(
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
        );
      }
  
  };

  // if (!user) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <Box sx={{ p: 4}}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} justifyContent="center">
          {/* ข้อมูลบริษัทและกำหนดการฝึกงาน */}
          <Grid item xs={12}  sx={{pb:3, borderBottom :"1px solid rgb(227, 227, 227)"}} >
            <Typography variant="h6" gutterBottom sx={{fontFamily:"Noto Sans Thai, sans-serif;",fontWeight:"400"}}>
              นัดหมายเวลานิเทศน์ (บริษัท) *
            </Typography>
            <Grid container spacing={2} sx={{ mb: 0 ,mt: 2}} >
              <Grid item xs={8}>
              <FormControl fullWidth sx={{ mb: 3 }}>       
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>วัน/เดือน/ปี ที่พี่เลี้ยง/บริษัทสะดวก </Typography>
                  <TextField
                    name="Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={appointmentInfo.Date}
                    onChange={handleAppointmentInfoChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
              </FormControl>
              </Grid>
              <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 0 }}>
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>เริ่มต้น</Typography>
                  <TextField
                    name="Time"
                    type="time"
                    fullWidth
                    variant="outlined"
                    value={appointmentInfo.Time}
                    onChange={handleAppointmentInfoChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
              </FormControl>
              </Grid>
              <Grid item xs={10}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>หมายเหตุ</Typography>
                  <TextField
                    name="Note"
                    type="text"
                    fullWidth
                    variant="outlined"
                    placeholder="ระบุรายละเอียดเพิ่มเติม หรือข้อมูลต่างๆที่มีการเปลี่ยนแปลง (หากไม่มีไม่จำเป็นต้องระบุ)"
                    value={appointmentInfo.Note}
                    onChange={handleAppointmentInfoChange}
                    InputLabelProps={{ shrink: true }}
                    
                  />
              </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{pb:3,mt:2,borderBottom :"1px solid rgba(227, 227, 227,0.5)"}}>
            <Typography variant="h6" gutterBottom sx={{fontFamily:"Noto Sans Thai, sans-serif;",fontWeight:"400"}} display={'flex'}>
            นัดหมายเวลานิเทศน์ (อาจารย์) <Typography variant="h6" gutterBottom sx={{fontFamily:"Noto Sans Thai, sans-serif;",fontWeight:"400",color:'grey',ml:2}}>รออาจารย์ยืนยันข้อมูล</Typography>
            </Typography>
            <Grid container spacing={2} sx={{ mb: 0 ,mt: 2}} >
              <Grid item xs={8}>
              <FormControl fullWidth sx={{ mb: 3 }}>       
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>วัน/เดือน/ปี ที่อาจารย์นิเทศน์สะดวก</Typography>
                  <TextField
                    name="Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={advisorInfo.Date}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                  />
              </FormControl>
              </Grid>
              <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>เริ่มต้น</Typography>
                  <TextField
                    name="Time"
                    type="time"
                    fullWidth
                    variant="outlined"
                    value={advisorInfo.Time}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    required
                  />
              </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการเดินทาง</Typography>
                  <Select
                    name="travelType"
                    value={advisorInfo.travelType}
                    disabled={isUserProfile}
                    sx={{ mb: 3 }}
                    required
                  >
                  <MenuItem value="T12">ยานพาหนะส่วนตัว</MenuItem>
                  <MenuItem value="T13">ยานพาหนะที่มหาลัยจัดเตรียม</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={5} sx={{}}>
                <FormControl fullWidth>
                  <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการนิเทศน์</Typography>
                  <Select
                    name="appointmentType"
                    value={advisorInfo.appointmentType}
                    disabled={isUserProfile}
                    sx={{ mb: 3 }}
                    required
                  >
                  <MenuItem value="T12">onsite (ไปยังสถานที่จริง)</MenuItem>
                  <MenuItem value="T13">online ()</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* ปุ่มส่งคำร้อง */}
        <Grid container justifyContent="flex-end">
            <Grid sx={{mt: 2 }}>
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
                ส่งข้อมูลการนิเทศ
            </Button>
            </Grid>
        </Grid>

      </form>
    </Box>
  );
};

export default SecondAppointment;
;
