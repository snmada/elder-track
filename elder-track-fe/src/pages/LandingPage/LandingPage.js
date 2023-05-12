import React from 'react'
import {Grid} from '@mui/material'
import '../LandingPage/LandingPage.css'
import svg from '../../svg/undraw_medicine_b-1-ol.svg'
import Navbar from '../../components/Navbar/Navbar.js'

function LandingPage() {
    return (
        <>
            <Navbar/>
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