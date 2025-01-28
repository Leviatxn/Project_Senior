import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReturnButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า
  };

  return (
    <button onClick={goBack} style={{ border: 'none', background: 'none' }}>
      <img src="/public/return.png" alt="กลับ" style={{ width: '40px', height: '40px', cursor: 'pointer' }} />
    </button>
  );
};

export default ReturnButton;
