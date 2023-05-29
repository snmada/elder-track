import {React, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Box, Paper} from '@mui/material'
import Navbar from '../../../components/Navbar/Navbar.js'
import './ViewMedicalExamination.css'

function ViewMedicalExamination() {

    const navigate = useNavigate();

    const [data, setData] = useState({purpose: "-", symptoms: "-", diagnosis: 10, prescription : "-", referral: "-"});

    return (
        <>
        <Navbar/>
        <Grid container className="view-medical-examination-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={6} pb={6}>
                        <Typography className="title">Vizualizare consultație</Typography>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                        <Box display='flex' justifyContent='flex-end'>
                            <Button variant="contained" onClick={() => {navigate("/edit-medical-examination")}} sx={{mr: 2, background: '#FFE69A', color: 'black', "&:hover":{color: 'white'}}}>EDITARE</Button>
                            <Button variant="contained" sx={{background: '#E45B5F'}}>ȘTERGERE</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Paper elevation={0} sx={{padding:'20px 20px 0px 0px', minHeight: '560px'}}>
                            <Grid container>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Motivul prezentării</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    {data.purpose}
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Simptome</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    {data.symptoms}
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Diagnostic</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    {data.diagnosis}
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Rețetă</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    {data.prescription}
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Trimiteri</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    {data.referral}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        </>
    )
}

export default ViewMedicalExamination