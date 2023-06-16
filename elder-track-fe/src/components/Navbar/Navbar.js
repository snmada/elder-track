import {React} from 'react'
import {useNavigate} from 'react-router-dom'
import {AppBar, Toolbar, Box, Typography, Button} from '@mui/material'
import {useLocation} from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = sessionStorage.getItem("role");

    return (
        <>
        {
            location.pathname == '/'?
            (
                <AppBar elevation={0} position="fixed" sx={{background: 'transparent', color: 'black', px: {xs: 1, sm: 5}, py: 1, height: '10vh'}}>
                    <Toolbar>
                        <Typography sx={{flexGrow: 1, fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: '25px', fontWeight: '900', color: '#131A4C'}}>
                            Elder<span style={{color:"#E45B5F"}}>Track</span>
                        </Typography>
                        <Box className="login-button" onClick={() => {navigate("/login")}}>Intră în cont</Box>
                    </Toolbar>
                </AppBar>
                
            )
            :
            (
                <AppBar elevation={1} position="sticky" sx={{background: 'white', color: 'black', px: {xs: 1, sm: 5}, py: 1, height: '10vh'}}>
                    <Toolbar>
                        <PersonIcon className="icon-navbar"/> 
                        <Typography sx={{flexGrow: 1, fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: '20px', pl: 2}}>
                            {user === 'doctor' ? 'Medic' : user === 'patient' ? 'Pacient' : user === 'supervisor' ? 'Supraveghetor' : user === 'admin' ? 'Administrator' : ''}
                        </Typography>
                        <Button onClick={() => {sessionStorage.clear(); navigate("/");}} sx={{color: '#131A4C'}}><LogoutIcon className="icon-navbar"/>Deconectare</Button>
                    </Toolbar>
                </AppBar>
            )
        }
        </>
    )
}

export default Navbar;