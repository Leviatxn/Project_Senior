import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [isEditing, setIsEditing] = useState(false); // สถานะสำหรับโหมดแก้ไข
    const navigate = useNavigate();

    // ฟังก์ชันออกจากระบบ
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("studentId");
        navigate("/");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId || !token) {
                console.error("ไม่พบ studentId หรือ token");
                navigate("/login");
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
                    navigate("/login");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    // ฟังก์ชันเปลี่ยนค่าในฟอร์ม
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    // ฟังก์ชันบันทึกข้อมูล
    const handleSubmit = async (e) => {
        e.preventDefault();
        const studentId = localStorage.getItem("studentId");
        const token = localStorage.getItem("authToken");

        console.log("Submitting...", updatedUser); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่จะส่ง

        try {
            const response = await axios.put(`http://localhost:5000/user_info/${studentId}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ตรวจสอบผลลัพธ์จาก API
            console.log("Response from API:", response.data);

            if (response.data) {
                setUser(response.data);
                setIsEditing(false); // ปิดโหมดแก้ไขหลังจากบันทึกสำเร็จ
                alert("บันทึกข้อมูลเรียบร้อย!");
            } else {
                console.error("ไม่สามารถบันทึกข้อมูลได้");
            }
        } catch (err) {
            console.error("Error saving user data:", err);
        }
    };

    if (!user) return <p>กำลังโหลดข้อมูล...</p>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>ข้อมูลส่วนตัว</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* ชื่อ */}
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12}>
                        <TextField
                            label="รหัสนักศึกษา"
                            name="student_id"
                            value={user.student_id}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    {/* สาขาวิชา */}
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
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
                <Box sx={{ mt: 2 }}>
                    {/* แสดงปุ่มแก้ไขเมื่อไม่ได้อยู่ในโหมดแก้ไข */}
                    {!isEditing ? (
                        <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                            แก้ไขข้อมูล
                        </Button>
                    ) : (
                        <>
                            {/* แสดงปุ่มบันทึกและยกเลิกเมื่ออยู่ในโหมดแก้ไข */}
                            <Button type="submit" variant="contained" color="success" sx={{ mr: 2 }}>
                                บันทึกข้อมูล
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                                ยกเลิก
                            </Button>
                        </>
                    )}
                </Box>
            </form>
        </Box>
    );
};

export default UserProfile;
