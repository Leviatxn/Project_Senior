import React from "react";
import AdminSidebar from "./Component/AdminSidebar";
import './Admin_Home.css';
import '../Main.css';
import AdminHeader from "./Component/AdminHeader";
import './Admin_Cooperative.css';

const Admin_Cooperative = () => {
    const year = new Date().toLocaleDateString("th-TH", {
        year: "numeric"
      });
    const today = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
        <div className="home-background">
            <AdminSidebar   />
            <AdminHeader/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="admin-cooperative-content-container">
                    <div className="admin-cooperative-content-box">
                        <div className="admin-cooperative-header" >
                            <div >
                                <h1 style={{fontSize:'26px',marginBottom:'0'}}>การฝึกงานสหกิจศึกษา</h1>
                                <p style={{marginTop:'10px',color:'#006765'}}>วันที่ {today}</p>
                            </div>
                            <div className="cooperative-detail">
                                <a href="/cooperative-detail">รายละเอียดการฝึกงานสหกิจ</a>
                            </div>
                        </div>
                        <div className="admin-cooperative-main-content" >
                                <div className="coop-document-box">
                                    <div className="sub-header">
                                        <div className="sub-header-square" />
                                        <h3 style={{fontSize:'18px'}}>เอกสารฝึกงาน</h3>
                                    </div>
                                    <div className="petition-underline" />
                                    <div className="coop-document-menu">
                                        <nav>
                                            <ul>
                                                <li>
                                                    <a href="/petition/request-a">
                                                        หนังสือส่งตัว
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/petition/request-a">
                                                        กฎการฝึกงาน
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/petition/request-b">
                                                        แบบฟอร์มต่างๆที่เกี่ยวข้อง
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="admin-coop-table-box" style={{flex: '8',marginLeft: '20px'}}>
                                    <div className="sub-header">
                                        <div className="sub-header-square" />
                                        <h3 style={{fontSize:'18px'}}>การฝึกงานและสถานการฝึกงาน</h3>
                                    </div>
                                </div>
                        </div>  
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Admin_Cooperative;
