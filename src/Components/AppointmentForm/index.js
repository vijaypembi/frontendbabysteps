import { useState } from "react";
import moment from "moment";
import { ToastContainer } from "react-toastify";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
// import { useNavigate } from "react-router-dom";

const AppointmentForm = ({
    doctorDetails,
    appointmentDetails,
    onSubmit, // function
    onClose, // function
}) => {
    const { _id, workingHours } = doctorDetails;
    const { selectedTime, selectedDate, patientName, notes, duration } =
        appointmentDetails;

    const appointmentTypeList = [
        "General Checkup",
        "Routine Check-Up",
        "Ultrasound",
        "Dental Cleaning",
        "Eye Examination",
        "General Consultation",
        "Physical Therapy",
        "Vaccination",
        "Blood Test",
        "Cardiology Consultation",
        "Dermatology Check-Up",
        "ENT Consultation",
        "Gynecology Appointment",
        "Pediatrics Consultation",
        "Orthopedic Assessment",
        "Neurology Consultation",
        "Psychiatry Session",
        "Endocrinology Check-Up",
        "Nutrition & Diet Consultation",
        "Physical Examination",
        "Chiropractic Adjustment",
        "Gastroenterology Consultation",
        "Allergy Testing",
        "COVID-19 Testing",
        "MRI Scan",
        "CT Scan",
        "Other",
    ];
    function convertTo24Hour(time12h) {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}`;
    }
    //console.log(doctorDetails);
    // console.log(typeof selectedTime);
    const [formData, setFormData] = useState({
        doctorId: _id,
        date: selectedDate,
        time: convertTo24Hour(selectedTime),
        duration: duration,
        patientName: patientName,
        appointmentType: appointmentTypeList[0],
        notes: notes,
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.doctorName)
            newErrors.doctorName = "Doctor is Name required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.time) newErrors.time = "Time is required";
        if (formData.duration < 30)
            newErrors.duration = "Minimum duration is 30 minutes";
        if (!formData.patientName.trim())
            newErrors.patientName = "Patient name is required";
        if (!formData.appointmentType)
            newErrors.appointmentType = "Appointment type is required";
        if (formData.notes.length > 500)
            newErrors.notes = "Notes cannot exceed 500 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const combinedDateTime = moment
                .utc(`${formData.date} ${formData.time}`, "YYYY-MM-DD HH:mm")
                .toISOString();
            const updateFormData = {
                doctorId: formData.doctorId,
                date: combinedDateTime,
                duration: formData.duration,
                patientName: formData.patientName,
                appointmentType: formData.appointmentType,
                notes: formData.notes,
            };

            onSubmit(updateFormData);
        }

        // onSubmit({
        //     ...formData,
        //     date: combinedDateTime,
        //     doctorId: formData.doctorId,
        // });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <ToastContainer />
            <div className="modal-overlay" onClick={() => onClose()}>
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-button" onClick={onClose}>
                        x
                    </button>
                    <h2>Conform Appointment</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Doctor:</label>
                            <input
                                type="text"
                                value={doctorDetails.name}
                                // onChange={handleChange}
                                onChange={() =>
                                    alert(
                                        "Doctor selection can't be changed!\nPlease go back and select a different one."
                                    )
                                }
                            />
                            {errors.doctor && (
                                <span className="error-message">
                                    {errors.doctor}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                // onChange={() =>
                                //     alert(
                                //         "You can't change the selected date!\nPlease go back and select a different one."
                                //     )
                                // }
                                className={errors.date ? "error" : ""}
                            />
                            {errors.date && (
                                <span className="error-message">
                                    {errors.date}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                Available Time: {workingHours.start}
                                {"-"}
                                {workingHours.end}
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                // onChange={() =>
                                //     alert(
                                //         "You can't change the selected time slot!\nPlease go back and choose a different one."
                                //     )
                                // }
                                className={errors.time ? "error" : ""}
                            />
                            {errors.time && (
                                <span className="error-message">
                                    {errors.time}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Duration (minutes):</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="30"
                                className={errors.duration ? "error" : ""}
                            />
                            {errors.duration && (
                                <span className="error-message">
                                    {errors.duration}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Patient Name:</label>
                            <input
                                type="text"
                                name="patientName"
                                placeholder="Name"
                                value={formData.patientName}
                                onChange={handleChange}
                                className={errors.patientName ? "error" : ""}
                            />
                            {errors.patientName && (
                                <span className="error-message">
                                    {errors.patientName}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Appointment Type:</label>
                            <select
                                name="appointmentType"
                                //appointmentTypeList[0] add default in form Data Object defatult at top
                                value={formData.appointmentType}
                                onChange={handleChange}
                                className={
                                    errors.appointmentType ? "error" : ""
                                }
                            >
                                {appointmentTypeList.map((each) => (
                                    <option
                                        key={appointmentTypeList.indexOf(each)}
                                        value={each}
                                    >
                                        {each}
                                    </option>
                                ))}
                            </select>
                            {errors.appointmentType && (
                                <span className="error-message">
                                    {errors.appointmentType}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Notes:</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                maxLength="500"
                                className={errors.notes ? "error" : ""}
                            />
                            <div className="char-counter">
                                {formData.notes.length}/500
                            </div>
                            {errors.notes && (
                                <span className="error-message">
                                    {errors.notes}
                                </span>
                            )}
                        </div>

                        <button type="submit" className="submit-button">
                            Create Appointment
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AppointmentForm;
