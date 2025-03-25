import React from "react";
import Sidebar from "./Component/Sidebar";
import Banner from "./Component/ฺBanner";
import './Home.css';
import '../Main.css';
import './Profile.css';
import UserProfile from "./Component/UserProfile";
const Profile = () => {

    return (
        <div className="profile-background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="profile-content-container">
                    <div className="profile-container">
                        <div className="profile-box">
                            <UserProfile/>
                        </div>
                    </div> 

                </div>
            </div>

        </div>
    );
}

export default Profile;
