import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div>
      <div className="cooparative-logo">
        <h1>ระบบสหกิจศึกษา</h1>
        <h3>มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา</h3>
      </div>
      <div className="banner">
        <img
          src="https://f.ptcdn.info/733/062/000/pnoio4d43GZwZyS89zZ-o.jpg"
          alt="Banner"
          className="banner-image"
        />
      </div>
    </div>
  );
};

export default Banner;