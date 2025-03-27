import React from 'react';
import './CompanyHeader.css';

const CompanyHeader = () => {
  return (
    <div>
      <div className="company-header" style={{background:'#A60003'}}>
        <h3 style={{fontWeight: '500',color:'white',marginLeft:'15%'}}>ระบบสหกิจศึกษามหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา</h3>
      </div>
    </div>
  );
};

export default CompanyHeader;