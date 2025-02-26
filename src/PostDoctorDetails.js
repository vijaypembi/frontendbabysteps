const PostDoctorDetails = async () => {
    const initialDoctorDetails = {
        name: "Dr. Olivia Carter",
        workingHours: { start: "06:30", end: "14:30" },
        specialization: "Reproductive Endocrinology and Infertility",
    };

    try {
        const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/doctors/`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(initialDoctorDetails),
        };

        const response = await fetch(baseUrl, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `API Error: ${data.message || "Something went wrong"}`
            );
        }

        console.log("Doctor details posted successfully:", data);
    } catch (error) {
        console.error("Error posting doctor details:", error.message);
    }
};

export default PostDoctorDetails;
