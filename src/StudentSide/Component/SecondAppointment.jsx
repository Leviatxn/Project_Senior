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
  const [appointmentData, setAppointmentData] = useState();
  
  const navigate = useNavigate();
  const [isAppointmentData, setIsAppointmentData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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

  function formatDate(dateString) {
    if (!dateString || dateString === "0000-00-00") return ""; // กรณีเป็น NULL หรือค่าเริ่มต้น

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 1 เพราะ getMonth() เริ่มจาก 0
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const studentId = localStorage.getItem("studentId");
      const token = localStorage.getItem("authToken");
  
      if (!studentId || !token) {
        console.error("ไม่พบ studentId หรือ token");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/second_appointment/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data) {
          setAppointmentData(response.data);
          setIsAppointmentData(true);
          console.log(response.data)
        } else {
          console.error("ไม่พบข้อมูลผู้ใช้");
          console.log("ไม่พบข้อมูลผู้ใช้")

        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
  
    fetchUserData();
  }, []);

  const handleAppointmentInfoChange = (e) => {
    const { name, value } = e.target;
    setAppointmentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAppointmentDataChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
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
          `http://localhost:5000/addAppointment2/${studentId}`,
          {
            appointment_date: appointmentInfo.Date,
            appointment_time: appointmentInfo.Time,
            Notes: appointmentInfo.Notes,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setMessage("เพิ่มการนัดหมายสำเร็จ");
        setAppointmentInfo({ Date: "", Time: "", Notes: "" }); // รีเซ็ตค่า
        if (response.status === 200) {
          Swal.fire({
            position: "top",
            icon: "success",
            title: "ส่งข้อมูลการนิเทศน์แล้ว",
            text: "โปรดรอการตรวจสอบจากอาจารย์",
            timer: 2000
          });
          navigate("/cooperative");
        } else {
          alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
        }      
      } catch (error) {
        setMessage(
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
        );
      }
  
  };

  const handleEdit = async (e) => {

    e.preventDefault();
    setMessage("");
    console.log(appointmentData)
    if (!appointmentData.appointment_date || !appointmentData.appointment_time) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      console.log('NULL')
      return;
    }


      console.log(studentId);

      try {
        const response = await axios.put(
          `http://localhost:5000/updateAppointment2/${studentId}`,
          {
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.appointment_time,
            Notes: appointmentData.Notes,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setMessage("เพิ่มการนัดหมายสำเร็จ");
        setAppointmentInfo({ Date: "", Time: "", Notes: "" }); // รีเซ็ตค่า
        if (response.status === 200) {
          Swal.fire({
            position: "top",
            icon: "success",
            title: "แก้ไขข้อมูลเสร็จสิ้น!",
            text: "โปรดรอการตรวจสอบจากอาจารย์",
            timer: 2000
          });
          navigate("/cooperative");
        } else {
          alert("เกิดข้อผิดพลาดในการส่งข้อมูลเพิ่มเติม");
        }      
      } catch (error) {
        setMessage(
          error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
        );
      }
  
  };

   if (!appointmentData) 
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
                    name="Notes"
                    type="text"
                    fullWidth
                    variant="outlined"
                    placeholder="ระบุรายละเอียดเพิ่มเติม หรือข้อมูลต่างๆที่มีการเปลี่ยนแปลง (หากไม่มีไม่จำเป็นต้องระบุ)"
                    value={appointmentInfo.Notes}
                    onChange={handleAppointmentInfoChange}
                    InputLabelProps={{ shrink: true }}

                    
                  />
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


  return (
    <Box sx={{ p: 4}}>
      <form onSubmit={handleEdit}>
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
                    name="appointment_date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={formatDate(appointmentData.appointment_date) || ""}
                    onChange={handleAppointmentDataChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={!isEditing}

                    required
                  />
              </FormControl>
              </Grid>
              <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 0 }}>
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>เริ่มต้น</Typography>
                  <TextField
                    name="appointment_time"
                    type="time"
                    fullWidth
                    variant="outlined"
                    value={appointmentData.appointment_time || ""}
                    onChange={handleAppointmentDataChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={!isEditing}

                    required
                  />
              </FormControl>
              </Grid>
              <Grid item xs={10}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontFamily:"Noto Sans Thai",color:"rgb(0,0,0,0.7)"}}>หมายเหตุ</Typography>
                  <TextField
                    name="notes"
                    type="text"
                    fullWidth
                    variant="outlined"
                    placeholder="ระบุรายละเอียดเพิ่มเติม หรือข้อมูลต่างๆที่มีการเปลี่ยนแปลง (หากไม่มีไม่จำเป็นต้องระบุ)"
                    value={appointmentData.notes || ""}
                    onChange={handleAppointmentDataChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={!isEditing}

                    
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
                    value={formatDate(appointmentData.advisor_date) || "ยังไม่ระบุ"}
                    InputLabelProps={{ shrink: true }}
                    disabled
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
                    value={appointmentData.advisor_time}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
              </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Typography sx={{fontFamily:"Noto Sans Thai, sans-serif;",color:"rgb(0,0,0,0.7)"}}>รูปแบบการเดินทาง</Typography>
                  <Select
                    name="travelType"
                    value={appointmentData.travel_type}
                    disabled
                    sx={{ mb: 3 }}
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
                    name="appointment_type"
                    value={appointmentData.appointment_type}
                    disabled
                    sx={{ mb: 3 }}
                  >
                  <MenuItem value="Onsite">onsite (ไปยังสถานที่จริง)</MenuItem>
                  <MenuItem value="Online">online ()</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* ปุ่มส่งคำร้อง */}
        <Grid container justifyContent="flex-end">
            <Grid sx={{mt: 2 }}>
            {/* <Button
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
            </Button> */}
                {/* ปุ่มแก้ไข & บันทึก */}
                <Box >
                    {/* แสดงปุ่มแก้ไขเมื่อไม่ได้อยู่ในโหมดแก้ไข */}
                    {!isEditing ? (
                        <div></div>
                    ) : (
                        <>
                            {/* แสดงปุ่มบันทึกและยกเลิกเมื่ออยู่ในโหมดแก้ไข */}
                            <Button type="submit" variant="contained" color="success" 
                            sx={{
                                mt: 2,
                                mr: 2 ,
                                width: "130px",
                                color: "#FFFFFF", 
                                borderRadius: "16px",
                                fontSize: "14px",
                                fontFamily :"Noto Sans Thai , sans-seriff",
                                padding: "10px 20px",
                                textTransform: "none",
                                }}>
                                บันทึกข้อมูล
                            </Button>
                            <Button type="button" variant="outlined" color="secondary" onClick={() => setIsEditing(false)}
                                sx={{
                                    mt: 2,
                                    mr: 2 ,
                                    width: "100px",
                                    borderRadius: "16px",
                                    fontSize: "14px",
                                    fontFamily :"Noto Sans Thai , sans-seriff",
                                    padding: "10px 20px",
                                    textTransform: "none",
                                    }}
                                >
                                ยกเลิก
                            </Button>
                        </>
                    )}
                </Box>         
            {!isEditing && (
                <Box textAlign="center" justifySelf="center" >
                        <Button 
                        type="button" variant="contained" color="primary" onClick={() => setIsEditing(true)} style={{display:'flex'}}
                        sx={{
                            mt: 2,
                            width: "130px",
                            backgroundColor: "#00A6A2",
                            color: "#FFFFFF", 
                            borderRadius: "16px",
                            fontSize: "14px",
                            fontFamily :"Noto Sans Thai , sans-seriff",
                            padding: "10px 20px",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#006765",
                            },
                          }}
                        >
                            <svg height="1em" viewBox="0 0 512 512" style={{fill:'white',marginRight:'10px'}}>
                                <path
                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                                ></path>
                            </svg>
                            แก้ไขข้อมูล
                        </Button>   
                </Box>
            )}
                  
            </Grid>
        </Grid>

      </form>
    </Box>
  );
};

export default SecondAppointment;
;
