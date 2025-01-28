import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import '../Main.css';
import './Profile.css';
import StudentInfoForm from "./Component/StudentInfoForm";
const Profile = () => {

    return (
        <div className="profile-background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="profile-content-container">
                    <div className="profile-header">
                        <h1>ข้อมูลนิสิต</h1>
                        <div className="profile-edit">
                            <a href="/profile-edit">แก้ไขข้อมูล</a> 
                        </div>
                    </div> 
                    <div className="profile-container">
                        <div className="profile-box">
                            <StudentInfoForm/>
                        </div>
                    </div> 

                </div>
            </div>

        </div>
    );
}

export default Profile;
