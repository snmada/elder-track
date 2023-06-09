import {React, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Grid, Typography, Button, Box, Paper, TextField, Dialog, Accordion, AccordionSummary, AccordionDetails, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import {DataGrid, GridToolbarContainer, GridToolbarFilterButton} from '@mui/x-data-grid'
import Navbar from '../../../components/Navbar/Navbar.js'
import DescriptionIcon from '@mui/icons-material/Description';
import './Dashboard.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue, update} from 'firebase/database'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function Dashboard() {

    const navigate = useNavigate();
    const param = useParams();
    const [data, setData] = useState([]);
    const [parameter, setParameter] = useState([]);
    const [solvedTreatment, setSolvedTreatment] = useState([]);
    const [unsolvedTreatment, setUnsolvedTreatment] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [recommendation, setRecommendation] = useState([]);
    const [rows, setRows] = useState([])

    const uid = sessionStorage.getItem("uid");

    useEffect(() => {
        onValue(ref(database, `ElderTrack/patient/${uid}/personalInfo`), (snapshot) => {
            const patient = snapshot.val();
            setData(patient);
        });

        onValue(ref(database, `ElderTrack/patient/${uid}/normalMedicalRanges`), (snapshot) => {
            const parameter = snapshot.val();
            setParameter(parameter);
        });

        onValue(ref(database, `ElderTrack/patient/${uid}/treatment`), (snapshot) => {
            const treatment = snapshot.val();

            if(treatment)
            {
                const solvedTreatments = Object.entries(treatment).filter(([treatmentID, treatment]) => treatment.status == "solved" && !treatment.deleted)
                .map(([treatmentID, treatment], index) => ({
                    id: treatmentID,
                    ...treatment
                }));
                setSolvedTreatment(solvedTreatments);

                const unsolvedTreatments = Object.entries(treatment).filter(([treatmentID, treatment]) => treatment.status !== "solved" && !treatment.deleted)
                .map(([treatmentID, treatment], index) => ({
                    id: treatmentID,
                    ...treatment
                }));
                setUnsolvedTreatment(unsolvedTreatments);
            }
        });

        onValue(ref(database, `ElderTrack/patient/${uid}/recommendation`), (snapshot) => {
            const recommendation = snapshot.val();

            if(recommendation)
            {
                const recommendations = Object.entries(recommendation).filter(([recommendationID, recommendation]) => !recommendation.deleted)
                .map(([recommendationID, recommendation], index) => ({
                    id: recommendationID,
                    ...recommendation
                }));
                setRecommendation(recommendations);
            }
        });

        onValue(ref(database, `ElderTrack/patient/${uid}/medicalHistory`), (snapshot) => {
            const medicalHistory = snapshot.val();

            if(medicalHistory)
            {
                const medicalHistories = Object.entries(medicalHistory).filter(([medicalHistoryID, medicalHistory]) => !medicalHistory.deleted)
                .map(([medicalHistoryID, medicalHistory], index) => ({
                    id: medicalHistoryID,
                    ...medicalHistory
                }));
                setMedicalHistory(medicalHistories);
            }
        });

        onValue(ref(database, `ElderTrack/patient/${uid}/medicalRecord`), (snapshot) => {
            const medicalRecord = snapshot.val();

            if(medicalRecord)
            {
                const filteredMedicalRecords = Object.entries(medicalRecord).filter(([medicalRecordID, medicalRecord]) => !medicalRecord.deleted)
                .map(([medicalRecordID, medicalRecord], index) => ({
                    id: index + 1,
                    date: new Date(medicalRecord.info.date),
                    uid: medicalRecordID
                }));
                setRows(filteredMedicalRecords); 
            }
        });
    }, []);

    const columns = [
        {field: 'id', headerName: 'ID', width: 150},
        {field: 'date', headerName: 'Data', type: 'date', width: 250},
        {field: 'view', headerName: 'Vizualizare', width: 85, sortable: false, filterable: false,
            renderCell: (cellValues) => {
                return (
                    <Button onClick={() => {navigate(`/patient-medical-record/${uid}/${cellValues.row.uid}`)}}><DescriptionIcon/></Button>
                )
            },
        },
        {field: 'uid', headerName: 'UID'}
    ];

    const filteredColumns = columns.filter((column) => !['uid'].includes(column.field));

    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deletePatient = () => {
        const updates = {
            deleted: true
        };
        update(ref(database, `ElderTrack/patient/${uid}`), updates)
        .then(() => {
            navigate("/doctor-dashboard")
        })
        .catch((error) => {
            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
        })
    }

    function CustomToolbar(){
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton/>
            </GridToolbarContainer>
        )
    }

return (
    <>
    <Navbar/>
    <Grid container className="patient-dashboard-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={12} pb={6}>
                    <Typography className="title">Dosar medical : {data.lastname} {data.firstname} {data.CNP}</Typography>
                </Grid>
                <Grid item xs={12} py={1}>
                    <Paper elevation={0} sx={{padding:'20px 20px 0px 0px', minHeight: '560px'}}>
                        <Grid container>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Alergii</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} p={1}>
                                                    <Typography>{data.allergies}</Typography>
                                                </Grid> 
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Consultații</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} sm={12} py={1} pl={1}>
                                                    <div style={{height: 350, width: '100%'}}>
                                                        <DataGrid 
                                                            columns={filteredColumns}
                                                            pageSize={10}
                                                            rowsPerPageOptions={[10]}
                                                            rows={rows}
                                                            components={{Toolbar: CustomToolbar}}
                                                        />
                                                    </div>
                                                </Grid> 
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Informații personale</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Profesie:</b> {data.profession}</Typography>
                                                </Grid> 
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Ocupație:</b> {data.occupation}</Typography>
                                                </Grid> 
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Strada:</b> {data.street}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Număr:</b> {data.number}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Bloc:</b> {data.buildingNumber}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Scara:</b> {data.staircase}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}  p={1}>
                                                    <Typography><b>Etaj:</b> {data.floor}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Apartament:</b> {data.apartment}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Oraș:</b> {data.city}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Județ:</b> {data.county}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>Telefon:</b> {data.phoneNumber}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} p={1}>
                                                    <Typography><b>E-mail:</b> {data.email}</Typography>
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Istoric medical</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} p={1}>
                                                {
                                                    medicalHistory.map((value, index) => {
                                                        return(
                                                            <Grid item xs={12} my={3} py={1} mx={5} sx={{borderBottom: '1px solid grey'}} key={index}>
                                                                <Typography>Diagnostic: {value.diagnosis}</Typography>
                                                                <Typography>Tratament: {value.treatment}</Typography>
                                                                <Typography>Schema de medicație: {value.medicationSchedule}</Typography>
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Recomandări</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} p={1}>
                                                    {
                                                        recommendation.map((value, index) => {
                                                            return(
                                                                <Grid item xs={12} my={3} py={1} mx={5} sx={{borderBottom: '1px solid grey'}} key={index}>
                                                                    <Typography>Tip: {value.type}</Typography>
                                                                    <Typography>Durată: {value.duration}</Typography>
                                                                    <Typography>Indicații: {value.notes}</Typography>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Referințe</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography sx={{fontSize: '18px'}}>Tensiune arterială (mm Hg)</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={8} p={1}>
                                                    <TextField
                                                        label="min"
                                                        type="number"
                                                        name="bloodPressureMin"
                                                        value={parameter.bloodPressureMin}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    <TextField
                                                        label="max"
                                                        type="number"
                                                        name="bloodPressureMax"
                                                        value={parameter.bloodPressureMax}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography sx={{fontSize: '18px'}}>Puls</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={8} p={1}>
                                                    <TextField
                                                        label="min"
                                                        type="number"
                                                        name="pulseMin"
                                                        value={parameter.pulseMin}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    <TextField
                                                        label="max"
                                                        type="number"
                                                        name="pulseMax"
                                                        value={parameter.pulseMax}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography sx={{fontSize: '18px'}}>Temperatura corporală (gr. C)</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={8} p={1}>
                                                    <TextField
                                                        label="min"
                                                        type="number"
                                                        name="bodyTemperatureMin"
                                                        value={parameter.bodyTemperatureMin}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    <TextField
                                                        label="max"
                                                        type="number"
                                                        name="bodyTemperatureMax"
                                                        value={parameter.bodyTemperatureMax}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography sx={{fontSize: '18px'}}>Greutate (Kg)</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={8} p={1}>
                                                    <TextField
                                                        label="min"
                                                        type="number"
                                                        name="weightMin"
                                                        value={parameter.weightMin}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    <TextField
                                                        label="max"
                                                        type="number"
                                                        name="weightMax"
                                                        value={parameter.weightMax}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography sx={{fontSize: '18px'}}>Glicemie (Kg)</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={8} p={1}>
                                                    <TextField
                                                        label="min"
                                                        type="number"
                                                        name="glucoseMin"
                                                        value={parameter.glucoseMin}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    <TextField
                                                        label="max"
                                                        type="number"
                                                        name="glucoseMax"
                                                        value={parameter.glucoseMax}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                                    <Typography sx={{fontSize: '18px'}}>Temperatura ambientală (gr. C)</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={8} p={1}>
                                                    <TextField
                                                        label="min"
                                                        type="number"
                                                        name="ambientTemperatureMin"
                                                        value={parameter.ambientTemperatureMin}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    <TextField
                                                        label="max"
                                                        type="number"
                                                        name="ambientTemperatureMax"
                                                        value={parameter.ambientTemperatureMax}
                                                        sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                                        InputProps={{
                                                            inputProps: {
                                                                readOnly: true
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} py={1}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                        <Typography>Tratamente</Typography>
                                    </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item xs={12} p={1}>
                                                    <Typography sx={{fontSize: '18px'}}>Rezolvate : </Typography>
                                                    {
                                                        solvedTreatment.map((value, index) => {
                                                            return(
                                                                <Grid item xs={12} my={3} py={1} mx={5} sx={{borderBottom: '1px solid grey'}} key={index}>
                                                                    <Typography>Descriere: {value.description}</Typography>
                                                                    <Typography>Observații: {value.remarks}</Typography>
                                                                    <Typography>Data rezolvării: {value.solvedDate}</Typography>
                                                                    <Typography>Ora rezolvării: {value.solvedHour}</Typography>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                                <Grid item xs={12} p={1}>
                                                    <Typography sx={{fontSize: '18px'}}>Nerezolvate :</Typography>
                                                    {
                                                        unsolvedTreatment.map((value, index) => {
                                                            return(
                                                                <Grid item xs={12} my={3} py={1} mx={5} sx={{borderBottom: '1px solid grey'}} key={index}>
                                                                    <Typography>Descriere: {value.description}</Typography>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                </Accordion>
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

export default Dashboard