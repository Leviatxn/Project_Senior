import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate,useLocation} from "react-router-dom";
import './Student_Register.css';
import Logo from '../MainComponent/Logo';
import Swal from 'sweetalert2';

const Student_RegisterInfo = () => {
    const location = useLocation();
    const { studentID } = location.state || {}; // รับค่าที่ส่งมา
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        student_id: '',
        major: '',
        year: '',
        email:'',
        phone_number:'',
    });
  const [message, setMessage] = useState('');
  const [user, setUser] = useState();

    useEffect(() => {
        console.log(studentID)
        const fetchUserData = async () => {

            try {
                const response = await axios.get(`http://localhost:5000/user/${studentID}`, {});
                if (response.data) {
                    console.log(response.data)

                    setUser(response.data);
                    setFormData({
                        student_id : response.data.student_id,
                        email :  response.data.email,
                        phone_number: response.data.phone_num,
                    });

                } else {
                    console.error("ไม่พบข้อมูลผู้ใช้");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const res = await axios.post('http://localhost:5000/addstudentsinfo', formData, { withCredentials: true });
            setMessage(res.data.message);
            console.log(res.data.message); // Registration complete!
            window.close();
        } 
        catch (err) {
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
    <div className="login-page" style={{justifyContent:'center',alignItems: 'center'}}>
      {/* Section ซ้าย */}
      <div className="student-register-box">
        <div className="login-main_container" style={{display: 'flex',padding:'80px 40px 80px 40px'}}>
            <div style={{flex:'1',borderRight:'1px solid rgba(110, 110, 110, 0.49)',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',padding: '200px 100px 200px 100px'}}>
                <Logo/>
                <p className="student-subtitle" style={{color:'#000'}}>
                    ระบบสหกิจศึกษา
                </p>
                <p className="student-sub-desciption">
                    มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
                </p>
            </div>

            <div style={{flex:'3',display: 'flex',flexDirection:'column',justifyContent:'center',alignItems: 'center',paddingTop:'100px'}}>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <div className="student-register-input-group">
                            <div style={{width: '285px'}}>
                                <label htmlFor="Email" style={{color:'#000'}}> ชื่อ  (ภาษาไทย)*</label>
                            </div>
                            <input
                                style={{width:'285px'}}
                                type="text"
                                name="first_name"
                                placeholder="Input your Name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="student-register-input-group" style={{marginLeft:'15px'}}>
                            <div style={{width: '285px'}}>
                                <label htmlFor="Email" style={{color:'#000'}}> นามสกุล (ภาษาไทย) *</label>
                            </div>
                            <input
                                style={{width:'285px'}}
                                type="text"
                                name="last_name"
                                placeholder="Input your Surname"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'flex-start'}}>
                        <div className="student-register-input-group">
                            <div style={{ width: "475px" }}>
                                <label htmlFor="major" style={{ color: "#000" }}>สาขาวิชา*</label>
                            </div>
                            <select
                                style={{ width: "500px"}}
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                            >
                                <option value="">-- เลือกสาขา --</option>
                                <option value="T12">วิศวกรรมคอมพิวเตอร์และสารสนเทศศาสตร์</option>
                                <option value="T13">วิศวกรรมเครื่องกลและการออกแบบ</option>
                                <option value="T14">วิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์</option>
                                <option value="T17">วิศวกรรมอุตสาหการและระบบ</option>
                                <option value="T20">วิศวกรรมระบบการผลิตดิจิทัล</option>
                                <option value="T23">วิศวกรรมดิจิทัลและอีเล็กทรอนิกส์อัจฉริยะ</option>
                                <option value="T18">วิศวกรรมเครื่องกลและระบบการผลิต</option>
                                <option value="T19">วิศวกรรมหุ่นยนต์และระบบอัตโนมัติ</option>
                                <option value="T22">วิศวกรรมยานยนต์</option>
                            </select>
                        </div>

                        <div className="student-register-input-group" style={{marginLeft:'15px'}}>
                            <div style={{width: '120px'}}>
                                <label htmlFor="Email" style={{color:'#000'}}> ชั้นปี *</label>
                            </div>
                            <input
                                style={{width:'100px'}}
                                type="number"
                                name="year"

                                value={formData.year}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                
                <div className="register-submit-container" style={{marginTop:'100px '}}>
                    <button type="submit" className="register-submit-button">
                    <span style={{color: 'black'}}>ลงทะเบียน</span>
                    <svg style={{stroke:'#000'}} width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5" />
                        <polyline points="8 1 12 5 8 9" />
                    </svg>
                    </button>
                </div>
                </form>
            </div>
        </div>
      </div>

    {/* Background */}
      <div className="login-background"></div>
    </div>
  );
};

export default Student_RegisterInfo ;
