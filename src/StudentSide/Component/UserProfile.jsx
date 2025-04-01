import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button, Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [isEditing, setIsEditing] = useState(false); // สถานะสำหรับโหมดแก้ไข
    const [profilePic, setProfilePic] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId || !token) {
                console.error("ไม่พบ studentId หรือ token");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/user_info/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data) {
                    setUser(response.data);
                    setUpdatedUser(response.data);
                } else {
                    console.error("ไม่พบข้อมูลผู้ใช้");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        console.log(`http://localhost:5000${user.profile_img}`);
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            const studentId = localStorage.getItem("studentId");
            formData.append("profile_img", file);
            try {
                const response = await axios.put(
                    `http://localhost:5000/addstudent_profile/${studentId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                setProfilePic(response.data.profile_pic);
                alert("อัปโหลดรูปภาพสำเร็จ!");
            } catch (err) {
                console.error("Error uploading profile picture:", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const studentId = localStorage.getItem("studentId");
        const token = localStorage.getItem("authToken");

        try {
            const response = await axios.put(
                `http://localhost:5000/updatestudentsinfo/${studentId}`,
                updatedUser,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
            setIsEditing(false);
            alert("บันทึกข้อมูลเรียบร้อย!");
        } catch (err) {
            console.error("Error saving user data:", err);
        }
    };

    if (!user) return <p>กำลังโหลดข้อมูล...</p>;

    return (
        <Box sx={{ p: 4 }}>
            <div className="sub-header" style={{margin:'0',paddingLeft:'30px',paddingBottom:'10px',borderBottom:'1px solid #ddd',marginBottom:'50px'}}>
                <div className="sub-header-square" />
                <h1 className="table-title">ข้อมูลส่วนตัว</h1>  
            </div>
            <Box textAlign="center" sx={{ mb: 3 }}>
                <Avatar  src={`http://localhost:5000${updatedUser.profile_img}`} sx={{ width: 200, height: 200, mx: "auto" }} />
                <input
                    accept="image/*"
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    disabled={!isEditing}
                />
                <label htmlFor="upload-button">
                    <IconButton component="span" sx={{ mt: 1 }}>
                        <PhotoCameraIcon />
                    </IconButton>
                </label>
            </Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="center">
                    {/* ชื่อ */}
                    <Grid item xs={10} sm={5}>
                        <TextField
                            label="ชื่อ"
                            name="first_name"
                            value={updatedUser.first_name || ""}
                            onChange={handleInputChange}
                            fullWidth 
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* นามสกุล */}
                    <Grid item xs={10} sm={5}>
                        <TextField
                            label="นามสกุล"
                            name="last_name"
                            value={updatedUser.last_name || ""}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* รหัสนักศึกษา */}
                    <Grid item xs={10}>
                        <TextField
                            label="เลขประจำตัวนิสิต"
                            name="student_id"
                            value={user.student_id}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    {/* สาขาวิชา */}
                    <Grid item xs={10} sm={5}>
                        <TextField
                            label="สาขาวิชา"
                            name="major"
                            value={updatedUser.major || ""}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* ชั้นปี */}
                    <Grid item xs={10} sm={5}>
                        <TextField
                            label="ชั้นปี"
                            name="year"
                            value={updatedUser.year || ""}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* อีเมล */}
                    <Grid item xs={10}>
                        <TextField
                            label="E-mail"
                            name="email"
                            type="email"
                            value={updatedUser.email || ""}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={!isEditing}
                        />
                    </Grid>

                    {/* เบอร์โทรศัพท์ */}
                    <Grid item xs={10}>
                        <TextField
                            label="เบอร์โทรศัพท์"
                            name="phone_number"
                            value={updatedUser.phone_number || ""}
                            onChange={handleInputChange}
                            fullWidth
                            disabled={!isEditing}
                        />
                    </Grid>
                </Grid>

                {/* ปุ่มแก้ไข & บันทึก */}
                <Box sx={{ mt: 5,display:'flex',justifyContent:'center',alignItems: 'center'}}>
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
            </form>
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
        </Box>
    );
};

export default UserProfile;
