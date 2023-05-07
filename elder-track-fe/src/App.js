import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<LandingPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;