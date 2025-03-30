import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const JobDistributionChart = () => {
  const [data, setData] = useState([]);
  const[loading,setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/job-distribution');
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // หาค่าเปอร์เซ็นต์สูงสุดเพื่อกำหนดความกว้างสูงสุด
  const maxPercentage = Math.max(...data.map(item => item.percentage), 0);

  if (loading) 
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress />
        </div>
  );

  return (
    <div style={{ 
      width: '800px', 
      margin: '0 auto',
      fontFamily: 'Noto Sans Thai, sans-serif'
    }}>
      
      <div style={{ marginLeft: '10px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: '25px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '120px',
                fontWeight: 'bold',
                marginRight: '10px',
                textAlign: 'right'
              }}>
                {item.job_description}
              </span>
              <span style={{
                display: 'inline-block',
                width: '50px',
                textAlign: 'right',
                marginRight: '10px'
              }}>
                {item.percentage}%
              </span>
              <div style={{
                width: `${(item.percentage / maxPercentage) * 100}%`,
                height: '40px',
                backgroundColor: getColor(index),
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '10px',
                color: 'white',
                fontWeight: 'bold',
                minWidth: '30px'
              }}>
                {item.percentage}%
              </div>
            </div>
          </div>
        ))}
        
        {/* แสดงแกน X */}
        <div style={{
          display: 'flex',
          marginLeft: '180px',
          marginTop: '10px'
        }}>
          {[0, 10, 20, 30, 40, 50].map((num) => (
            <div key={num} style={{
              width: `${100/5}%`,
              textAlign: 'center',
              color: '#666'
            }}>
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ฟังก์ชันสร้างสีต่างกันสำหรับแต่ละแท่ง
const getColor = (index) => {
  const colors = [
    '#4e79a7', // สีน้ำเงิน
    '#f28e2b', // สีส้ม
    '#e15759', // สีแดง
    '#76b7b2', // สีฟ้าอมเขียว
    '#59a14f'  // สีเขียว
  ];
  return colors[index % colors.length];
};



export default JobDistributionChart;