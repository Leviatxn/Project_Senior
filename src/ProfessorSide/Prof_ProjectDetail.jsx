import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  Check as CheckIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Download as DownloadIcon
} from "@mui/icons-material";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import Swal from "sweetalert2";

const Prof_ProjectDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ProjectID, ProjectTitle } = location.state || {};

  const [projectDetails, setProjectDetails] = useState({
    Advisor: "",
    Committee1: "",
    Committee2: "",
    ProjectDetails: "",
    SubmissionDate: "",
    FilePath: "",
    student_id: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (ProjectID) {
      fetch(`http://localhost:5000/projectdetails/${ProjectID}`)
        .then((response) => response.json())
        .then((data) => {
          const details = data[0] || data;
          setProjectDetails({
            ...details,
            Advisor: details.Advisor || "",
            Committee1: details.Committee1 || "",
            Committee2: details.Committee2 || ""
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
          setError("ไม่สามารถโหลดข้อมูลโปรเจคได้");
          setLoading(false);
        });
    }
  }, [ProjectID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateProjectStatus = async (status) => {
    try {
      const [statusResponse, advisorResponse] = await Promise.all([
        fetch(`http://localhost:5000/updateProjectStatus/${ProjectID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_state: status }),
        }),
        fetch(`http://localhost:5000/updateProjectAdvisor/${ProjectID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Advisor: projectDetails.Advisor,
            Committee1: projectDetails.Committee1,
            Committee2: projectDetails.Committee2
          })
        })
      ]);

      if (!statusResponse.ok) {
        throw new Error("Update failed statusResponse");
      }
      if(!advisorResponse.ok){
        throw new Error("Update failed advisorResponse");
      }

      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        showConfirmButton: false,
        timer: 1500
      });

      return true;
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
      });
      return false;
    }
  };

  const handleSave = async () => {
    if (selectedStatus === null) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกสถานะโปรเจค",
        text: "กรุณาเลือกสถานะโปรเจคก่อนบันทึก",
      });
      return;
    }

    const success = await updateProjectStatus(selectedStatus);
    if (success) {
      setEditMode(false);
      setTimeout(() => navigate(-1), 1500);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDownload = () => {
    window.open(`http://localhost:5000/${projectDetails.FilePath}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="prof-project">
      <div className="background">
        <Sidebar />
        <Banner />
        <div className="main-container">
          <div className="Side-Space" />
          <div className="home-content-container">
            <div style={{borderRadius:'15px',background:'white'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={3}>
                {/* ส่วนหัว */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      sx={{paddingX:5,paddingY:3}}
                      title={
                        <div>
                          <div className="sub-header-square" />
                          <h1 className="table-title" style={{fontFamily:"Noto Sans Thai, sans-serif"}}>รายละเอียดโครงงาน</h1>
                        </div>
                      }
                      subheader={
                        <Typography variant="p" color="text.secondary">
                          โครงงานของนิสิตรหัส: {projectDetails.student_id}
                        </Typography>
                      }
                      action={
                        <Button
                          variant={editMode ? "outlined" : "contained"}
                          color={editMode ? "error" : "primary"}
                          startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                          onClick={toggleEditMode}
                          sx={{ mr: 2,fontFamily:"Noto Sans Thai, sans-serif" }}
                        >
                          {editMode ? "ยกเลิก" : "แก้ไขข้อมูล"}
                        </Button>
                      }
                    />
                  </Card>
                </Grid>

                {/* ข้อมูลหลัก */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader
                     sx={{paddingX:5,paddingY:3}}
                      title={
                        <Typography variant="h3" component="div" sx={{fontFamily:"Noto Sans Thai, sans-serif",fontWeight:'500'}}>
                          {ProjectTitle || "ไม่ระบุชื่อโครงงาน"}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="body2" color="text.secondary" sx={{mt:1,fontFamily:"Noto Sans Thai, sans-serif"}}>
                          ส่งเมื่อ: {new Date(projectDetails.SubmissionDate).toLocaleDateString('th-TH')}
                        </Typography>
                      }
                    />
                    <Divider />
                    <CardContent   sx={{paddingX:5,paddingY:4}}
                    >
                      <Typography variant="h6" gutterBottom sx={{fontFamily:"Noto Sans Thai, sans-serif"}}>
                        รายละเอียดโครงงาน
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, minHeight: 100, bgcolor: 'background.paper' }}>
                        <Typography>
                          {projectDetails.ProjectDetails || "ไม่มีรายละเอียดโปรเจค"}
                        </Typography>
                      </Paper>
                    </CardContent>
                  </Card>
                </Grid>

                {/* ข้อมูลผู้เกี่ยวข้อง */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader
                      title="ผู้เกี่ยวข้อง"
                      avatar={<PeopleIcon color="primary" />}
                    />
                    <Divider />
                    <CardContent>
                      {/* อาจารย์ที่ปรึกษา */}
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                        อาจารย์ที่ปรึกษา
                      </Typography>
                      {editMode ? (
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>เลือกอาจารย์ที่ปรึกษา</InputLabel>
                          <Select
                            name="Advisor"
                            value={projectDetails.Advisor}
                            onChange={handleInputChange}
                            label="เลือกอาจารย์ที่ปรึกษา"
                          >
                            <MenuItem value="ผศ.ประสิทธิชัย ณรงค์เลิศฤทธิ์">ผศ.ประสิทธิชัย ณรงค์เลิศฤทธิ์</MenuItem>
                            <MenuItem value="อ.จิรวัฒน์ จิตประสูตวิทย์">อ.จิรวัฒน์ จิตประสูตวิทย์</MenuItem>
                            <MenuItem value="ผศ.ดร.กรวิทย์ ออกผล">ผศ.ดร.กรวิทย์ ออกผล</MenuItem>
                            <MenuItem value="ผศ.ดร.นันทา จันทร์พิทักษ์">ผศ.ดร.นันทา จันทร์พิทักษ์</MenuItem>
                            <MenuItem value="รศ.ดร.อนันต์ บรรหารสกุล">รศ.ดร.อนันต์ บรรหารสกุล</MenuItem>
                            <MenuItem value="ผศ.ดร.ประวิทย์ ชุมชู">ผศ.ดร.ประวิทย์ ชุมชู</MenuItem>
                            <MenuItem value="ผศ.จิดาภา ใช้ฮวดเจริญ">ผศ.จิดาภา ใช้ฮวดเจริญ</MenuItem>
                            <MenuItem value="อ.กาญจนา เอี่ยมสอาด">อ.กาญจนา เอี่ยมสอาด</MenuItem>
                            <MenuItem value="อ.ณัฏฐ์ อรุณ">อ.ณัฏฐ์ อรุณ</MenuItem>
                            <MenuItem value="ผศ.ธรรมนุวัฒน์ วาลีประโคน">ผศ.ธรรมนุวัฒน์ วาลีประโคน</MenuItem>
                            <MenuItem value="ดร.อดิศักดิ์ สุภีสุน">ดร.อดิศักดิ์ สุภีสุน</MenuItem>
                            <MenuItem value="ผศ.ดร.ณัฐพล พันนุรัตน์">ผศ.ดร.ณัฐพล พันนุรัตน์</MenuItem>
                            <MenuItem value="ผศ.ดร.กุลวดี สมบูรณ์วิวัฒน์">ผศ.ดร.กุลวดี สมบูรณ์วิวัฒน์</MenuItem>
                            <MenuItem value="ดร.ฐนียา สัตยพานิช">ดร.ฐนียา สัตยพานิช</MenuItem>
                            <MenuItem value="อ.ไพรัช สร้อยทอง">อ.ไพรัช สร้อยทอง</MenuItem>
                            <MenuItem value="ผศ.ดร.มนตรี โพธิโสโนทัย">ผศ.ดร.มนตรี โพธิโสโนทัย</MenuItem>
                            <MenuItem value="อ.ปุณณะ ยศปัญญา">อ.ปุณณะ ยศปัญญา</MenuItem>
                            <MenuItem value="ผศ.ดร.วัชรพัฐ เมตตานันท">ผศ.ดร.วัชรพัฐ เมตตานันท</MenuItem>
                            <MenuItem value="อ.คทาวัชร เสถียรปกิรณกรณ์">อ.คทาวัชร เสถียรปกิรณกรณ์</MenuItem>
                            <MenuItem value="">ไม่ระบุ</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          avatar={<Avatar><PersonIcon /></Avatar>}
                          label={projectDetails.Advisor || "ไม่ระบุ"}
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      )}

                      {/* กรรมการ */}
                      <Typography variant="subtitle1" gutterBottom>
                        กรรมการ
                      </Typography>
                      {editMode ? (
                        <>
                          <Select
                            fullWidth
                            name="Committee1"
                            value={projectDetails.Committee1}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            label="กรรมการคนที่ 1"
                            sx={{ mb: 2 }}
                          >
                            <MenuItem value="ผศ.ประสิทธิชัย ณรงค์เลิศฤทธิ์">ผศ.ประสิทธิชัย ณรงค์เลิศฤทธิ์</MenuItem>
                            <MenuItem value="อ.จิรวัฒน์ จิตประสูตวิทย์">อ.จิรวัฒน์ จิตประสูตวิทย์</MenuItem>
                            <MenuItem value="ผศ.ดร.กรวิทย์ ออกผล">ผศ.ดร.กรวิทย์ ออกผล</MenuItem>
                            <MenuItem value="ผศ.ดร.นันทา จันทร์พิทักษ์">ผศ.ดร.นันทา จันทร์พิทักษ์</MenuItem>
                            <MenuItem value="รศ.ดร.อนันต์ บรรหารสกุล">รศ.ดร.อนันต์ บรรหารสกุล</MenuItem>
                            <MenuItem value="ผศ.ดร.ประวิทย์ ชุมชู">ผศ.ดร.ประวิทย์ ชุมชู</MenuItem>
                            <MenuItem value="ผศ.จิดาภา ใช้ฮวดเจริญ">ผศ.จิดาภา ใช้ฮวดเจริญ</MenuItem>
                            <MenuItem value="อ.กาญจนา เอี่ยมสอาด">อ.กาญจนา เอี่ยมสอาด</MenuItem>
                            <MenuItem value="อ.ณัฏฐ์ อรุณ">อ.ณัฏฐ์ อรุณ</MenuItem>
                            <MenuItem value="ผศ.ธรรมนุวัฒน์ วาลีประโคน">ผศ.ธรรมนุวัฒน์ วาลีประโคน</MenuItem>
                            <MenuItem value="ดร.อดิศักดิ์ สุภีสุน">ดร.อดิศักดิ์ สุภีสุน</MenuItem>
                            <MenuItem value="ผศ.ดร.ณัฐพล พันนุรัตน์">ผศ.ดร.ณัฐพล พันนุรัตน์</MenuItem>
                            <MenuItem value="ผศ.ดร.กุลวดี สมบูรณ์วิวัฒน์">ผศ.ดร.กุลวดี สมบูรณ์วิวัฒน์</MenuItem>
                            <MenuItem value="ดร.ฐนียา สัตยพานิช">ดร.ฐนียา สัตยพานิช</MenuItem>
                            <MenuItem value="อ.ไพรัช สร้อยทอง">อ.ไพรัช สร้อยทอง</MenuItem>
                            <MenuItem value="ผศ.ดร.มนตรี โพธิโสโนทัย">ผศ.ดร.มนตรี โพธิโสโนทัย</MenuItem>
                            <MenuItem value="อ.ปุณณะ ยศปัญญา">อ.ปุณณะ ยศปัญญา</MenuItem>
                            <MenuItem value="ผศ.ดร.วัชรพัฐ เมตตานันท">ผศ.ดร.วัชรพัฐ เมตตานันท</MenuItem>
                            <MenuItem value="อ.คทาวัชร เสถียรปกิรณกรณ์">อ.คทาวัชร เสถียรปกิรณกรณ์</MenuItem>
                            <MenuItem value="">ไม่ระบุ</MenuItem>
                          </Select>
                          <Select
                            fullWidth
                            name="Committee2"
                            value={projectDetails.Committee2}
                            onChange={handleInputChange}
                            variant="outlined"
                            size="small"
                            label="กรรมการคนที่ 2"
                            sx={{ mb: 2 }}
                          >
                            <MenuItem value="ผศ.ประสิทธิชัย ณรงค์เลิศฤทธิ์">ผศ.ประสิทธิชัย ณรงค์เลิศฤทธิ์</MenuItem>
                            <MenuItem value="อ.จิรวัฒน์ จิตประสูตวิทย์">อ.จิรวัฒน์ จิตประสูตวิทย์</MenuItem>
                            <MenuItem value="ผศ.ดร.กรวิทย์ ออกผล">ผศ.ดร.กรวิทย์ ออกผล</MenuItem>
                            <MenuItem value="ผศ.ดร.นันทา จันทร์พิทักษ์">ผศ.ดร.นันทา จันทร์พิทักษ์</MenuItem>
                            <MenuItem value="รศ.ดร.อนันต์ บรรหารสกุล">รศ.ดร.อนันต์ บรรหารสกุล</MenuItem>
                            <MenuItem value="ผศ.ดร.ประวิทย์ ชุมชู">ผศ.ดร.ประวิทย์ ชุมชู</MenuItem>
                            <MenuItem value="ผศ.จิดาภา ใช้ฮวดเจริญ">ผศ.จิดาภา ใช้ฮวดเจริญ</MenuItem>
                            <MenuItem value="อ.กาญจนา เอี่ยมสอาด">อ.กาญจนา เอี่ยมสอาด</MenuItem>
                            <MenuItem value="อ.ณัฏฐ์ อรุณ">อ.ณัฏฐ์ อรุณ</MenuItem>
                            <MenuItem value="ผศ.ธรรมนุวัฒน์ วาลีประโคน">ผศ.ธรรมนุวัฒน์ วาลีประโคน</MenuItem>
                            <MenuItem value="ดร.อดิศักดิ์ สุภีสุน">ดร.อดิศักดิ์ สุภีสุน</MenuItem>
                            <MenuItem value="ผศ.ดร.ณัฐพล พันนุรัตน์">ผศ.ดร.ณัฐพล พันนุรัตน์</MenuItem>
                            <MenuItem value="ผศ.ดร.กุลวดี สมบูรณ์วิวัฒน์">ผศ.ดร.กุลวดี สมบูรณ์วิวัฒน์</MenuItem>
                            <MenuItem value="ดร.ฐนียา สัตยพานิช">ดร.ฐนียา สัตยพานิช</MenuItem>
                            <MenuItem value="อ.ไพรัช สร้อยทอง">อ.ไพรัช สร้อยทอง</MenuItem>
                            <MenuItem value="ผศ.ดร.มนตรี โพธิโสโนทัย">ผศ.ดร.มนตรี โพธิโสโนทัย</MenuItem>
                            <MenuItem value="อ.ปุณณะ ยศปัญญา">อ.ปุณณะ ยศปัญญา</MenuItem>
                            <MenuItem value="ผศ.ดร.วัชรพัฐ เมตตานันท">ผศ.ดร.วัชรพัฐ เมตตานันท</MenuItem>
                            <MenuItem value="อ.คทาวัชร เสถียรปกิรณกรณ์">อ.คทาวัชร เสถียรปกิรณกรณ์</MenuItem>
                            <MenuItem value="">ไม่ระบุ</MenuItem>
                          </Select>
                        </>
                      ) : (
                        <>
                          <Chip
                            avatar={<Avatar><PersonIcon /></Avatar>}
                            label={projectDetails.Committee1 || "ไม่ระบุกรรมการคนที่ 1"}
                            variant="outlined"
                            sx={{ mb: 1, mr: 1 }}
                          />
                          <Chip
                            avatar={<Avatar><PersonIcon /></Avatar>}
                            label={projectDetails.Committee2 || "ไม่ระบุกรรมการคนที่ 2"}
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* ไฟล์และสถานะ */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      title="เอกสารและสถานะ"
                      avatar={<DescriptionIcon color="primary" />}
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        {/* ไฟล์เอกสาร */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            ไฟล์เอกสาร
                          </Typography>
                          {projectDetails.FilePath ? (
                            <Button
                              variant="outlined"
                              startIcon={<DownloadIcon />}
                              onClick={handleDownload}
                              sx={{ textTransform: 'none' }}
                            >
                              ดาวน์โหลดเอกสาร ({projectDetails.student_id}_Project.pdf)
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              ไม่มีไฟล์ที่แนบ
                            </Typography>
                          )}
                        </Grid>

                        {/* สถานะโครงการ */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            สถานะโครงการ
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedStatus === 1}
                                  onChange={() => setSelectedStatus(1)}
                                  color="success"
                                />
                              }
                              label="อนุมัติ"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedStatus === 2}
                                  onChange={() => setSelectedStatus(2)}
                                  color="error"
                                />
                              }
                              label="ไม่อนุมัติ"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* ปุ่มดำเนินการ */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ px: 4 }}
                >
                  ย้อนกลับ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckIcon />}
                  onClick={handleSave}
                  sx={{ px: 4 }}
                  disabled={selectedStatus === null}
                >
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </Box>
            </Box>
            </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prof_ProjectDetail;