import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import './Prof_Petition.css';
import { useLocation } from "react-router-dom";
import axios from "axios";
import PetitionStepper from "../StudentSide/Component/Petition/PetitionStepper";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import Swal from "sweetalert2";

const Prof_PetitionDetail = () => {
    const location = useLocation();
    const { ApplicationID, Petition_name } = location.state || {}; // รับค่าที่ส่งมา
    const [data, setData] = useState(null); // เก็บข้อมูลทั้งหมด
    const [username, setUsername] = useState(null); // เก็บข้อมูลทั้งหมด

    const [isVerified, setVerified] = useState(false);
    const [isApprove, setIsApprove] = useState(null);
    const [isReject, setIsReject] = useState(0);
    
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("authToken");

    const [statuses, setStatuses] = useState({
        approve: false,
        notApprove: false,
        verified: false,
      });

    const toggleStatus = (key) => {
        setStatuses((prevState) => {
        // ตรวจสอบว่ากำลังคลิก "อนุมัติ" หรือ "ไม่อนุมัติ"
        if (key === "approve") {
            setIsApprove(1);

            return {
            ...prevState,
            approve: !prevState.approve, // สลับสถานะ "อนุมัติ"
            notApprove: false, // ยกเลิกสถานะ "ไม่อนุมัติ"
            };
        } else if (key === "notApprove") {
            setIsApprove(0);
            setIsReject(1);


            return {
            ...prevState,
            notApprove: !prevState.notApprove, // สลับสถานะ "ไม่อนุมัติ"
            approve: false, // ยกเลิกสถานะ "อนุมัติ"
            };
            
        } 
        else {
            setVerified(!isVerified);
            
            return {
            ...prevState,
            [key] : !prevState[key],
            };
        }
        });
    };
    const studentcoopapplication_steps = [
        "ยื่นคำร้องรอการตรวจสอบ",
        "ตรวจสอบแล้ว",
        "ส่งไปที่เจ้าหน้าที่",
        "คำร้องอนุมัติ",
        "เสร็จสิ้น",
    ];
    const coopapplication_steps = [
        "ยื่นเอกสารรอการตรวจสอบ",
        "เข้าที่ประชุม",
        "อนุมัติคำร้อง",
        "ส่งไปที่เจ้าหน้าที่",
        "ออกหนังสือส่งตัว",
    ];

      // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const fetchStudentPetition = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user-email/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsername(response.data.username);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
            if(Petition_name == "คำร้องขอเป็นนิสิตสหกิจศึกษา"){
                console.log(ApplicationID)
                try {
                    const response = await axios.get(`http://localhost:5000/studentcoopapplication/${ApplicationID}`);
                    console.log("คำร้องขอเป็นนิสิตสหกิจศึกษา")
                    console.log( response.data)
                    setData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด

                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
            else if(Petition_name == "คำร้องขอปฏิบัติงานสหกิจศึกษา"){
                try {
                    const response = await axios.get(`http://localhost:5000/coopapplication/${ApplicationID}`);
                    console.log("คำร้องขอปฏิบัติงานสหกิจศึกษา")
                    console.log( response.data)
                    setData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }  
        };
        fetchStudentPetition();
      }, []);

     // ฟังก์ชันสำหรับอัปเดตข้อมูลไปยัง Backend
    const handleStudentUpdate = async () => {
        if (isApprove === null) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกสถานะ',
                text: 'กรุณาเลือกสถานะก่อนดำเนินการ',
            });
        return;
        }

        try {
        const response = await axios.put("http://localhost:5000/updateStudentApplication", {
            ApplicationID: ApplicationID,
            Is_approve: isApprove,
            Is_reject: isReject,
            Progress_State: 2,
        });

        if (response.status === 200) {

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'อัปเดตสถานะสำเร็จ!',}).then(() => {
            navigate(-1); });

        }
        } catch (err) {
        console.error("Error updating data:", err);
        Swal.fire({
            icon: 'warning',
            title: 'Error updating data',
            text: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
        });
        }
        
    };

         // ฟังก์ชันสำหรับอัปเดตข้อมูลไปยัง Backend
    const handleCoopUpdate = async () => {
            if (isApprove === null) {
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณาเลือกสถานะ',
                    text: 'กรุณาเลือกสถานะก่อนดำเนินการ',
                });
            return;
            }
            if (isVerified === false) {
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณายืนยันการลงนาม',
                    text: 'กรุณายืนยันการลงนามก่อนดำเนินการ',
                });
                return;
            }
    
            try {
            const response = await axios.put("http://localhost:5000/updateCoopApplication", {
                ApplicationID: ApplicationID,
                Is_approve: isApprove,
                Is_reject: isReject,
                Progress_State: 2,
            });
    
            if (response.status === 200) {Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'อัปเดตสถานะสำเร็จ!',
                }).then(() => {
                    navigate(-1);
                });
            }
            } catch (err) {
            console.error("Error updating data:", err);
                Swal.fire({
                    icon: 'warning',
                    title: 'Error updating data',
                    text: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
                });
            }
            
    };

    if(!data || !username){
        return (
            <div className="prof-petition">
            <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box">
                            <div className="table-container">
                                <div className="petition-detail-header ">
                                    <div className="sub-header-square" />
                                    <h1 className="table-title">คำร้องนิสิต</h1>
                                    
                                </div>
                                <div className="petition-detail-container">

                                    <div className="petition-detail-content">
                                        <p className="infomation-text" style={{textAlign :"center"}}>Loading...</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
        );
    }
    if(Petition_name == "คำร้องขอเป็นนิสิตสหกิจศึกษา"){
        return (
            <div className="prof-petition">
                <div className="background">
                <Sidebar/>
                <Banner/>
                <div className="main-container">
                    <div className="Side-Space"/>
                    <div className="home-content-container">
                        <div className="petition-table-container">
                            <div className="petition-table-box">
                                <div className="table-container">
                                    <div className="petition-detail-header ">
                                        <div className="sub-header-square" />
                                        <h1 className="table-title">คำร้องนิสิต</h1>
                                        <p className="table-subtitle" style={{marginLeft:'5%'}}>คำร้องขอเป็นนิสิตปฏิบัติงานสหกิจศึกษา</p>
                                    </div>
                                    <div className="petition-detail-container">
                                        <p className="pettion-subtitle">ข้อมูลนิสิต   </p>
                                        <div className="petition-detail-content">
                                            <div style={{flex: 2}}>
                                                <p className="infomation-header"> ชื่อ - นามสกุล</p>
                                                <p className="infomation-text"> {data.FullName} </p>
                                                <p className="infomation-header"> เลขประจำตัวนิสิต</p>
                                                <p className="infomation-text"> {data.StudentID} </p>
                                                <p className="infomation-header"> สาขาวิชาและชั้นปี</p>
                                                <p className="infomation-text"> {data.Major} ชั้นปีที่ {data.Year}</p>
                                                <p className="infomation-header"> อีเมล์</p>
                                                <p className="infomation-text"> {data.Email} </p>
                                                <p className="infomation-header"> เบอร์โทรศัพท์ที่ติดต่อได้</p>
                                                <p className="infomation-text"> {data.PhoneNumber} </p>
                                                <p className="infomation-header"> ผลการเรียนเทียบหลักสูตร</p>
                                                <div>
                                                {data.TotalCredits_File ? (
                                                        <button 
                                                        onClick={() => window.open(`http://localhost:5000/${data.TotalCredits_File}`)}
                                                        className="download-button"
                                                        style={{display:'flex',justifyContent: 'center',alignItems: 'center'}}  
                                                        >
                                                        <img src="/public/pdf.png" alt="pdf" style={{ width: '18px', height: '18px', cursor: 'pointer',marginRight: '10px'}}/>                                          
                                                        {data.StudentID} grade.pdf
                                                        </button>
                                                    ) : (
                                                        "ไม่มีไฟล์"
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{flex: 3,borderLeft:'1px solid #ddd',textAlign:'center'}}>
                                                {/* <p className="pettion-subtitle">สถานะคำร้องบัจจุบัน</p>
                                                <p className="table-subtitle">{studentcoopapplication_steps[data.Progress_State]}</p>
                                                <div style={{marginTop:'5%',alignContent:'center',justifyContent:'center',paddingLeft:'10%',paddingRight:'10%'}}>
                                                    <PetitionStepper steps={studentcoopapplication_steps} activeStep={data.Progress_State}/>
                                                </div>
                                                <div className="petition-approve-box" style={{marginTop:'2%',padding:'10px',alignSelf:'center',justifySelf:'center'}}>
                                                    <p className="pettion-subtitle" style={{fontSize:'18px',fontWeight:'500'}}>เรียนเจ้าหน้าที่ (นักวิชาการศึกษา กิจการนิสิต)</p>
                                                    <div>
                                                        <div className="box-item">
                                                            <span className={`icon ${statuses.approve ? "success_active" : "success_inactive"}`} onClick={() => toggleStatus("approve")}>✔</span>
                                                            <p>อนุมัติคำร้องขอเป็นนิสิตสหกิจ</p>
                                                        </div>
                                                        <div className="box-item">
                                                            <span  className={`icon ${statuses.notApprove ? "error_active" : "error_inactive"}`} onClick={() => toggleStatus("notApprove")}>✖</span>
                                                            <p>ไม่อนุมัติคำร้องขอเป็นนิสิตสหกิจ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'10px'}}>
                                                    <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                        <input type="checkbox" id="cbx2" style={{display: 'none'}} onClick={() => toggleStatus("signed")}/>
                                                        <label htmlFor="cbx2" className="check">
                                                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                            <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
                                                            <polyline points="1 9 7 14 15 4" />
                                                        </svg>
                                                        </label>
                                                    </div>
                                                    <p style={{fontSize:"12px"}}>ลงนามและผ่านการตรวจสอบโดย {username} (อาจารย์สหกิจศึกษาของภาควิชา)</p>
                                                </div> */}
                                                                                        {(data.Progress_State >= 2) ? ( 
                                            <div style={{flex:'1'}}>
                                                <div style={{flex:'1'}}>
                                                    <p className="pettion-subtitle">สถานะคำร้องบัจจุบัน</p>
                                                    <p className="table-subtitle">{studentcoopapplication_steps[data.Progress_State]}</p>
                                                    <div style={{marginTop:'20px',alignContent:'center',justifyContent:'center',paddingLeft:'10%',paddingRight:'10%'}}>
                                                        <PetitionStepper steps={studentcoopapplication_steps} activeStep={data.Progress_State}/>
                                                    </div>
                                                </div>
                                            </div>
                                        ):(
                                            <div>
                                                <div style={{flex:'1'}}>
                                                    <p className="pettion-subtitle">สถานะคำร้องบัจจุบัน</p>
                                                    <p className="table-subtitle">{coopapplication_steps[data.Progress_State]}</p>
                                                    <div style={{marginTop:'5%',alignContent:'center',justifyContent:'center',paddingLeft:'10%',paddingRight:'10%'}}>
                                                        <PetitionStepper steps={studentcoopapplication_steps} activeStep={data.Progress_State}/>
                                                        </div>
                                                </div> 
                                                <div style={{flex:'1'}}>
                                                <div className="petition-approve-box" style={{marginTop:'2%',padding:'10px',alignSelf:'center',justifySelf:'center'}}>
                                                    <p className="pettion-subtitle" style={{fontSize:'18px',fontWeight:'500'}}>เรียนเจ้าหน้าที่ (นักวิชาการศึกษา กิจการนิสิต)</p>
                                                        <div>
                                                            <div className="box-item">
                                                                <span className={`icon ${statuses.approve ? "success_active" : "success_inactive"}`} onClick={() => toggleStatus("approve")}>✔</span>
                                                                <p>อนุมัติคำร้องขอเป็นนิสิตสหกิจ</p>
                                                            </div>
                                                            <div className="box-item">
                                                                <span  className={`icon ${statuses.notApprove ? "error_active" : "error_inactive"}`} onClick={() => toggleStatus("notApprove")}>✖</span>
                                                                <p>ไม่อนุมัติคำร้องขอเป็นนิสิตสหกิจ</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'10px'}}>
                                                        <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                            <input type="checkbox" id="cbx2" style={{display: 'none'}} onClick={() => toggleStatus("signed")}/>
                                                            <label htmlFor="cbx2" className="check">
                                                            <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                                <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
                                                                <polyline points="1 9 7 14 15 4" />
                                                            </svg>
                                                            </label>
                                                        </div>
                                                        <p style={{fontSize:"12px"}}>ลงนามและผ่านการตรวจสอบโดย  {username} (อาจารย์สหกิจศึกษาของภาควิชา)</p>
                                                    </div>
                                                </div>     
                                            </div>
                                        )}
                                           </div>

                                        </div>
                                    </div>
                                    {(data.Progress_State >= 2) ? ( 
                                       <div className="petition-detail-footer " style={{marginTop:'20px'}}>
                                            <div className="petition-submit-button" onClick={() => (navigate(-1))} >กลับ</div>
                                        </div>  
                                    ):(
                                        <div className="petition-detail-footer " style={{marginTop:'20px'}}>
                                            <div className="petition-submit-button" onClick={() => handleStudentUpdate()} >ยืนยัน</div>
                                        </div>  
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
            </div>
        );
    }

    else if(Petition_name == "คำร้องขอปฏิบัติงานสหกิจศึกษา"){
        return (
            <div className="prof-petition">
                <div className="co-op-background">
                <Sidebar/>
                <Banner/>
                <div className="main-container">
                    <div className="Side-Space"/>
                    <div className="home-content-container">
                        <div className="petition-table-container">
                            <div className="petition-table-box">
                                <div className="table-container">
                                    <div className="petition-detail-header ">
                                        <div className="sub-header-square" />
                                        <h1 className="table-title">คำร้องนิสิต</h1>
                                        <p className="table-subtitle" style={{marginLeft:'5%'}}>คำร้องขอปฏิบัติงานสหกิจศึกษา   </p>
                                    </div>
                                    <div className="petition-detail-container">
                                        <div style={{display:'flex'}}>
                                            <p className="pettion-subtitle " style={{marginLeft:'15%'}}>ข้อมูลนิสิต   </p>
                                            <p className="pettion-subtitle " style={{marginLeft : "50%"}} >ข้อมูลบริษัท   </p>
                                        </div>
                                        <div className="petition-detail-content">
                                            <div>
                                                <p className="infomation-header"> ชื่อ - นามสกุล</p>
                                                
                                                <p className="infomation-text"> {data.FullName} </p>
                                                <p className="infomation-header"> เลขประจำตัวนิสิต</p>
                                                <p className="infomation-text"> {data.StudentID} </p>
                                                <p className="infomation-header"> สาขาวิชาและชั้นปี</p>
                                                <p className="infomation-text"> {data.Major} ชั้นปีที่ {data.Year}</p>
                                                <p className="infomation-header"> อีเมล์</p>
                                                <p className="infomation-text"> {data.Email} </p>
                                                <p className="infomation-header"> เบอร์โทรศัพท์ที่ติดต่อได้</p>
                                                <p className="infomation-text"> {data.PhoneNumber} </p>
                                            </div>
                                            
                                            <div style={{marginLeft:'30%',paddingLeft:'10%',borderLeft:'1px solid #ddd'}}>
                                                <p className="infomation-header"> ชื่อบริษัท (ภาษาไทย)</p>
                                                <p className="infomation-text"> {data.CompanyNameTH} </p>
                                                <p className="infomation-header"> ชื่อบริษัท (ภาษาอังกฤษ)</p>
                                                <p className="infomation-text"> {data.CompanyNameEN} </p>
                                                <p className="infomation-header"> ที่ตั้ง</p>
                                                <p className="infomation-text"> {data.CompanyAddress}</p>
                                                <p className="infomation-header"> จังหวัดที่ฝึกงาน</p>
                                                <p className="infomation-text"> {data.CompanyProvince} </p>
                                                <p className="infomation-header"> เบอร์โทรบริษัท</p>
                                                <p className="infomation-text"> {data.CompanyPhoneNumber} </p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div style={{padding:'0px 20px 40px 80px'}}>
                                        <p className="infomation-header">เอกสารที่เกี่ยวข้อง</p>
                                        <div>
                                        {data.FilePath ? (
                                            data.FilePath.split(",").map((file, index) => (
                                                <a
                                                key={index}
                                                onClick={() => window.open(`http://localhost:5000/uploads/RelatedFiles/${encodeURIComponent(file.trim())}`)}
                                                download={file.trim()} 
                                                style={{ display: 'flex', alignItems: 'center', marginBottom: '5px',cursor:'pointer',textDecoration:'underline'}}
                                                >
                                                <img src="/pdf.png" alt="pdf" style={{ width: '18px', height: '18px', marginRight: '10px' }} />
                                                เอกสารที่เกี่ยวข้อง {index+1} {data.StudentID}.pdf
                                                {/* {file.trim()} */}
                                                </a>
                                            ))
                                            ) : (
                                            <p>ไม่มีไฟล์</p>
                                            )}
                      </div>
                                    </div>
                                    <div style={{display:'flex',borderTop:'1px solid #ddd',textAlign:'center',paddingTop:'20px'}}>
                                        {(data.Progress_State >= 2) ? ( 
                                            <div style={{flex:'1'}}>
                                                <div style={{flex:'1'}}>
                                                    <p className="pettion-subtitle">สถานะคำร้องบัจจุบัน</p>
                                                    <p className="table-subtitle">{coopapplication_steps[data.Progress_State]}</p>
                                                    <div style={{marginTop:'20px',alignContent:'center',justifyContent:'center',paddingLeft:'10%',paddingRight:'10%'}}>
                                                        <PetitionStepper steps={coopapplication_steps} activeStep={data.Progress_State}/>
                                                    </div>
                                                </div>
                                            </div>
                                        ):(
                                            <div>
                                                <div style={{flex:'1'}}>
                                                    <p className="pettion-subtitle">สถานะคำร้องบัจจุบัน</p>
                                                    <p className="table-subtitle">{coopapplication_steps[data.Progress_State]}</p>
                                                    <div style={{marginTop:'5%',alignContent:'center',justifyContent:'center',paddingLeft:'10%',paddingRight:'10%'}}>
                                                        <PetitionStepper steps={coopapplication_steps} activeStep={data.Progress_State}/>
                                                        </div>
                                                </div> 
                                                <div style={{flex:'1'}}>
                                                <div className="petition-approve-box" style={{marginTop:'2%',padding:'10px',alignSelf:'center',justifySelf:'center'}}>
                                                    <p className="pettion-subtitle" style={{fontSize:'18px',fontWeight:'500'}}>เรียนเจ้าหน้าที่ (นักวิชาการศึกษา กิจการนิสิต)</p>
                                                        <div>
                                                            <div className="box-item">
                                                                <span className={`icon ${statuses.approve ? "success_active" : "success_inactive"}`} onClick={() => toggleStatus("approve")}>✔</span>
                                                                <p>อนุมัติคำร้องขอเป็นนิสิตสหกิจ</p>
                                                            </div>
                                                            <div className="box-item">
                                                                <span  className={`icon ${statuses.notApprove ? "error_active" : "error_inactive"}`} onClick={() => toggleStatus("notApprove")}>✖</span>
                                                                <p>ไม่อนุมัติคำร้องขอเป็นนิสิตสหกิจ</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'10px'}}>
                                                        <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                            <input type="checkbox" id="cbx2" style={{display: 'none'}} onClick={() => toggleStatus("signed")}/>
                                                            <label htmlFor="cbx2" className="check">
                                                            <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                                <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
                                                                <polyline points="1 9 7 14 15 4" />
                                                            </svg>
                                                            </label>
                                                        </div>
                                                        <p style={{fontSize:"12px"}}>ลงนามและผ่านการตรวจสอบโดย  {username} (อาจารย์สหกิจศึกษาของภาควิชา)</p>
                                                    </div>
                                                </div>     
                                            </div>
                                        )}
                                    </div>
                                    {(data.Progress_State >= 2) ? ( 
                                       <div className="petition-detail-footer " style={{marginTop:'20px'}}>
                                            <div className="petition-submit-button" onClick={() => (navigate(-1))} >กลับ</div>
                                        </div>  
                                    ):(
                                        <div className="petition-detail-footer " style={{marginTop:'20px'}}>
                                            <div className="petition-submit-button" onClick={() => handleCoopUpdate()} >ยืนยัน</div>
                                        </div>  
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
            </div>
        );
    }
}

export default Prof_PetitionDetail;
