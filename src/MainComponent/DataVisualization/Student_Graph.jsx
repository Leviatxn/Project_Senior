import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SelfEvaluation_Chart = ({ evaluationID, studentID }) => {
  const [responses, setResponses] = useState({});
  const [evaluationData, setEvaluationData] = useState([]);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const SectionRadarChart = ({ sectionScores }) => {
    const data = prepareRadarChartData(sectionScores);
    return (
      <div style={{ width: '500px', height: '500px' }}>
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
            size: 14,
          },
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `คะแนน: ${context.raw}`;
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: 'rgba(0, 0, 0, 0.8)',
        },
      },
    },
  };

  const calculateAverageSectionScores = (evaluationData, responses) => {
    return evaluationData.map((section) => {
      const totalScore = section.subcategories.reduce((sum, sub) => {
        const score = responses[section.section_name]?.[sub.criteria_text] || 0;
        return sum + score;
      }, 0);
      const averageScore = totalScore / section.subcategories.length;
      return {
        sectionName: section.section_name,
        averageScore: averageScore,
      };
    });
  };

  const prepareRadarChartData = (sectionScores) => {
    const labels = sectionScores.map((section) => section.sectionName);
    const data = sectionScores.map((section) => section.averageScore);
    if(sectionScores.section.sectionName === "การพัฒนาตนเอง"){
        console.log("การพัฒนาตนเอง")
    }

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

  const fetchScores = async (evaluationID) => {
    try {
      const response = await axios.get(`http://localhost:5000/evaluation_scores/${evaluationID}`);
      if (response.data) {
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
        setIsEvaluated(true);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get('http://localhost:5000/selfEvaluation_sections_ForChart');
        const sections = sectionsResponse.data;

        const data = await Promise.all(sections.map(async (section) => {
          const criteriaResponse = await axios.get(`http://localhost:5000/criteria/${section.section_id}`);
          return {
            ...section,
            subcategories: criteriaResponse.data,
          };
        }));
        setEvaluationData(data);

        if (evaluationID) {
          await fetchScores(evaluationID);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [evaluationID]);

  const sectionScores = calculateAverageSectionScores(evaluationData, responses);

  if (!isEvaluated || sectionScores.length === 0) {
    return <div>กำลังดึงข้อมูล...</div>;
  }

  return (
    <div>
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
        <SectionRadarChart sectionScores={sectionScores} />
      </Container>
    </div>
  );
};

export default SelfEvaluation_Chart;