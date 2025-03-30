import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { CircularProgress } from '@mui/material';

// ลงทะเบียนคอมโพเนนต์ Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MostCoopProvince = () => {
  const [provinceData, setProvinceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students-per-province');
        setProvinceData(response.data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <CircularProgress />
        </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;

  // หาจังหวัดที่มีจำนวนสูงสุด
  const topProvince = provinceData[0] || {};
  const comparisonPercentage = 18;


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      
      {/* สถิติหลัก */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-lg">
          <div style={{paddingLeft:'20px',paddingRight:'120px'}}>
            <span style={{fontSize:'14px',color:'#AEAEAE'}}>จังหวัดที่มีนิสิตมหาวิทยาลัยเกษตรศาสตร์ สาขา วิศวกรรมคอมพิวเตอร์ ฝึกงานสหกิจมากที่สุด</span>

          </div>
          <div style={{display:'flex',paddingLeft:'20px',paddingBottom:'20px',borderBottom:'2px solid #ECECEC'}}>
            <h1  style={{fontSize:'28px' ,color:'#5687F2'}}>{topProvince.province || 'กรุงเทพมหานคร'}</h1> 
            <h1 style={{fontSize:'28px',color:'#5687F2'}}>{topProvince.student_count || 0} คน</h1>
          </div>
        </p>
        {/* <p className="text-lg mt-2">
          เยอะกว่าจังหวัดอื่นๆ <span className="font-bold">{comparisonPercentage}%</span>
        </p>
        <p className="text-lg">
          อัตราการฝึกงาน: <span className="font-bold">90%</span>
        </p> */}
      </div>
    </div>
  );
};

export default MostCoopProvince;