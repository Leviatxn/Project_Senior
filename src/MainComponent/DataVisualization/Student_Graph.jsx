import React, { useEffect, useState } from "react";
import axios from "axios";
import { colors, Container } from "@mui/material";
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const StudentEvaluation_Chart = ({ evaluationID, studentID }) => {
  const [responses, setResponses] = useState({});
  const [sectionScores, setSectionScores] = useState({});

  const [evaluationData, setEvaluationData] = useState([]);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const SectionRadarChart = ({ sectionScores }) => {
    console.log(sectionScores)
    const data = prepareRadarChartData(sectionScores);
    console.log(data)
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '300px',
        position: 'relative'
      }}>
        <Radar data={data} options={options} />
      </div>
    );
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0)',
        },
        grid: {
          color: '#CCCCCC',
        },
        ticks: {
          count: 5,
          display: false,
        },
        pointLabels: {
          font: {
            size: 12,
            },
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `คะแนน: ${context.raw}`;
          },
        },
      },
      legend: {
        display: false,
        position: 'top',
        labels: {
          font: {
            size: 11,
          },
          color: 'rgba(0, 0, 0)',
        },
      },
    },
  };
  const calculateAverageSectionScores = (apiData, evaluationData) => {
    console.log("API Data:", apiData);
    console.log("Evaluation Data:", evaluationData);
  
    if (!apiData || apiData.length === 0 || !evaluationData) return [];
  
    // สร้าง Map สำหรับเก็บ section names จาก evaluationData
    const sectionNameMap = new Map();
    evaluationData.forEach(section => {
      sectionNameMap.set(section.section_id, section.section_name);
    });
  
    // กลุ่มข้อมูลตาม section_id
    const sectionMap = apiData.reduce((acc, item) => {
      const sectionId = item.section_id;
      
      if (!acc[sectionId]) {
        acc[sectionId] = {
          sectionName: sectionNameMap.get(sectionId), // ดึงชื่อจาก evaluationData
          total: 0,
          count: 0
        };
      }
      
      if (typeof item.score === 'number') {
        acc[sectionId].total += item.score;
        acc[sectionId].count++;
      }
      
      return acc;
    }, {});
  
    // คำนวณค่าเฉลี่ย
    return Object.entries(sectionMap).map(([sectionId, data]) => ({
      sectionId: Number(sectionId),
      sectionName: data.sectionName,
      averageScore: data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 0
    }));
  };
  
  const prepareRadarChartData = (sectionScores) => {
    const labels = sectionScores.map((section) => section.sectionName);
    const data = sectionScores.map((section) => section.averageScore);


    return {
      labels: labels,
      datasets: [
        {
          label: 'คะแนนเฉลี่ย',
          data: data,
          backgroundColor: 'rgba(70, 225, 14, 0.64)',
          borderColor: '#006765',
          borderWidth: 2,
        },
      ],
    };
  };

  const fetchScores = async (evaluationID,data) => {
    try {
      const response = await axios.get(`http://localhost:5000/evaluation_scores_bytype/${evaluationID}`);
      const sectionAverages = calculateAverageSectionScores(response.data,data);
      setSectionScores(sectionAverages); // เก็บผลลัพธ์โดยตรง
      setIsEvaluated(true);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get('http://localhost:5000/selfEvaluation_sections_ForChart');
        const sections = sectionsResponse.data;
        console.log( sectionsResponse.data)

        const data = await Promise.all(sections.map(async (section) => {
          const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
          return {
            ...section,
            subcategories: criteriaResponse.data,
          };
        }));
        setEvaluationData(data);

        if (evaluationID) {
          await fetchScores(evaluationID,data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [evaluationID]);


  if (!isEvaluated || !evaluationData || sectionScores.length === 0) {
    return <div>กำลังดึงข้อมูล...</div>;
  }

  return (
    <div>
      <Container>
        <SectionRadarChart sectionScores={sectionScores} />
      </Container>
    </div>
  );
};

export default StudentEvaluation_Chart;