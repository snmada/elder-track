import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.js'
import LogIn from './pages/LogIn/LogIn.js'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard.js'
import CreateUserAccount from './pages/Admin/CreateUserAccount/CreateUserAccount.js'
import DoctorDashboard from './pages/Doctor/Dashboard/Dashboard.js'
import AddPatient from './pages/Doctor/AddPatient/AddPatient.js'
import PatientProfile from './pages/Doctor/PatientProfile/PatientProfile.js'
import AddMedicalExamination from './pages/Doctor/AddMedicalExamination/AddMedicalExamination.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<LandingPage/>}/>
                <Route exact path="/login" element={<LogIn/>}/>
                <Route exact path="/admin-dashboard" element={<AdminDashboard/>}/>
                <Route exact path="/create-user" element={<CreateUserAccount/>}/>
                <Route exact path="/doctor-dashboard" element={<DoctorDashboard/>}/>
                <Route exact path="/add-patient" element={<AddPatient/>}/>
                <Route exact path="/patient" element={<PatientProfile/>}/>
                <Route exact path="/add-medical-examination" element={<AddMedicalExamination/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;