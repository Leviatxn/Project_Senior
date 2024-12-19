import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Section ซ้าย */}
      <div className="login-sidebar">
        <div className='role-container'>

        </div>
        <div className="login-main_container">
            <div class="ku-coop-title">
            <h1 class="text-base">
                K<span class="text-overlay">U - CO</span>OP
            </h1>
            </div>

            <p className="subtitle">
                ระบบสหกิจศึกษา
            </p>
            <p className="sub-desciption">
                มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา
            </p>
            <h2 className="nisit-title">นิสิต</h2>
            <p className="login-text">เข้าสู่ระบบ</p>

            {/* ฟอร์ม */}
            <form className="login-form">
            <div className="input-group">
                <label htmlFor="studentId">เลขประจำตัวนิสิต</label>
                <input
                type="text"
                id="studentId"
                placeholder="รหัสประจำตัวนิสิต"
                />
            </div>
            <div className="input-group">
                <label htmlFor="password">รหัสผ่าน</label>
                <input type="password" id="password" placeholder="รหัส" />
            </div>
            <button type="submit" className="submit-button">
                เข้าสู่ระบบ
            </button>
            <a href="/forgot-password" className="forgot-password-link">
                ลืมรหัสผ่าน
            </a>
            </form>
        </div>
        <div className='register-container'>
            <div className="extra-links">
                <a href="/register">ลงทะเบียนผู้ใช้ใหม่</a> |{' '}
                <a href="/contact">ติดต่อเจ้าหน้าที่</a>
            </div>
        </div>
      </div>


      <div className="login-background"></div>
    </div>
  );
};

export default LoginPage;
