import React from "react";
import Sidebar from "./Component/Prof_Sidebar";
import Banner from "./Component/ฺBanner";
import './Prof_Home.css';
import '../Main.css';
import './Prof_Petition.css';
import PetitionTable from "./Component/PetitionTable";
const Prof_Petition = () => {

    return (
        <div className="prof-petition">
            <div className="background">
            <Sidebar/>
            <Banner/>
            <div className="main-container">
                <div className="Side-Space"/>
                <div className="home-content-container">
                    <div className="petition-table-container">
                        <div className="petition-table-box">
                            <PetitionTable/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
    );
}

export default Prof_Petition;
