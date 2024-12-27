import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ลบ Token ออกจาก localStorage
        localStorage.removeItem('studentId'); // ลบ Student ID (ถ้ามี)
        navigate("/"); // นำไปหน้า Login
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            const studentId = localStorage.getItem("studentId");
            const token = localStorage.getItem("authToken");

            if (!studentId) {
                console.error("No student ID found");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/user/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // เผื่อไว้สำหรับ Auth ในอนาคต
                    },
                });

                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Welcome, {user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Department: {user.department}</p>
            <p>Phone Number: {user.phone_num}</p>
            <p>Profile Complete: {user.is_profile_complete ? "Yes" : "No"}</p>
            <p>Role: {user.role}</p>
            <button onClick={handleLogout}/>
        </div>
    );
}

export default Home;
