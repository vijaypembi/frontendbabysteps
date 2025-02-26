import { useEffect, useState } from "react";
import SideContainer from "../SideContainer";
// import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { FaArrowRotateRight } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import moment from "moment";
import AppointmentForm from "../AppointmentForm";

const AllAppointments = () => {
    const [allAllAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({});
    const [doctorDetails, setDoctorDetails] = useState({});
    const [appointmentId, setAppointmentId] = useState("");

    //const navigate = useNavigate();
    useEffect(() => {
        getAllAppointments();
    }, []);
    const getAllAppointments = async () => {
        try {
            setLoading(true);
            const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/appointments/`;
            const response = await fetch(baseUrl);
            const data = await response.json();
            setAllAppointments(data);
            setError("");
            // console.log(data); // Ensure data is set correctly
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (eachAppi) => {
        // DELETE /appointments/:id http://localhost:5000

        try {
            const Baseurl = `${process.env.REACT_APP_BASE_URL}/api/appointments/${eachAppi._id}`;
            const options = {
                method: "DELETE",
            };
            const response = await fetch(Baseurl, options);
            const data = await response.json();
            if (response.ok) {
                toast.success("Appointment slot Canceled successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                });
                getAllAppointments();
            } else {
                toast.error(`${data.error} ${data.suggestion}`, {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.", {
                position: "top-center",
                autoClose: 3000,
            });
            console.log(error);
        }
    };

    const handleUpdateAppointment = (eachAppi) => {
        setAppointmentId(eachAppi._id);
        setDoctorDetails(eachAppi.doctorId);
        setAppointmentDetails({
            selectedTime: moment(eachAppi.date).format("HH:mm"),
            selectedDate: moment(eachAppi.date).format("YYYY-MM-DD"),
            patientName: eachAppi.patientName,
            notes: eachAppi.notes,
            appointmentType: eachAppi.appointmentType,
            duration: eachAppi.duration,
        });
        setShowForm(true);
    };
    const updateAppointment = async (updateFormData) => {
        try {
            const Baseurl = `${process.env.REACT_APP_BASE_URL}/api/appointments/${appointmentId}`;
            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateFormData),
            };
            const response = await fetch(Baseurl, options);
            const data = await response.json();
            if (response.ok) {
                toast.success("Appointment slot updated successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                });
                // navigate("/");
            } else {
                toast.error(`${data.error} ${data.suggestion}`, {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.", {
                position: "top-center",
                autoClose: 3000,
            });
            console.log(error);
        }
    };
    const showAllAppointments = () => {
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
                        onClick={() => getAllAppointments()}
                        className="loader-error-icon"
                    >
                        <FaArrowRotateRight />
                    </div>
                </div>
            );
        if (!allAllAppointments.length)
            return (
                <div className="loader-container">
                    No appointment available!
                </div>
            );
        return (
            <ul className="appointment-container">
                {allAllAppointments.map((each) => (
                    <li key={each._id} className="appointment-card">
                        <div className="card-header">
                            <h2>Upcoming Appointment</h2>
                            <div className="physician-section">
                                <div className="doctor-avatar">MS</div>
                                <div className="doctor-info">
                                    <h3 className="doctor-name">
                                        {each.doctorId.name}
                                    </h3>
                                    <p className="doctor-specialization">
                                        {each.doctorId.specialization}
                                    </p>
                                    <p className="doctor-specialization">
                                        {`Available: `}
                                        {each.doctorId.workingHours.start}
                                        {"-"}
                                        {each.doctorId.workingHours.end}
                                    </p>
                                </div>
                            </div>
                            <div className="appointment-button-container">
                                <button
                                    onClick={() =>
                                        handleCancelAppointment(each)
                                    }
                                    className="appointment-cancel-button"
                                >
                                    Cancel Appointment
                                </button>
                                <button
                                    onClick={() =>
                                        handleUpdateAppointment(each)
                                    }
                                    className="appointment-cancel-button"
                                >
                                    Update Appointment
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="appointment-details">
                                <div className="detail-item">
                                    <i className="fas fa-calendar-alt"></i>
                                    <div>
                                        <p>
                                            {moment
                                                .utc(each.date)
                                                .format("MMMM D, YYYY")}{" "}
                                            {moment
                                                .utc(each.date)
                                                .format("h:mm A")}
                                        </p>
                                        <small>
                                            {each.duration} Minutes Duration
                                        </small>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <i className="fas fa-clock"></i>
                                    <div>
                                        <p>{each.patientName}</p>
                                        <small>{each.appointmentType}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="notes-section">
                                <p>{each.notes}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <ToastContainer />
            <div
                className={`${
                    showForm
                        ? "all-appointment-main-container-blurred"
                        : "all-appointment-main-container"
                }`}
            >
                <SideContainer />
                <div className="all-appointment-center-container">
                    {showAllAppointments()}
                </div>
            </div>
            {showForm && (
                <div>
                    <AppointmentForm
                        appointmentDetails={appointmentDetails}
                        doctorDetails={doctorDetails}
                        onSubmit={updateAppointment}
                        onClose={() => setShowForm(false)}
                    />
                </div>
            )}
        </div>
    );
};
export default AllAppointments;
