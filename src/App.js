import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllAppointments from "./Components/AllAppointments";
import Home from "./Components/Home";

import "./App.css";
import DoctorDetails from "./Components/DoctorDetails";
import Nothing from "./Components/Nothing";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route
                    exact
                    path="/doctors/:id/slots"
                    element={<DoctorDetails />}
                />
                <Route
                    exact
                    path="/appointments"
                    element={<AllAppointments />}
                />
                <Route path="*" element={<Nothing />} />
            </Routes>
        </Router>
    );
}

export default App;
