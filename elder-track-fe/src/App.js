import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.js'
import LogIn from './pages/LogIn/LogIn.js'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard.js'
import CreateUserAccount from './pages/Admin/CreateUserAccount/CreateUserAccount.js'
import DoctorDashboard from './pages/Doctor/Dashboard/Dashboard.js'
import EditPatient from './pages/Doctor/EditPatient/EditPatient.js'
import PatientProfile from './pages/Doctor/PatientProfile/PatientProfile.js'
import AddMedicalExamination from './pages/Doctor/AddMedicalExamination/AddMedicalExamination.js'
import ViewMedicalExamination from './pages/Doctor/ViewMedicalExamination/ViewMedicalExamination.js'
import EditMedicalExamination from './pages/Doctor/EditMedicalExamination/EditMedicalExamination.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<LandingPage/>}/>
                <Route exact path="/login" element={<LogIn/>}/>
                <Route exact path="/admin-dashboard" element={<AdminDashboard/>}/>
                <Route exact path="/create-user" element={<CreateUserAccount/>}/>
                <Route exact path="/doctor-dashboard" element={<DoctorDashboard/>}/>
                <Route exact path="/edit-patient" element={<EditPatient/>}/>
                <Route exact path="/patient" element={<PatientProfile/>}/>
                <Route exact path="/add-medical-examination" element={<AddMedicalExamination/>}/>
                <Route exact path="/view-medical-examination" element={<ViewMedicalExamination/>}/>
                <Route exact path="/edit-medical-examination" element={<EditMedicalExamination/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;