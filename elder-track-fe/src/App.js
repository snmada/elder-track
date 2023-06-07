import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.js'
import LogIn from './pages/LogIn/LogIn.js'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard.js'
import CreateUserAccount from './pages/Admin/CreateUserAccount/CreateUserAccount.js'
import DoctorDashboard from './pages/Doctor/Dashboard/Dashboard.js'
import EditPatient from './pages/Doctor/EditPatient/EditPatient.js'
import PatientProfile from './pages/Doctor/PatientProfile/PatientProfile.js'
import AddMedicalRecord from './pages/Doctor/AddMedicalRecord/AddMedicalRecord.js'
import ViewMedicalRecord from './pages/Doctor/ViewMedicalRecord/ViewMedicalRecord.js'
import EditMedicalRecord from './pages/Doctor/EditMedicalRecord/EditMedicalRecord.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<LandingPage/>}/>
                <Route exact path="/login" element={<LogIn/>}/>
                <Route exact path="/admin-dashboard" element={<AdminDashboard/>}/>
                <Route exact path="/create-user" element={<CreateUserAccount/>}/>
                <Route exact path="/doctor-dashboard" element={<DoctorDashboard/>}/>
                <Route exact path="/edit-patient/:id" element={<EditPatient/>}/>
                <Route exact path="/patient/:id" element={<PatientProfile/>}/>
                <Route exact path="/add-medical-record/:id" element={<AddMedicalRecord/>}/>
                <Route exact path="/view-medical-record/:id_patient/:id_medical_record" element={<ViewMedicalRecord/>}/>
                <Route exact path="/edit-medical-record/:id_patient/:id_medical_record" element={<EditMedicalRecord/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;