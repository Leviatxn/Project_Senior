import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import '../Main.css';
import './Petition.css';
import ReturnButton from "../MainComponent/ReturnButton";
import { useLocation } from "react-router-dom";
import axios from "axios";
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
  import { Radar } from 'react-chartjs-2';
  import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
  import SelfEvaluation_Chart from "../MainComponent/DataVisualization/Student_Graph";
  
  ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

  
  const FirstEvaluation = ({ evaluationID , studentID }) => {
    const [responses, setResponses] = useState({});
    const [evaluationData, setEvaluationData] = useState([]);
    const [isEvaluated, setIsEvaluated] = useState(false);

    useEffect(() => {
        if (evaluationID) {
          fetchScores(evaluationID);
        }
      }, [evaluationID, evaluationData]); // เพิ่ม evaluationData ใน dependency array
      
      const fetchScores = async (evaluationID) => {
        try {
          const response = await axios.get(`http://localhost:5000/evaluation_scores/${evaluationID}`);
          if (response.data) {
            setIsEvaluated(true);
            const scores = response.data.reduce((acc, score) => {
              const section = evaluationData.find((item) =>
                item.subcategories.some((sub) => sub.criteria_id === score.criteria_id)
              );
              if (section) {
                const subcategory = section.subcategories.find((sub) => sub.criteria_id === score.criteria_id);
                if (subcategory) {
                  acc[section.section_name] = acc[section.section_name] || {};
                  acc[section.section_name][subcategory.criteria_text] = score.score;
                }
              }
              return acc;
            }, {});
            setResponses(scores);
          }
        } catch (error) {
          console.error('Error fetching scores:', error);
        }
      };
  
    // เรียก API เพื่อดึงข้อมูลหัวข้อหลักและหัวข้อย่อย
    useEffect(() => {
      const fetchData = async () => {
        console.log(evaluationID);
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
          console.log(data);
          setEvaluationData(data);
  
          // ดึงข้อมูลคะแนนหากมี evaluationID
          if (evaluationID) {
            fetchScores(evaluationID);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [evaluationID]);
  
    const handleChange = (category, subcategory, value) => {
      setResponses((prev) => ({
        ...prev,
        [category]: { ...prev[category], [subcategory]: value }
      }));
    };
  
    const handleSubmit = async () => {
      try {
        // สร้างข้อมูลสำหรับส่ง
        const scores = Object.entries(responses).flatMap(([category, subcategories]) =>
          Object.entries(subcategories).map(([subcategory, score]) => {
            // หา criteria_id จาก evaluationData
            const section = evaluationData.find((item) => item.section_name === category);
            const criteria = section.subcategories.find((sub) => sub.criteria_text === subcategory);
  
            return {
              evaluation_id: evaluationID, // ใช้ evaluationID ที่ส่งมา
              criteria_id: criteria.criteria_id,
              score: score,
              comments: "", // สามารถเพิ่มความคิดเห็นได้หากมี
            };
          })
        );
  
        console.log(scores);
  
        // ส่งข้อมูลไปยัง API
        const response = await axios.post('http://localhost:5000/evaluation_scores', { scores });
        console.log('Data submitted successfully:', response.data);
        alert('บันทึกข้อมูลสำเร็จ!');
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
      try{
        // ส่งข้อมูลไปยัง API
        const response = await axios.put(`http://localhost:5000/updateFirstevaluation/${studentID}`,{});
        console.log('Data submitted successfully:', response.data);
        alert('บันทึกข้อมูลสำเร็จ!');
      }
      catch(error){
        console.error('Error submitting data:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    };
    if (isEvaluated) {
        return (
          <div>
            <Container sx={{ marginTop: 4, marginBottom: 4 }}>
              <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                        หัวข้อการประเมิน
                      </TableCell>
                      <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400', fontSize: '16px',textAlign:'center'}}>
                        คะแนน
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evaluationData.map((item) => (
                      <React.Fragment key={item.section_id}>
                        <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                          <TableCell colSpan={2} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ marginRight: '20px' }}>•</div>
                              <div>{item.section_name}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                        {item.subcategories.map((sub) => (
                          <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                            <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                            <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '12px',fontWeight:'600',border:'1px solid #ddd'}}>
                              {responses[item.section_name]?.[sub.criteria_text] || 'กำลังดึงข้อมูล'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </div>
        );
      }
    else if(!isEvaluated){
        return (
            <div>
              <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                          หัวข้อการประเมิน
                        </TableCell>
                        {[5, 4, 3, 2, 1, 0].map((score) => (
                          <TableCell key={score} align="center" sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400' }}>
                            {score}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {evaluationData.map((item) => (
                        <React.Fragment key={item.section_id}>
                          <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                            <TableCell colSpan={7} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ marginRight: '20px' }}>•</div>
                                <div>{item.section_name}</div>
                              </div>
                            </TableCell>
                          </TableRow>
                          {item.subcategories.map((sub) => (
                            <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                              <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '10px 0px 10px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                              <TableCell colSpan={6} align="center">
                                <RadioGroup row sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                  {[5, 4, 3, 2, 1, 0].map((score) => (
                                    <FormControlLabel
                                      key={score}
                                      value={score.toString()}
                                      control={<Radio color="primary" />}
                                      checked={responses[item.section_name]?.[sub.criteria_text] === score}
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
              <div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained" color="success"
                    sx={{
                      width: "200px",
                      color: "#FFFFFF",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontFamily: "Noto Sans Thai, sans-serif",
                      padding: "10px 20px",
                      textTransform: "none",
                    }}
                  >
                    <div style={{ fontFamily: "Noto Sans Thai, sans-serif" }}>บันทึก</div>
                  </Button>
                </div>
              </div>
            </div>
          );
    }
  };

  
  const SecondEvaluation = ({evaluationID,studentID}) => {
      const [responses, setResponses] = useState({});
      const [evaluationData, setEvaluationData] = useState([]);
      const [isEvaluated, setIsEvaluated] = useState(false);

      useEffect(() => {
          console.log('Responses updated:', responses);
        }, [responses]);


        useEffect(() => {
          if (evaluationID) {
            fetchScores(evaluationID);
          }
        }, [evaluationID, evaluationData]); // เพิ่ม evaluationData ใน dependency array
        
        const fetchScores = async (evaluationID) => {
          try {
            const response = await axios.get(`http://localhost:5000/evaluation_scores/${evaluationID}`);
            if (response.data) {
              setIsEvaluated(true);
              const scores = response.data.reduce((acc, score) => {
                const section = evaluationData.find((item) =>
                  item.subcategories.some((sub) => sub.criteria_id === score.criteria_id)
                );
                if (section) {
                  const subcategory = section.subcategories.find((sub) => sub.criteria_id === score.criteria_id);
                  if (subcategory) {
                    acc[section.section_name] = acc[section.section_name] || {};
                    acc[section.section_name][subcategory.criteria_text] = score.score;
                  }
                }
                return acc;
              }, {});
              setResponses(scores);
            }
          } catch (error) {
            console.error('Error fetching scores:', error);
          }
        };
    
      // เรียก API เพื่อดึงข้อมูลหัวข้อหลักและหัวข้อย่อย
      useEffect(() => {
        const fetchData = async () => {
          console.log(evaluationID);
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
            console.log(data);
            setEvaluationData(data);
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [evaluationID]);
    
      const handleChange = (category, subcategory, value) => {
        setResponses((prev) => ({
          ...prev,
          [category]: { ...prev[category], [subcategory]: value }
        }));
      };
    
      const handleSubmit = async () => {
        try {
          // สร้างข้อมูลสำหรับส่ง
          const scores = Object.entries(responses).flatMap(([category, subcategories]) =>
            Object.entries(subcategories).map(([subcategory, score]) => {
              // หา criteria_id จาก evaluationData
              const section = evaluationData.find((item) => item.section_name === category);
              const criteria = section.subcategories.find((sub) => sub.criteria_text === subcategory);
    
              return {
                evaluation_id: evaluationID, // ใช้ evaluationID ที่ส่งมา
                criteria_id: criteria.criteria_id,
                score: score,
                comments: "", // สามารถเพิ่มความคิดเห็นได้หากมี
              };
            })
          );
    
          console.log(scores);
    
          // ส่งข้อมูลไปยัง API
          const response = await axios.post('http://localhost:5000/evaluation_scores', { scores });
          console.log('Data submitted successfully:', response.data);
          alert('บันทึกข้อมูลสำเร็จ!');
        } catch (error) {
          console.error('Error submitting data:', error);
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
        try{
          // ส่งข้อมูลไปยัง API
          const response = await axios.put(`http://localhost:5000/updateSecondevaluation/${studentID}`,{});
          console.log('Data submitted successfully:', response.data);
          alert('บันทึกข้อมูลสำเร็จ!');
        }
        catch(error){
          console.error('Error submitting data:', error);
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
      };
      if (isEvaluated) {
          return (
            <div>
              <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                          หัวข้อการประเมิน
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400', fontSize: '16px',textAlign:'center'}}>
                          คะแนน
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {evaluationData.map((item) => (
                        <React.Fragment key={item.section_id}>
                          <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                            <TableCell colSpan={2} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ marginRight: '20px' }}>•</div>
                                <div>{item.section_name}</div>
                              </div>
                            </TableCell>
                          </TableRow>
                          {item.subcategories.map((sub) => (
                            <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                              <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                              <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '12px',fontWeight:'600',border:'1px solid #ddd'}}>
                                {responses[item.section_name]?.[sub.criteria_text] || 'กำลังดึงข้อมูล'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
            </div>
          );
        }
      else if(!isEvaluated){
          return (
              <div>
                <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                  <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                            หัวข้อการประเมิน
                          </TableCell>
                          {[5, 4, 3, 2, 1, 0].map((score) => (
                            <TableCell key={score} align="center" sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400' }}>
                              {score}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {evaluationData.map((item) => (
                          <React.Fragment key={item.section_id}>
                            <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                              <TableCell colSpan={7} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <div style={{ marginRight: '20px' }}>•</div>
                                  <div>{item.section_name}</div>
                                </div>
                              </TableCell>
                            </TableRow>
                            {item.subcategories.map((sub) => (
                              <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '10px 0px 10px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                                <TableCell colSpan={6} align="center">
                                  <RadioGroup row sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {[5, 4, 3, 2, 1, 0].map((score) => (
                                      <FormControlLabel
                                        key={score}
                                        value={score.toString()}
                                        control={<Radio color="primary" />}
                                        checked={responses[item.section_name]?.[sub.criteria_text] === score}
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
                <div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      onClick={handleSubmit}
                      variant="contained" color="success"
                      sx={{
                        width: "200px",
                        color: "#FFFFFF",
                        borderRadius: "16px",
                        fontSize: "14px",
                        fontFamily: "Noto Sans Thai, sans-serif",
                        padding: "10px 20px",
                        textTransform: "none",
                      }}
                    >
                      <div style={{ fontFamily: "Noto Sans Thai, sans-serif" }}>บันทึก</div>
                    </Button>
                  </div>
                </div>
              </div>
            );
      }
    };

  const SelfEvaluation = ({ evaluationID , studentID }) => {
          
          const [responses, setResponses] = useState({});
          const [evaluationData, setEvaluationData] = useState([]);
          const [isEvaluated, setIsEvaluated] = useState(false);
      
          useEffect(() => {
              if (evaluationID) {
                fetchScores(evaluationID);
              }
            }, [evaluationID, evaluationData]); // เพิ่ม evaluationData ใน dependency array
            
            const fetchScores = async (evaluationID) => {
              try {
                const response = await axios.get(`http://localhost:5000/evaluation_scores/${evaluationID}`);
                if (response.data) {
                  setIsEvaluated(true);
                  const scores = response.data.reduce((acc, score) => {
                    const section = evaluationData.find((item) =>
                      item.subcategories.some((sub) => sub.criteria_id === score.criteria_id)
                    );
                    if (section) {
                      const subcategory = section.subcategories.find((sub) => sub.criteria_id === score.criteria_id);
                      if (subcategory) {
                        acc[section.section_name] = acc[section.section_name] || {};
                        acc[section.section_name][subcategory.criteria_text] = score.score;
                      }
                    }
                    return acc;
                  }, {});
                  setResponses(scores);
                }
              } catch (error) {
                console.error('Error fetching scores:', error);
              }
            };
        
          // เรียก API เพื่อดึงข้อมูลหัวข้อหลักและหัวข้อย่อย
          useEffect(() => {
            const fetchData = async () => {
              console.log(evaluationID);
              try {
                // ดึงข้อมูลหัวข้อหลัก
                const sectionsResponse = await axios.get('http://localhost:5000/selfEvaluation_sections');
                const sections = sectionsResponse.data;
        
                // สำหรับแต่ละหัวข้อหลัก ดึงหัวข้อย่อย
                const data = await Promise.all(sections.map(async (section) => {
                  const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
                  return {
                    ...section,
                    subcategories: criteriaResponse.data
                  };
                }));
                console.log(data);
                setEvaluationData(data);
        
                // ดึงข้อมูลคะแนนหากมี evaluationID
                if (evaluationID) {
                  fetchScores(evaluationID);
                }
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
        
            fetchData();
          }, [evaluationID]);
        
          const handleChange = (category, subcategory, value) => {
            setResponses((prev) => ({
              ...prev,
              [category]: { ...prev[category], [subcategory]: value }
            }));
          };
        
          const handleSubmit = async () => {
            try {
              // สร้างข้อมูลสำหรับส่ง
              const scores = Object.entries(responses).flatMap(([category, subcategories]) =>
                Object.entries(subcategories).map(([subcategory, score]) => {
                  // หา criteria_id จาก evaluationData
                  const section = evaluationData.find((item) => item.section_name === category);
                  const criteria = section.subcategories.find((sub) => sub.criteria_text === subcategory);
        
                  return {
                    evaluation_id: evaluationID, // ใช้ evaluationID ที่ส่งมา
                    criteria_id: criteria.criteria_id,
                    section_id: section.section_id,
                    score: score,
                    evaluation_type:'self_evaluate',
                    comments: "", // สามารถเพิ่มความคิดเห็นได้หากมี
                  };
                })
              );
        
              console.log(scores);
        
              // ส่งข้อมูลไปยัง API
              const response = await axios.post('http://localhost:5000/evaluation_scores', { scores });
              console.log('Data submitted successfully:', response.data);
              alert('บันทึกข้อมูลสำเร็จ!');
            } catch (error) {
              console.error('Error submitting data:', error);
              alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
            try{
              // ส่งข้อมูลไปยัง API
              const response = await axios.put(`http://localhost:5000/updateFirstevaluation/${studentID}`,{});
              console.log('Data submitted successfully:', response.data);
              alert('บันทึกข้อมูลสำเร็จ!');
            }
            catch(error){
              console.error('Error submitting data:', error);
              alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
          };
          if (isEvaluated) {
              return (
                <div>
                  <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                    <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                              หัวข้อการประเมิน
                            </TableCell>
                            <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400', fontSize: '16px',textAlign:'center'}}>
                              คะแนน
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {evaluationData.map((item) => (
                            <React.Fragment key={item.section_id}>
                              <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                                <TableCell colSpan={2} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '20px' }}>•</div>
                                    <div>{item.section_name}</div>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {item.subcategories.map((sub) => (
                                <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                  <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                                  <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '14px',fontWeight:'bold',border:'1px solid #ddd'}}>
                                    {responses[item.section_name]?.[sub.criteria_text] || 'กำลังดึงข้อมูล'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Container>
                </div>
              );
            }
          else if(!isEvaluated){
              return (
                  <div>
                    <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                      <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                                หัวข้อการประเมิน
                              </TableCell>
                              {[5, 4, 3, 2, 1, 0].map((score) => (
                                <TableCell key={score} align="center" sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400' }}>
                                  {score}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {evaluationData.map((item) => (
                              <React.Fragment key={item.section_id}>
                                <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                                  <TableCell colSpan={7} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <div style={{ marginRight: '20px' }}>•</div>
                                      <div>{item.section_name}</div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {item.subcategories.map((sub) => (
                                  <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                    <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '10px 0px 10px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                                    <TableCell colSpan={6} align="center">
                                      <RadioGroup row sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                        {[5, 4, 3, 2, 1, 0].map((score) => (
                                          <FormControlLabel
                                            key={score}
                                            value={score.toString()}
                                            control={<Radio color="primary" />}
                                            checked={responses[item.section_name]?.[sub.criteria_text] === score}
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
                    <div>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                          onClick={handleSubmit}
                          variant="contained" color="success"
                          sx={{
                            width: "200px",
                            color: "#FFFFFF",
                            borderRadius: "16px",
                            fontSize: "14px",
                            fontFamily: "Noto Sans Thai, sans-serif",
                            padding: "10px 20px",
                            textTransform: "none",
                          }}
                        >
                          <div style={{ fontFamily: "Noto Sans Thai, sans-serif" }}>บันทึก</div>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
          }
        };

  const SelfEvaluation_2 = ({ evaluationID , studentID }) => {
          
          const [responses, setResponses] = useState({});
          const [evaluationData, setEvaluationData] = useState([]);
          const [isEvaluated, setIsEvaluated] = useState(false);
      
          useEffect(() => {
              if (evaluationID) {
                fetchScores(evaluationID);
              }
            }, [evaluationID, evaluationData]); // เพิ่ม evaluationData ใน dependency array
            
            const fetchScores = async (evaluationID) => {
              try {
                const response = await axios.get(`http://localhost:5000/evaluation_scores/${evaluationID}`);
                if (response.data) {
                  setIsEvaluated(true);
                  const scores = response.data.reduce((acc, score) => {
                    const section = evaluationData.find((item) =>
                      item.subcategories.some((sub) => sub.criteria_id === score.criteria_id)
                    );
                    if (section) {
                      const subcategory = section.subcategories.find((sub) => sub.criteria_id === score.criteria_id);
                      if (subcategory) {
                        acc[section.section_name] = acc[section.section_name] || {};
                        acc[section.section_name][subcategory.criteria_text] = score.score;
                      }
                    }
                    return acc;
                  }, {});
                  setResponses(scores);
                }
              } catch (error) {
                console.error('Error fetching scores:', error);
              }
            };
        
          // เรียก API เพื่อดึงข้อมูลหัวข้อหลักและหัวข้อย่อย
          useEffect(() => {
            const fetchData = async () => {
              console.log(evaluationID);
              try {
                // ดึงข้อมูลหัวข้อหลัก
                const sectionsResponse = await axios.get('http://localhost:5000/selfEvaluation_sections');
                const sections = sectionsResponse.data;
        
                // สำหรับแต่ละหัวข้อหลัก ดึงหัวข้อย่อย
                const data = await Promise.all(sections.map(async (section) => {
                  const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
                  return {
                    ...section,
                    subcategories: criteriaResponse.data
                  };
                }));
                console.log(data);
                setEvaluationData(data);
        
                // ดึงข้อมูลคะแนนหากมี evaluationID
                if (evaluationID) {
                  fetchScores(evaluationID);
                }
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
        
            fetchData();
          }, [evaluationID]);
        
          const handleChange = (category, subcategory, value) => {
            setResponses((prev) => ({
              ...prev,
              [category]: { ...prev[category], [subcategory]: value }
            }));
          };
        
          const handleSubmit = async () => {
            try {
              // สร้างข้อมูลสำหรับส่ง
              const scores = Object.entries(responses).flatMap(([category, subcategories]) =>
                Object.entries(subcategories).map(([subcategory, score]) => {
                  // หา criteria_id จาก evaluationData
                  const section = evaluationData.find((item) => item.section_name === category);
                  const criteria = section.subcategories.find((sub) => sub.criteria_text === subcategory);
        
                  return {
                    evaluation_id: evaluationID, // ใช้ evaluationID ที่ส่งมา
                    criteria_id: criteria.criteria_id,
                    score: score,
                    evaluation_type:'self_evaluate',
                    comments: "", // สามารถเพิ่มความคิดเห็นได้หากมี
                  };
                })
              );
        
              console.log(scores);
        
              // ส่งข้อมูลไปยัง API
              const response = await axios.post('http://localhost:5000/evaluation_scores', { scores });
              console.log('Data submitted successfully:', response.data);
              alert('บันทึกข้อมูลสำเร็จ!');
            } catch (error) {
              console.error('Error submitting data:', error);
              alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
            try{
              // ส่งข้อมูลไปยัง API
              const response = await axios.put(`http://localhost:5000/updateSecondevaluation/${studentID}`,{});
              console.log('Data submitted successfully:', response.data);
              alert('บันทึกข้อมูลสำเร็จ!');
            }
            catch(error){
              console.error('Error submitting data:', error);
              alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
          };
          if (isEvaluated) {
              return (
                <div>
                  <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                    <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                              หัวข้อการประเมิน
                            </TableCell>
                            <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400', fontSize: '16px',textAlign:'center'}}>
                              คะแนน
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {evaluationData.map((item) => (
                            <React.Fragment key={item.section_id}>
                              <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                                <TableCell colSpan={2} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '20px' }}>•</div>
                                    <div>{item.section_name}</div>
                                  </div>
                                </TableCell>
                              </TableRow>
                              {item.subcategories.map((sub) => (
                                <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                  <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                                  <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '15px 0px 15px 80px', fontSize: '14px',fontWeight:'bold',border:'1px solid #ddd'}}>
                                    {responses[item.section_name]?.[sub.criteria_text] || 'กำลังดึงข้อมูล'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Container>
                </div>
              );
            }
          else if(!isEvaluated){
              return (
                  <div>
                    <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                      <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid rgba(0, 166, 162, 0.6)' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ padding: '25px 0px 25px 60px', fontFamily: "Noto Sans Thai, sans-serif", background: 'linear-gradient(90deg, rgba(0, 166, 162, 0.6) 40%, #00A6A2 100%)', color: 'white', fontWeight: '400', fontSize: '16px' }}>
                                หัวข้อการประเมิน
                              </TableCell>
                              {[5, 4, 3, 2, 1, 0].map((score) => (
                                <TableCell key={score} align="center" sx={{ fontFamily: "Noto Sans Thai, sans-serif", background: '#00A6A2', color: 'white', fontWeight: '400' }}>
                                  {score}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {evaluationData.map((item) => (
                              <React.Fragment key={item.section_id}>
                                <TableRow sx={{ background: 'rgba(0, 103, 101, 0.2)' }}>
                                  <TableCell colSpan={7} sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '20px 0px 20px 60px', fontWeight: '500', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <div style={{ marginRight: '20px' }}>•</div>
                                      <div>{item.section_name}</div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {item.subcategories.map((sub) => (
                                  <TableRow key={sub.criteria_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                    <TableCell sx={{ fontFamily: "Noto Sans Thai, sans-serif", padding: '10px 0px 10px 80px', fontSize: '12px' }}>{sub.criteria_text}</TableCell>
                                    <TableCell colSpan={6} align="center">
                                      <RadioGroup row sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                        {[5, 4, 3, 2, 1, 0].map((score) => (
                                          <FormControlLabel
                                            key={score}
                                            value={score.toString()}
                                            control={<Radio color="primary" />}
                                            checked={responses[item.section_name]?.[sub.criteria_text] === score}
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
                    <div>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                          onClick={handleSubmit}
                          variant="contained" color="success"
                          sx={{
                            width: "200px",
                            color: "#FFFFFF",
                            borderRadius: "16px",
                            fontSize: "14px",
                            fontFamily: "Noto Sans Thai, sans-serif",
                            padding: "10px 20px",
                            textTransform: "none",
                          }}
                        >
                          <div style={{ fontFamily: "Noto Sans Thai, sans-serif" }}>บันทึก</div>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
          }
        };



const Evaluation = () => {
    const location = useLocation();
    const studentID = localStorage.getItem("studentId");
    const { version } = location.state || {}; // รับค่าที่ส่งมา
    const [username, setUsername] = useState(null); // เก็บข้อมูลทั้งหมด

    const [coopData, setCoopData] = useState(null); // เก็บข้อมูลทั้งหมด
    const [studentInfo, setStudentInfo] = useState(null); // เก็บข้อมูลทั้งหมด
    const [evaluationData, setEvaluationData] = useState();

    const [isApprove, setIsApprove] = useState(null);
    const navigate = useNavigate();



      // ดึงข้อมูลจาก Backend
      useEffect(() => {
        const fetchCoopData = async () => {
          console.log(studentID, version);
      
          try {
            const response = await axios.get(`http://localhost:5000/user_info/${studentID}`);
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
            const response = await axios.get(`http://localhost:5000/coop_info/${studentID}`);
            console.log(response.data);
            setCoopData(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
      
          // ตรวจสอบว่ามี evaluation อยู่แล้วหรือไม่
          checkExistingEvaluation(studentID, version);
        };
        fetchCoopData();
      }, [studentID, version]);

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

      const checkExistingEvaluation = async (studentID, version) => {
        if(version === 1){
            try {
                const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'supervision'}/${'first'}`);
                console.log(response.data)
                if (response.data && response.data.evaluation_id) {
                  setEvaluationData({ evaluation_id: response.data.evaluation_id });
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
        }
        else if(version === 2){
            try {
                const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'supervision'}/${'second'}`);
                console.log(response.data)
                if (response.data && response.data.evaluation_id) {
                  setEvaluationData({ evaluation_id: response.data.evaluation_id });
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
        }
        else if(version === 3){
            try {
                const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'self_evaluate'}/${'first'}`);
                console.log(response.data)
                if (response.data && response.data.evaluation_id) {
                  setEvaluationData({ evaluation_id: response.data.evaluation_id });
                }
              } catch (error) {
                console.error('Error fetching evaluation data:', error);
              }
        }
        else if(version === 4){
          try {
              const response = await axios.get(`http://localhost:5000/evaluations/${studentID}/${'self_evaluate'}/${'second'}`);
              console.log(response.data)
              if (response.data && response.data.evaluation_id) {
                setEvaluationData({ evaluation_id: response.data.evaluation_id });
              }
            } catch (error) {
              console.error('Error fetching evaluation data:', error);
            }
      }
      };
      const handleAppoveInfo = async (version) => {
          console.log(version)
          try {
            const response = await axios.post('http://localhost:5000/addevaluation', {
              student_id: studentInfo.student_id,
              company_id: 1,
              evaluator_name: studentInfo.first_name +" "+ studentInfo.last_name,
              evaluate_by: 'student',
              evaluation_version: version,
              evaluation_for: 'student',
              evaluation_type: 'self_evaluate'
            });
        
            if (response.data && response.data.evaluation_id) {
              console.log('Data submitted successfully:', response.data);
              alert('บันทึกข้อมูลสำเร็จ!');
              setEvaluationData({ evaluation_id: response.data.evaluation_id }); // บันทึก evaluation_id ลงใน state
            } else {
              console.error('Invalid response from server');
              alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
          } catch (error) {
            console.error('Error submitting data:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
      }
 
      if(version === 1){
        return (
            <div className="background">
                <Sidebar/>
                <Banner/>
                <div className="main-container">
                    <div className="Side-Space"/>
                    <div className="petition-content-container">
                        <div className="request-header">
                            <div style={{flex:'1'}}>
                                <h1>แบบบันทึกการนิเทศงานสหกิจศึกษา</h1>
                            </div>
                            <div className="request-back" style={{flex:'1'}}>
                                <ReturnButton stroked="black"/>
                            </div>
                        </div>
                        <div className="petition-detail-container">
                            <div style={{marginTop:'20px'}}>
                                            <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                                <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                                <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>สำหรับการประเมินสถานประกอบการ (อาจารย์ประเมิน)</h1>
                                            </div>
                                            <div>
                                            {
                                                evaluationData && evaluationData.evaluation_id ? (
                                                    <FirstEvaluation evaluationID={evaluationData.evaluation_id} studentID={studentInfo.student_id}/>
                                                ) : (
                                                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                            <p style={{color:'#ddd'}}>รอการยืนยัน</p>
                                                    </div>
                                                )
                                            }               
                                            </div>
    
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        );
      }
      else if(version === 2){
        return (
            <div className="background">
                <Sidebar/>
                <Banner/>
                <div className="main-container">
                    <div className="Side-Space"/>
                    <div className="petition-content-container">
                        <div className="request-header">
                            <div style={{flex:'1'}}>
                                <h1>แบบบันทึกการนิเทศงานสหกิจศึกษา</h1>
                            </div>
                            <div className="request-back" style={{flex:'1'}}>
                                <ReturnButton stroked="black"/>
                            </div>
                        </div>
                        <div className="petition-detail-container">
                            <div style={{marginTop:'20px'}}>
                                            <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                                <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                                <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>สำหรับการประเมินสถานประกอบการ (อาจารย์ประเมิน)</h1>
                                            </div>
                                            <div>
                                            {
                                                evaluationData && evaluationData.evaluation_id ? (
                                                    <SecondEvaluation evaluationID={evaluationData.evaluation_id} studentID={studentInfo.student_id}/>
                                                ) : (
                                                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                            <p style={{color:'#ddd'}}>รอการยืนยัน</p>
                                                    </div>
                                                )
                                            }               
                                            </div>
    
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        );
      }
      else if(version === 3){
        if(!studentInfo || !coopData){
            return (
                <div className="background">
                    <Sidebar/>
                    <Banner/>
                    <div className="main-container">
                        <div className="Side-Space"/>
                        <div className="petition-content-container">
                            <div className="request-header">
                                <div style={{flex:'1'}}>
                                    <h1>แบบบันทึกการนิเทศงานสหกิจศึกษา</h1>
                                </div>
                                <div className="request-back" style={{flex:'1'}}>
                                    <ReturnButton stroked="black"/>
                                </div>
                            </div>
                            <div className="petition-detail-container">
                                            <div className="loading-text">กำลังโหลดข้อมูล...
                                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'20px'}}>
                                                    <div class="loader"></div>
                                                </div>
                                            </div>      
                            </div>
                        </div>
                    </div>
        
                </div>
            ); 
        }
        return (
            <div className="background">
                <Sidebar/>
                <Banner/>
                <div className="main-container">
                    <div className="Side-Space"/>
                    <div className="petition-content-container">
                        <div className="request-header">
                            <div style={{flex:'1'}}>
                                <h1>แบบบันทึกการนิเทศงานสหกิจศึกษา</h1>
                            </div>
                            <div className="request-back" style={{flex:'1'}}>
                                <ReturnButton stroked="black"/>
                            </div>
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
                                        {(evaluationData)?(
                                       <div style={{display: 'flex',alignItems: 'center',justifyContent: 'flex-start',marginTop:'10px'}}>
                                                    <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                        <input type="checkbox" id="cbx2" style={{display: 'none'}}/>
                                                        <label htmlFor="cbx2" className="check">
                                                        </label>
                                                    </div>
                                                    <p 
                                                
                                                        style={{fontSize:"12px"}}>ยืนยันการตรวจสอบและข้อมูลสหกิจศึกษาของนิสิตดังกล่าวแล้ว</p>
                                        </div>
                                        ):(
                                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'flex-start',marginTop:'10px'}}>
                                                        <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                            <input type="checkbox" id="cbx2" style={{display: 'none'}} onClick={() => handleAppoveInfo("first")} />
                                                            <label htmlFor="cbx2" className="check">
                                                            <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                                <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
                                                                <polyline points="1 9 7 14 15 4" />
                                                            </svg>
                                                            </label>
                                                        </div>
                                                        <p 
                                                    
                                                        style={{fontSize:"12px"}}>ยืนยันการตรวจสอบและข้อมูลสหกิจศึกษาของนิสิตดังกล่าว</p>
                                            </div>
                                        )}
                                    </div>
                            <div style={{marginTop:'20px'}}>
                                            <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                                <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                                <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>สำหรับการประเมินสถานประกอบการ (อาจารย์ประเมิน)</h1>
                                            </div>
                                            <div>
                                            {
                                                evaluationData && evaluationData.evaluation_id ? (
                                                    <SelfEvaluation evaluationID={evaluationData.evaluation_id} studentID={studentInfo.student_id}/>

                                                ) : (
                                                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                            <p style={{color:'#ddd'}}>รอการยืนยัน</p>
                                                    </div>
                                                )
                                            }               
                                            </div>
    
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        );
      }
      else if(version === 4){
        if(!studentInfo || !coopData){
            return (
                <div className="background">
                    <Sidebar/>
                    <Banner/>
                    <div className="main-container">
                        <div className="Side-Space"/>
                        <div className="petition-content-container">
                            <div className="request-header">
                                <div style={{flex:'1'}}>
                                    <h1>แบบบันทึกการนิเทศงานสหกิจศึกษา ครั้งที่ 2</h1>
                                </div>
                                <div className="request-back" style={{flex:'1'}}>
                                    <ReturnButton stroked="black"/>
                                </div>
                            </div>
                            <div className="petition-detail-container">
                                            <div className="loading-text">กำลังโหลดข้อมูล...
                                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginTop:'20px'}}>
                                                    <div class="loader"></div>
                                                </div>
                                            </div>      
                            </div>
                        </div>
                    </div>
        
                </div>
            ); 
        }
        return (
            <div className="background">
                <Sidebar/>
                <Banner/>
                <div className="main-container">
                    <div className="Side-Space"/>
                    <div className="petition-content-container">
                        <div className="request-header">
                            <div style={{flex:'1'}}>
                                <h1>แบบบันทึกการนิเทศงานสหกิจศึกษา ครั้งที่ 2</h1>
                            </div>
                            <div className="request-back" style={{flex:'1'}}>
                                <ReturnButton stroked="black"/>
                            </div>
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
                                        {(evaluationData)?(
                                       <div style={{display: 'flex',alignItems: 'center',justifyContent: 'flex-start',marginTop:'10px'}}>
                                                    <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                        <input type="checkbox" id="cbx2" style={{display: 'none'}}/>
                                                        <label htmlFor="cbx2" className="check">
                                                        </label>
                                                    </div>
                                                    <p 
                                                
                                                     style={{fontSize:"12px"}}>ยืนยันการตรวจสอบและข้อมูลสหกิจศึกษาของนิสิตดังกล่าวแล้ว</p>
                                        </div>
                                        ):(
                                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'flex-start',marginTop:'10px'}}>
                                                        <div style={{marginRight:'10px',marginTop:'5px'}}>
                                                            <input type="checkbox" id="cbx2" style={{display: 'none'}} onClick={() => handleAppoveInfo("second")} />
                                                            <label htmlFor="cbx2" className="check">
                                                            <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                                <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z" />
                                                                <polyline points="1 9 7 14 15 4" />
                                                            </svg>
                                                            </label>
                                                        </div>
                                                        <p 
                                                    
                                                        style={{fontSize:"12px"}}>ยืนยันการตรวจสอบและข้อมูลสหกิจศึกษาของนิสิตดังกล่าว</p>
                                            </div>
                                        )}
                                    </div>
                            <div style={{marginTop:'20px'}}>
                                            <div style={{display: 'flex',justifyContent: 'flex-start',alignItems: 'center',flex:'1'}}>
                                                <div className="sub-header-square" style={{backgroundColor:'#46E10E'}}/>
                                                <h1 className="table-title" style={{fontWeight:'400',fontSize:'18px',fontFamily:"Noto Sans Thai, sans-serif"}}>สำหรับการประเมินสถานประกอบการ (อาจารย์ประเมิน)</h1>
                                            </div>
                                            <div>
                                            {
                                                evaluationData && evaluationData.evaluation_id ? (
                                                    <SelfEvaluation_2 evaluationID={evaluationData.evaluation_id} studentID={studentInfo.student_id}/>

                                                ) : (
                                                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                            <p style={{color:'#ddd'}}>รอการยืนยัน</p>
                                                    </div>
                                                )
                                            }               
                                            </div>
    
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        );
      }
}

export default Evaluation;
