import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (count) => {
    const colors = [];
    const hueStep = 360 / count; // แบ่งสัดส่วนสีเท่าๆ กันบนวงล้อสี
    
    for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    
    return colors;
  };

const ToolsDonutChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 1,
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tools-distribution');
        const toolsData = response.data;

        // เตรียมข้อมูลสำหรับ Donut Chart
        setChartData({
          labels: toolsData.map(item => item.tool),
          datasets: [{
            data: toolsData.map(item => item.percentage),
            backgroundColor: generateColors(toolsData.length),
            borderColor: '#fff',
            borderWidth: 2,
          }]
        });
      } catch (error) {
        console.error('Error fetching tools data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
          left: 0,
          right: 50, // ระยะห่างด้านขวา
          top: 0,
          bottom: 0
        }
      },
    plugins: {
      legend: {
        position: 'left',
        align: 'start',
        labels: {
          font: {
            family: "'Noto Sans Thai', sans-serif",
            size: 14,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        },
      },
      tooltip: {
        callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}%`;
            }}
      },
      // เพิ่มข้อความตรงกลาง
      title: {
        font: {
          family: "'Noto Sans Thai', sans-serif",
          size: 14,
          weight: '500'
        },
        display: true,
        position: 'bottom'
      },
      padding: {
        right: 20 
      }
    },
    cutout: '70%',
  };
  
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{

        width: '100%', 
        maxWidth: '800px',
    }}>
        <div style={{fontFamily:'Noto Sans Thai,serif', height: '260px', padding: '20px' }}>
            <Doughnut
            data={chartData}
            options={options}
            />
        </div> 
    </div>
  );
};

export default ToolsDonutChart;