import {React, useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Grid, Typography, Paper} from '@mui/material'
import Navbar from '../../../components/Navbar/Navbar.js'
import './PatientMedicalRecord.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue} from 'firebase/database'

function PatientMedicalRecord() {

    const param = useParams();
    const [data, setData] = useState({purpose: "", symptoms: "", diagnosis: 10, prescription : ""});
    const [referral, setReferral] = useState([{id: "", type: "", description: ""}]);

    useEffect(() => {
        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}`), (snapshot) => {
            const medicalRecord = snapshot.val();
            setData(medicalRecord.info);
        });

        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/referral`), (snapshot) => {
            const referral = snapshot.val();

            if(referral)
            {
                const referrals = Object.entries(referral).filter(([referralID, referral]) => !referral.deleted)
                .map(([referralID, referral], index) => ({
                    id: referralID,
                    ...referral
                }));
                setReferral(referrals);
            }
        });
    }, []);


    return (
        <>
        <Navbar/>
        <Grid container className="patient-medical-record-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={12} pb={6}>
                        <Typography className="title">Vizualizare consultație</Typography>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Paper elevation={0} sx={{padding:'20px 20px 0px 0px', minHeight: '560px'}}>
                            <Grid container>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Motivul prezentării</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <Typography>{data.purpose}</Typography>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Simptome</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <Typography>{data.symptoms}</Typography>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Diagnostic</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <Typography>{data.diagnosis}</Typography>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Rețetă</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <Typography>{data.prescription}</Typography>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Trimiteri</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                {
                                    referral.map((value, index) => {
                                        return(
                                            <Grid item xs={12} my={3} py={1} mx={5} sx={{borderBottom: '1px solid grey'}} key={index}>
                                                <Typography>Tip: {value.type === 'blood-tests' ? 'Analize' : value.type === 'specialty' ? 'Specialitate' : value.type === 'Treatment' ? 'Tratament' : value.type === 'procedures' ? 'Proceduri' : ''}</Typography>
                                                <Typography>Descriere: {value.description}</Typography>
                                            </Grid>
                                        )
                                    })
                                }
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

export default PatientMedicalRecord