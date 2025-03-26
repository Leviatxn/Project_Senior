import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const InternshipByProvinceDonut = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }]
  });

  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students-per-province');
        const provinces = response.data;

        if (provinces.length > 0) {
          const total = provinces.reduce((sum, item) => sum + item.student_count, 0);
          setTotalStudents(total);

          const backgroundColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
          ];

          setChartData({
            labels: provinces.map(item => item.province),
            datasets: [{
              data: provinces.map(item => item.student_count),
              backgroundColor: backgroundColors.slice(0, provinces.length),
              hoverBackgroundColor: backgroundColors.slice(0, provinces.length),
              borderWidth: 1
            }]
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          // ปรับแต่ง Legend ให้แสดงแบบ "จังหวัด X คน"
          generateLabels: (chart) => {
            const { data } = chart;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label} ${data.datasets[0].data[i]} คน`, // แสดงชื่อจังหวัดและจำนวน
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: '#fff',
                lineWidth: 1,
                hidden: false,
                index: i
              }));
            }
            return [];
          },
          font: {
            fontFamily: 'Noto Sans Thai, sans-serif',
            size: 14,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalStudents > 0 
              ? Math.round((value / totalStudents) * 100) 
              : 0;
            return `${label}: ${value} คน (${percentage}%)`;
          }
        }
      },
      // เพิ่มข้อความตรงกลาง
      title: {
        display: true,
        text: `รวมทั้งหมด ${totalStudents} คน`,
        position: 'bottom'
      }
    },
    cutout: '50%',
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px', 
      margin: '0 auto',
      position: 'relative' 
    }}>
      
      <h3 style={{ textAlign: 'center' }}>สัดส่วนนิสิตฝึกงานแบ่งตามจังหวัด</h3>
      <div style={{ height: '400px', padding: '20px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default InternshipByProvinceDonut;