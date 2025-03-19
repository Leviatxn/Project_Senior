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
import { 
    Button,
    Container, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    FormControlLabel, 
    Radio, 
    RadioGroup,
  } from "@mui/material";


const FirstEvaluation = () => {
    const [responses, setResponses] = useState({});
    const [evaluationData, setEvaluationData] = useState([]);

    // เรียก API เพื่อดึงข้อมูลหัวข้อหลักและหัวข้อย่อย
    useEffect(() => {
        const fetchData = async () => {
            try {
                // ดึงข้อมูลหัวข้อหลัก
                const sectionsResponse = await axios.get('http://localhost:5000/firstsupervision_sections');
                const sections = sectionsResponse.data;

                // สำหรับแต่ละหัวข้อหลัก ดึงหัวข้อย่อย
                const data = await Promise.all(sections.map(async (section) => {
                    const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
                    return {
                        ...section,
                        subcategories: criteriaResponse.data
                    };
                }));
                console.log(data)
                setEvaluationData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (category, subcategory, value) => {
        setResponses((prev) => ({
            ...prev,
            [category]: { ...prev[category], [subcategory]: value }
        }));
    };

    return (
        <Container sx={{ marginTop: 4, marginBottom: 4}}>
            <TableContainer  component={Paper} sx={{borderRadius:'10px',border:'1px solid rgba(0, 166, 162, 0.6)'}} >
                <Table>
                    <TableHead >
                        <TableRow >
                            <TableCell sx={{padding:'25px 0px 25px 60px', fontFamily:"Noto Sans Thai, sans-serif;",background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400',fontSize:'16px'}}>
                                หัวข้อการประเมิน
                            </TableCell>
                            {[5, 4, 3, 2, 1, 0].map((score) => (
                                <TableCell key={score} align="center" sx={{ fontFamily:"Noto Sans Thai, sans-serif;",background: '#00A6A2', color: 'white', fontWeight: '400'}}>
                                    {score}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluationData.map((item) => (
                            <React.Fragment key={item.section_id}>
                                <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2);' }}>
                                    <TableCell colSpan={7} sx={{fontFamily:"Noto Sans Thai, sans-serif;",padding:'20px 0px 20px 60px',fontWeight:'500',fontSize:'14px'}}>
                                        <div style={{display:'flex',alignItems:'center'}}>
                                            <div style={{marginRight:'20px'}}>•</div>
                                            <div>{item.section_name}</div> 
                                        </div>
                                    
                                    </TableCell>
                                </TableRow>
                                {item.subcategories.map((sub) => (
                                    <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                        <TableCell sx={{fontFamily:"Noto Sans Thai, sans-serif;",padding:'10px 0px 10px 80px',fontSize:'12px'}}>{sub.criteria_text}</TableCell>
                                        <TableCell colSpan={6} align="center">
                                            <RadioGroup row sx={{ display: 'flex',justifyContent:'space-around'}}>
                                                {[5, 4, 3, 2, 1, 0].map((score) => (
                                                    <FormControlLabel
                                                       
                                                        key={score}
                                                        value={score.toString()}
                                                        control={<Radio color="primary" />}
                                                        onChange={() => handleChange(item.section_name, sub.criteria_text, score)}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                )
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

const SecondEvaluation = () => {
    const [responses, setResponses] = useState({});
    const [evaluationData, setEvaluationData] = useState([]);

    // เรียก API เพื่อดึงข้อมูลหัวข้อหลักและหัวข้อย่อย
    useEffect(() => {
        const fetchData = async () => {
            try {
                // ดึงข้อมูลหัวข้อหลัก
                const sectionsResponse = await axios.get('http://localhost:5000/secondsupervision_sections');
                const sections = sectionsResponse.data;

                // สำหรับแต่ละหัวข้อหลัก ดึงหัวข้อย่อย
                const data = await Promise.all(sections.map(async (section) => {
                    const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
                    return {
                        ...section,
                        subcategories: criteriaResponse.data
                    };
                }));
                console.log(data)
                setEvaluationData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (category, subcategory, value) => {
        setResponses((prev) => ({
            ...prev,
            [category]: { ...prev[category], [subcategory]: value }
        }));
    };

    return (
        <Container sx={{ marginTop: 4, marginBottom: 4}}>
            <TableContainer sx={{borderRadius:'10px',border:'1px solid rgba(0, 166, 162, 0.6)'}}>
                <Table>
                    <TableHead >
                        <TableRow >
                            <TableCell sx={{padding:'25px 0px 25px 60px', fontFamily:"Noto Sans Thai, sans-serif;",background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400',fontSize:'16px'}}>
                                หัวข้อการประเมิน
                            </TableCell>
                            {[5, 4, 3, 2, 1, 0].map((score) => (
                                <TableCell key={score} align="center" sx={{ fontFamily:"Noto Sans Thai, sans-serif;",background: '#00A6A2', color: 'white', fontWeight: '400'}}>
                                    {score}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluationData.map((item) => (
                            <React.Fragment key={item.section_id}>
                                <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2);' }}>
                                    <TableCell colSpan={7} sx={{fontFamily:"Noto Sans Thai, sans-serif;",padding:'20px 0px 20px 60px',fontWeight:'500',fontSize:'14px'}}>
                                        <div style={{display:'flex',alignItems:'center'}}>
                                            <div style={{marginRight:'20px'}}>•</div>
                                            <div>{item.section_name}</div> 
                                        </div>
                                    
                                    </TableCell>
                                </TableRow>
                                {item.subcategories.map((sub) => (
                                    <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                        <TableCell sx={{fontFamily:"Noto Sans Thai, sans-serif;",padding:'10px 0px 10px 80px',fontSize:'12px'}}>{sub.criteria_text}</TableCell>
                                        <TableCell colSpan={6} align="center">
                                            <RadioGroup row sx={{ display: 'flex',justifyContent:'space-around'}}>
                                                {[5, 4, 3, 2, 1, 0].map((score) => (
                                                    <FormControlLabel
                                                       
                                                        key={score}
                                                        value={score.toString()}
                                                        control={<Radio color="primary" />}
                                                        onChange={() => handleChange(item.section_name, sub.criteria_text, score)}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}


const Prof_evaluation = () => {
    const location = useLocation();
    const { studentID } = location.state || {}; // รับค่าที่ส่งมา
    const { version } = location.state || {}; // รับค่าที่ส่งมา

    const [coopData, setCoopData] = useState(null); // เก็บข้อมูลทั้งหมด
    const [studentInfo, setStudentInfo] = useState(null); // เก็บข้อมูลทั้งหมด

    const [isVerified, setVerified] = useState(false);
    const [isApprove, setIsApprove] = useState(null);
    const navigate = useNavigate();

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
    const getMajorName= (major) => {
        switch (major) {
          case 'T12':
              return "วิศวกรรมคอมพิวเตอร์และสารสนเทศศาสตร์";
          case 'T13':
              return "วิศวกรรมเครื่องกลและการออกแบบ";
          case 'T14':
              return "วิศวกรรมไฟฟ้าและอิเล็กทรอนิกส์";
          case 'T17':
              return "วิศวกรรมอุตสาหการและระบบ";
          case 'T20':
              return "วิศวกรรมระบบการผลิตดิจิทัล";
          case 'T23':
              return "วิศวกรรมดิจิทัลและอีเล็กทรอนิกส์อัจฉริยะ";
          case 'T18':
              return "วิศวกรรมเครื่องกลและระบบการผลิต";
          case 'T19':
              return "วิศวกรรมหุ่นยนต์และระบบอัตโนมัติ";
          case 'T22':
              return "วิศวกรรมยานยนต์";                  
          default:
            return "default";
        }
      };

      // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const fetchCoopData = async () => {
            console.log(studentID,version)
              try {
                const response = await axios.get(`http://localhost:5000/user_info/${studentID}`, {
                });
        
                if (response.data) {
                    console.log(response.data);
                    setStudentInfo(response.data);
                } else {
                    console.error("ไม่พบข้อมูลผู้ใช้");
                }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
                try {
                    const response = await axios.get(`http://localhost:5000/coop_info/${studentID}`, {
                    });
                    console.log( response.data)
                    setCoopData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด

                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
        };
        fetchCoopData();
      }, []);

      const formatCoopDate = (isoString) => {
        if(isoString == null){
          return '-'
        }
        const date = new Date(isoString);
        return date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      };

    if(!coopData || !studentInfo){
        return (
            <div className="prof-petition">
            <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box" >
                            <div className="table-container">
                                <div className="petition-detail-header">
                                    <div className="sub-header-square" />
                                    <h1 className="table-title">แบบบันทึกการนิเทศงานสหกิจศึกษา</h1>    
                                </div>
                                <div className="petition-detail-container">
                                    <div className="petition-detail-content">
                                        <div className="loading-text">กำลังโหลดข้อมูล...
                                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'20px'}}>
                                                <div class="loader"></div>
                                            </div>
                                        </div>                                    
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
    if(version === 1){
        return(
            <div className="prof-petition">
            <div className="background" style={{height:'2800px'}}>
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box" >
                            <div className="table-container">
                                <div className="petition-detail-header">
                                    <div className="sub-header-square" />
                                    <h1 className="table-title">แบบบันทึกการนิเทศงานสหกิจศึกษา ครั้งที่ 1</h1>    
                                </div>
                                <div className="petition-detail-container">
                                    <div style={{marginTop:'20px'}}>
                                        <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                            <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                            <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลสหกิจศึกษา </h1>
                                        </div>                    
                                        <div style={{flex:'1',display:'flex',borderRadius:'5px',padding:'20px 30px 20px 30px',background:'rgba(0, 103, 101, 0.2)'}}>
                                            <div style={{flex: '3',display:'flex',borderRight:'1px solid #ddd'}}>
                                                <div style={{flex: '1'}}>
                                                    <p style={{color:'#767676'}}>ชื่อนิสิต  :</p>
                                                    <p style={{color:'#767676'}}>ชื่อบริษัท/สถานประกอบการ  :</p>
                                                    <p style={{color:'#767676'}}>ที่อยู่ :</p>
                                                    <p style={{color:'#767676'}}>จังหวัด:</p>
                                                </div>
                                                <div style={{flex: '1'}}>
                                                    <p>{studentInfo.first_name} {studentInfo.last_name}</p>
                                                    <p>{coopData.CompanyNameTH}</p>
                                                    <p>{coopData.CompanyAddress}</p>
                                                    <p>{coopData.CompanyProvince}</p>
    
                                                </div>
                                            </div>
                                            <div style={{flex: '3',marginLeft:"30px"}}>
                                                <div style={{flex: '1',display: 'flex'}}>
                                                    <div style={{flex: '1'}}>
                                                    <p style={{color:'#767676'}}>เบอร์โทรติดต่อ :</p>
                                                    <p style={{color:'#767676'}}>เบี้ยเลี้ยง :</p>
                                                    <p style={{color:'#767676'}}>ระยะเวลาการฝึกงานสหกิจ:</p>
    
                                                    </div>
                                                    <div style={{flex: '2',textAlign:'end'}}>
                                                        <p>{coopData.CompanyPhoneNumber}</p>
                                                        <p>{coopData.Allowance} บาท / ต่อวัน</p>
                                                        <p>{formatCoopDate(coopData.Coop_StartDate)} - {formatCoopDate(coopData.Coop_EndDate)}</p>
    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{marginTop:'20px'}}>
                                        <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                            <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                            <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>สำหรับการประเมินสถานประกอบการ (อาจารย์ประเมิน)</h1>
                                        </div>
                                        <div>
                                            <FirstEvaluation/>                 
                                        </div>
                                        <div>
                                            <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
                                            <Button 
                                            variant="contained" color="success"
                                            sx={{
                                                width: "200px",
                                                color: "#FFFFFF", 
                                                borderRadius: "16px",
                                                fontSize: "14px",
                                                fontFamily :"Noto Sans Thai , sans-seriff",
                                                padding: "10px 20px",
                                                textTransform: "none",
                                            }}
                                            >
                                                <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>บันทึก</div>
                                            </Button>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        </div>
        </div>
        )
    }
    else if(version === 2){
        return(
            <div className="prof-petition">
            <div className="background"  style={{height:'2800px'}}  >
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box" >
                            <div className="table-container">
                                <div className="petition-detail-header">
                                    <div className="sub-header-square" />
                                    <h1 className="table-title">แบบบันทึกการนิเทศงานสหกิจศึกษา ครั้งที่ 2</h1>    
                                </div>
                                <div className="petition-detail-container">
                                    <div style={{marginTop:'20px'}}>
                                        <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                            <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                            <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>ข้อมูลสหกิจศึกษา </h1>
                                        </div>                    
                                        <div style={{flex:'1',display:'flex',borderRadius:'5px',padding:'20px 30px 20px 30px',background:'rgba(0, 103, 101, 0.2)'}}>
                                            <div style={{flex: '3',display:'flex',borderRight:'1px solid #ddd'}}>
                                                <div style={{flex: '1'}}>
                                                    <p style={{color:'#767676'}}>ชื่อนิสิต  :</p>
                                                    <p style={{color:'#767676'}}>ชื่อบริษัท/สถานประกอบการ  :</p>
                                                    <p style={{color:'#767676'}}>ที่อยู่ :</p>
                                                    <p style={{color:'#767676'}}>จังหวัด:</p>
                                                </div>
                                                <div style={{flex: '1'}}>
                                                    <p>{studentInfo.first_name} {studentInfo.last_name}</p>
                                                    <p>{coopData.CompanyNameTH}</p>
                                                    <p>{coopData.CompanyAddress}</p>
                                                    <p>{coopData.CompanyProvince}</p>
    
                                                </div>
                                            </div>
                                            <div style={{flex: '3',marginLeft:"30px"}}>
                                                <div style={{flex: '1',display: 'flex'}}>
                                                    <div style={{flex: '1'}}>
                                                    <p style={{color:'#767676'}}>เบอร์โทรติดต่อ :</p>
                                                    <p style={{color:'#767676'}}>เบี้ยเลี้ยง :</p>
                                                    <p style={{color:'#767676'}}>ระยะเวลาการฝึกงานสหกิจ:</p>
    
                                                    </div>
                                                    <div style={{flex: '2',textAlign:'end'}}>
                                                        <p>{coopData.CompanyPhoneNumber}</p>
                                                        <p>{coopData.Allowance} บาท / ต่อวัน</p>
                                                        <p>{formatCoopDate(coopData.Coop_StartDate)} - {formatCoopDate(coopData.Coop_EndDate)}</p>
    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{marginTop:'20px'}}>
                                        <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                            <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                            <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>สำหรับการประเมินสถานประกอบการ (อาจารย์ประเมิน)</h1>
                                        </div>
                                        <div>
                                            <SecondEvaluation/>                 
                                        </div>
                                        <div>
                                            <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
                                            <Button 
                                            variant="contained" color="success"
                                            sx={{
                                                width: "200px",
                                                color: "#FFFFFF", 
                                                borderRadius: "16px",
                                                fontSize: "14px",
                                                fontFamily :"Noto Sans Thai , sans-seriff",
                                                padding: "10px 20px",
                                                textTransform: "none",
                                            }}
                                            >
                                                <div style={{fontFamily: "Noto Sans Thai, sans-serif"}}>บันทึก</div>
                                            </Button>
                                            </div>  
                                        </div>                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        </div>
        </div>
        )
    }
}

export default Prof_evaluation;
