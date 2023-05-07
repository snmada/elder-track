import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.js'
import LogIn from './pages/LogIn/LogIn.js'
import Dashboard from './pages/Admin/Dashboard/Dashboard.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<LandingPage/>}/>
                <Route exact path="/login" element={<LogIn/>}/>
                <Route exact path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;