import SideContainer from "../SideContainer";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { FaArrowRotateRight } from "react-icons/fa6";
import moment, { duration } from "moment";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppointmentForm from "../AppointmentForm";

const DoctorDetails = () => {
    const { id } = useParams(); // Get doctorId from URL
    const [searchParams] = useSearchParams();
    const today = searchParams.get("date");
    //const today = new Date().toISOString().split("T")[0]; // Get date query param
    const [selectedDate, setSelectedDate] = useState("");

    const [slotDetails, setSlotDetails] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    // selectedTime is in format of 2025-02-26T05:30:00.000Z is form slotDetails but date in 'YYYY-MM-DD' Format because it get from date picker
    const getSlotDuration = () => {
        const index = slotDetails.indexOf(selectedTime);

        if (index === -1) return 0; // Selected time not found
        if (index >= slotDetails.length - 1) {
            // If it's the last slot, use default duration
            return 10; // or your default duration
        }

        const nextSlot = slotDetails[index + 1];
        return moment(nextSlot).diff(moment(selectedTime), "minutes");
    };
    const appointmentDetails = {
        selectedTime: moment(selectedTime).format("HH:mm"),
        selectedDate,
        duration: getSlotDuration(),
        patientName: "",
        appointmentType: "",
        notes: "",
    };

    const getAllSlotDetails = async (givenDate) => {
        try {
            setLoading(true);
            //const date = moment(timestamp).format("YYYY-MM-DD"); // "2025-02-25"
            // moment(eachSlot).format("HH:mm")
            const baseUrl = `http://localhost:5000/api/doctors/${id}/slots?date=${givenDate}`;
            const response = await fetch(baseUrl);
            const data = await response.json();
            setSlotDetails(data.slots);
            setDoctorDetails(data.doctor);
            setError("");
            console.log(data);
        } catch (error) {
            setError(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleDateChange = (e) => {
        setSelectedDate(moment(e.target.value).format("YYYY-MM-DD")); // intially we get only date form time picker
        setSelectedTime("");
        getAllSlotDetails(moment(e.target.value).format("YYYY-MM-DD"));
        // moment(timestamp).format("YYYY-MM-DD")
        // console.log(e.target.value);
    };

    useEffect(() => {
        setSelectedDate(today); // for alowing button intially
        getAllSlotDetails(today);
    }, [id]);

    const handleSubmit = async (updateFormData) => {
        // Handle form submission

        //console.log("Appointment Data:", formData);
        try {
            const Baseurl = "http://localhost:5000/api/appointments/";
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateFormData),
            };
            const response = await fetch(Baseurl, options);
            const data = await response.json();
            if (response.ok) {
                toast.success("Appointment slot booked successfully!", {
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

    const showDoctorSlotsDetails = () => {
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
                        Somthing Went to Wrong Try Again
                    </p>
                    <div
                        onClick={() => getAllSlotDetails()}
                        className="loader-error-icon"
                    >
                        <FaArrowRotateRight />
                    </div>
                </div>
            );
        if (!slotDetails.length)
            return (
                <div className="loader-container">No slots are available!</div>
            );

        return (
            <div>
                <div className="doctor-profile">
                    <img
                        src={"/assets/doctorDefault.jpg"}
                        className="doctor-photo"
                        alt="doctor-profile"
                    />
                    <div className="doctor-info">
                        <h2>{doctorDetails.name}</h2>
                        <div className="doctor-specialty">
                            {doctorDetails.specialization}
                        </div>
                        <div className="doctor-experience">
                            10+ years experience • 4.9/5 rating
                        </div>
                    </div>
                </div>

                <div className="doctor-select-appointment-container">
                    <h2 className="doctor-select-date-name">
                        Select Appointment Date and Time
                    </h2>
                    <input
                        value={selectedDate}
                        onChange={handleDateChange}
                        type="date"
                        className="doctor-date-picker"
                    />
                </div>
                <ul className="time-slots-container">
                    {slotDetails.map((eachSlot) => (
                        <button
                            key={slotDetails.indexOf(eachSlot)}
                            onClick={() => setSelectedTime(eachSlot)}
                            className="time-slots-available"
                        >
                            {`${moment(eachSlot).format("HH:mm")} - ${
                                slotDetails[slotDetails.indexOf(eachSlot) + 1]
                                    ? moment(
                                          slotDetails[
                                              slotDetails.indexOf(eachSlot) + 1
                                          ]
                                      ).format("HH:mm")
                                    : "End"
                            }`}
                        </button>
                    ))}
                </ul>

                {/* <!-- Booking Controls --> */}
                <div className="booking-controls">
                    <div className="selected-time">
                        Selected time: {selectedDate}/
                        {moment(selectedTime).format("HH:mm") !== "Invalid date"
                            ? moment(selectedTime).format("HH:mm")
                            : "Select Time"}
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="book-button"
                        disabled={!(selectedDate && selectedTime)}
                    >
                        Book Appointment
                    </button>
                </div>
            </div>
        );
    };
    return (
        <div>
            <ToastContainer />
            <div
                className={`${
                    showForm
                        ? "doctor-details-main-container-blurred"
                        : "doctor-details-main-container"
                }`}
            >
                <SideContainer />

                <div className="doctor-details-center-container">
                    {showDoctorSlotsDetails()}
                </div>
            </div>

            {showForm && (
                <div>
                    <AppointmentForm
                        appointmentDetails={appointmentDetails}
                        doctorDetails={doctorDetails}
                        onSubmit={handleSubmit}
                        onClose={() => setShowForm(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default DoctorDetails;
