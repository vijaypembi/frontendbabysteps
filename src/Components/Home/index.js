import { useEffect, useState } from "react";
import SideContainer from "../SideContainer";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { FaArrowRotateRight } from "react-icons/fa6";

import "./index.css";

const Home = () => {
    const [allDoctorDetails, setAllDoctorsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        getAllDoctorDetails();
    }, []);
    const getAllDoctorDetails = async () => {
        try {
            setLoading(true);
            const baseUrl = "http://localhost:5000/api/doctors/";
            const response = await fetch(baseUrl);
            const data = await response.json();
            setAllDoctorsData(data);
            setError("");
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOnViewSlots = (doctorId) => {
        const selectedDate = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" in local time
        navigate(`/doctors/${doctorId}/slots?date=${selectedDate}`);
    };

    const showAllDoctorDetails = () => {
        if (loading)
            return (
                <div className="loader-container">
                    <ScaleLoader color="#43389e" height="30px" width="10px" />
                </div>
            );
        if (error)
            return (
                <div className="loader-container loader-error">
                    <p className="loader-error-message">
                        Something went wrong! Try Again
                    </p>
                    <div
                        onClick={() => getAllDoctorDetails()}
                        className="loader-error-icon"
                    >
                        <FaArrowRotateRight />
                    </div>
                </div>
            );
        if (!allDoctorDetails.length)
            return (
                <div className="loader-container">No doctors available!</div>
            );

        return (
            <div>
                <ul className="doctors-main-container">
                    {allDoctorDetails?.map((eachDoctor) => (
                        <li
                            key={eachDoctor._id}
                            className="each-doctor-container"
                        >
                            <div className="each-doctor-left">
                                <h3 className="each-doctor-name">
                                    {eachDoctor.name}
                                </h3>
                                <p className="each-doctor-spelization">
                                    Specialization: {eachDoctor.specialization}
                                </p>
                            </div>
                            <div className="each-doctor-right">
                                <div className="availability-status">
                                    <span>
                                        {eachDoctor.name} Available Timings
                                    </span>
                                </div>
                                <div className="working-hours">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>
                                        {eachDoctor.workingHours.start} –
                                        {eachDoctor.workingHours.end}
                                    </span>
                                </div>
                                <button
                                    onClick={() =>
                                        handleOnViewSlots(eachDoctor._id)
                                    }
                                    className="each-doctor-button"
                                >
                                    View Available Slots
                                </button>
                            </div>
                            {/* <div className="each-doctor-right">
                                <p className="each-doctor-timings">{`${eachDoctor.name} is Available in between ${eachDoctor.workingHours.start} , ${eachDoctor.workingHours.end}`}</p>
                                <button className="each-doctor-button">
                                    Book Appointment
                                </button>
                            </div> */}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    return (
        <div className="home-main-container">
            <SideContainer />
            <div className="home-middle-container">
                {showAllDoctorDetails()}
            </div>
        </div>
    );
};

export default Home;
