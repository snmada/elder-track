import React from 'react'
import {useNavigate} from 'react-router-dom'
import {AppBar, Toolbar, Grid, Box, Typography} from '@mui/material'
import '../LandingPage/LandingPage.css'
import svg from '../../svg/undraw_medicine_b-1-ol.svg'

function LandingPage() {

    const navigate = useNavigate();

    return (
        <>
            <AppBar elevation={0} sx={{background: 'transparent', color: 'black', px: 15, py: 2}}>
                <Toolbar>
                    <Typography sx={{flexGrow: 1, fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: '25px', fontWeight: '900', color: '#131A4C', cursor: 'pointer'}} onClick={() => {navigate("/")}}>
                        Elder<span style={{color:"#E45B5F"}}>Track</span>
                    </Typography>
                    <Box className="login-button" onClick={() => {navigate("/login")}}>Intră în cont</Box>
                </Toolbar>
            </AppBar>
            <Grid container className="landing-page-container">
                <Grid container width="500px">
                    <Grid item xs={12} className="grid">
                        <img src={svg} width="600px" height="450px"/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default LandingPage;