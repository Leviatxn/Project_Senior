import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับออกจากระบบ
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ลบ Token ออกจาก localStorage
        localStorage.removeItem('studentId'); // ลบ Student ID (ถ้ามี)
        navigate("/"); // นำไปหน้า Login
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId || !token) {
                console.error("ไม่พบ studentId หรือ token");
                navigate("/login"); // หากไม่มีข้อมูลเหล่านี้จะนำไปหน้า Login
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/user/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    console.log("ข้อมูลผู้ใช้:", response.data);  // เช็คข้อมูลที่ดึงมา
                    setUser(response.data);
                    setUpdatedUser(response.data);  // กำหนดค่าเริ่มต้นให้กับ updatedUser
                } else {
                    console.error("ไม่พบข้อมูลผู้ใช้");
                    navigate("/login"); // หากไม่มีข้อมูลผู้ใช้จะนำไปหน้า Login
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                navigate("/login"); // หากเกิดข้อผิดพลาดจะนำไปหน้า Login
            }
        };

        fetchUserData();
    }, [navigate]);

    // ฟังก์ชันที่ใช้สำหรับเปลี่ยนแปลงข้อมูลผู้ใช้
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ฟังก์ชันที่ใช้สำหรับบันทึกข้อมูล
    const handleSubmit = (e) => {
        e.preventDefault();
        const studentId = localStorage.getItem("studentId");
        const token = localStorage.getItem("authToken");

        try {
            axios.put(`http://localhost:5000/user/${studentId}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(response => {
                if (response.data) {
                    setUser(response.data);
                    console.log("ข้อมูลถูกบันทึกแล้ว");
                } else {
                    console.error("ไม่สามารถบันทึกข้อมูลได้");
                }
            });
        } catch (err) {
            console.error("Error saving user data:", err);
        }
    };

    // หากยังไม่โหลดข้อมูล หรือมีข้อผิดพลาดจะแสดงข้อความ
    if (!user) return <p>กำลังโหลดข้อมูล...</p>;

    const [firstName, lastName] = user.username ? user.username.split(' ') : ["", ""];

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                ข้อมูลส่วนตัว
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* ชื่อ */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ชื่อ"
                            name="firstName"
                            value={updatedUser.firstName || firstName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>

                    {/* นามสกุล */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="นามสกุล"
                            name="lastName"
                            value={updatedUser.lastName || lastName}
                            onChange={handleInputChange}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    {/* รหัสนักศึกษา */}
                    <Grid item xs={12}>
                        <TextField
                            label="รหัสนักศึกษา"
                            name="studentId"
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
                            value={updatedUser.major || user.department}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>

                    {/* ชั้นปี */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ชั้นปี"
                            name="year"
                            value={updatedUser.year || user.year || 'ไม่ระบุ'}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>

                    {/* อีเมล */}
                    <Grid item xs={12}>
                        <TextField
                            label="E-mail"
                            name="email"
                            type="email"
                            value={updatedUser.email || user.email}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>

                    {/* เบอร์โทรศัพท์ */}
                    <Grid item xs={12}>
                        <TextField
                            label="เบอร์โทรศัพท์"
                            name="phoneNumber"
                            value={updatedUser.phoneNumber || user.phone_num}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    บันทึกข้อมูล
                </Button>
            </form>
        </Box>
    );
};

export default UserProfile;
