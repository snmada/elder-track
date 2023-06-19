import {React, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Grid, Typography, Button, Box, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import Navbar from '../../../components/Navbar/Navbar.js'
import './ViewMedicalRecord.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue, update} from 'firebase/database'

function ViewMedicalRecord() {

    const navigate = useNavigate();
    const param = useParams();

    const [data, setData] = useState({purpose: "", symptoms: "", diagnosis: 10, prescription : ""});
    const [referral, setReferral] = useState({type: "", description: ""});
    const [result, setResult] = useState("");

    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const deleteMedicalRecord = () => {
        const updates = {
            deleted: true
        };
        update(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}`), updates)
        .then(() => {
            navigate(`/patient/${param.id_patient}`);
        })
        .catch((error) => {
            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
        })
    }

    return (
        <>
        <Navbar/>
        <Grid container className="view-medical-record-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={9} pb={6}>
                        <Typography className="title">Vizualizare consultație</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={3} pb={2}>
                        <Box display='flex' justifyContent='flex-end'>
                            <Button variant="contained" onClick={() => {navigate(`/edit-medical-record/${param.id_patient}/${param.id_medical_record}`)}} sx={{mr: 2, background: '#569DAA', ":hover" : {background: '#569DAA'}}}>EDITARE</Button>
                            <Button variant="contained" sx={{background: '#E45B5F', ":hover" : {background: '#E45B5F'}}} onClick={handleOpen}>ȘTERGERE</Button>
                        </Box>
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
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Confirmare Ștergere"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Sunteți sigur că doriți să ștergeți fișa de consultație?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => deleteMedicalRecord()} sx={{background: '#E45B5F', color: '#FBFBFB', ":hover" : {background: '#E45B5F'}}}>Șterge</Button>
                <Button onClick={handleClose}>Anulare</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default ViewMedicalRecord