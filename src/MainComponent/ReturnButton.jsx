import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReturnButton = ({stroked = 'white'}) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      style={{ 
        background:'none',
        border: 'none', 
        padding: '10px', 
        borderRadius: '8px',
        cursor: 'pointer'
      }}
    >
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={stroked} // เปลี่ยนสีเส้นเป็นขาว
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M9 15L4 10L9 5" />
        <path d="M4 10H16C18.5 10 21 12 21 15C21 18 18.5 20 16 20H13" />
      </svg>
    </button>
  );
};

export default ReturnButton;