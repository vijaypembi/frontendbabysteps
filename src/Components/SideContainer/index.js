// import { useState } from "react";
import "./index.css";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SideContainer = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path); // Navigate to the given path
    };

    return (
        <div className="side-main-container">
            <div className="side-dashbord">
                <IoHomeOutline />
                <span className="side-dashbord-name">Dashboard</span>
            </div>

            <div className="side-options" onClick={() => handleNavigate("/")}>
                Doctor Details
            </div>

            <div
                className="side-options"
                onClick={() => handleNavigate("/appointments")}
            >
                My Appointments
            </div>
        </div>
    );
};

export default SideContainer;
