import "./index.css";
import { useNavigate } from "react-router-dom";

const Nothing = () => {
    const navigate = useNavigate();
    return (
        <div className="nothing">
            Page Not Found Error!
            <div className="back-buttom" onClick={() => navigate("/")}>
                Back to Home
            </div>
        </div>
    );
};
export default Nothing;
