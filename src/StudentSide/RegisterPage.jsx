import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    student_id: '',
    department: '',
    phone_num: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', formData, { withCredentials: true });
      setMessage(res.data.message);
      console.log(response.data.message); // Registration complete!
    } catch (err) {
      setMessage('Registration failed. Please try again.');
      console.error(err.response.data.message); // Error registering user.
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        footer: err.response.data.message,
      });
    } 
  };

  return (
    <div>
      <h2>Complete Your Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={formData.student_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone_num"
          placeholder="Phone Number"
          value={formData.phone_num}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RegisterPage;