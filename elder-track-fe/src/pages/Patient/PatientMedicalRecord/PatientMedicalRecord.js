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
    const [referral, setReferral] = useState({type: "", description: ""});
    const [result, setResult] = useState("");

    useEffect(() => {
        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}`), (snapshot) => {
            const medicalRecord = snapshot.val();
            setData(medicalRecord.info);
        });

        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/referral`), (snapshot) => {
            const referral = snapshot.val();

            if(referral)
            {
                setReferral(referral);
            }
        });

        onValue(ref(database, "ElderTrack/consultations"), (snapshot) => {
            const consultations = snapshot.val();

            if(consultations)
            {
                let result = null;
                Object.entries(consultations).forEach(([consultationID, consultation]) => {
                    if(consultation.medicalRecordUID === param.id_medical_record) 
                    {
                        result = consultation.result;
                        return;
                    }
                });

                if (result) 
                {
                    setResult(result);
                }
            }
        });
    }, []);


    return (
        <>
        <Navbar/>
        <Grid container className="patient-medical-record-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={12} pb={4}>
                        <Typography className="title">Vizualizare consultație</Typography>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Paper elevation={0}>
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
                                {
                                    referral.type !== "" &&  (
                                        <>
                                        <Grid item xs={12} mt={2} px={1} pb={2}>
                                            <Typography variant="h6" className="description">Trimitere</Typography>
                                        </Grid>
                                        <Grid item xs={12} p={1}>
                                            <Grid item xs={12} my={3} py={1} mx={5} sx={{borderBottom: '1px solid grey'}}>
                                                <Typography>Tip: {referral.type === 'blood-tests' ? 'Analize' : referral.type === 'specialty' ? 'Specialitate' : referral.type === 'treatment' ? 'Tratament' : referral.type === 'procedures' ? 'Proceduri' : ''}</Typography>
                                                <Typography pb={2}>Descriere: {referral.description}</Typography>
                                                <Typography><span style={{background: '#FFE194', padding: '10px', marginRight: '10px'}}>Rezultat:</span>{result}</Typography>
                                            </Grid>
                                        </Grid>
                                        </>
                                    )
                                }
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