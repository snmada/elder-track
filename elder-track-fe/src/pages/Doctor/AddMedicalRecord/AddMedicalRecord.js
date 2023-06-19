import {React, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Grid, Typography, Button, TextField, Box, Paper, Divider, FormControl, Select, MenuItem, InputLabel} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import Navbar from '../../../components/Navbar/Navbar.js'
import './AddMedicalRecord.css'
import {database} from '../../../utils/firebase.js'
import {ref, set, onValue} from 'firebase/database'
import {v4 as uuidv4} from 'uuid'

function AddMedicalRecord() {

    const param = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({date: new Date().toLocaleDateString(), purpose: "", symptoms: "", diagnosis: 462, prescription : ""});

    const medicalRecordID = uuidv4();

    const doctorUID = sessionStorage.getItem("uid");

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const [referral, setReferral] = useState({type: "", description: ""});
    
    const handleReferralChange = (e) => {
        setReferral({...referral, [e.target.name]: e.target.value});
    };

    const [doctorInfo, setDoctorInfo] = useState({firstname: "", lastname: ""});
    const [patientInfo, setPatientInfo] = useState({firstname: "", lastname: ""});

    useEffect(() => {
        onValue(ref(database, `ElderTrack/doctor/${doctorUID}`), (snapshot) => {
            const doctor = snapshot.val();
            if(doctor) 
            {
                const { firstname, lastname } = doctor;
                setDoctorInfo({ firstname, lastname });
            }
        });

        onValue(ref(database, `ElderTrack/patient/${param.id}/personalInfo`), (snapshot) => {
            const patient = snapshot.val();
            if(patient) 
            {
                const { firstname, lastname } = patient;
                setPatientInfo({ firstname, lastname });
            }
        });
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        set(ref(database, `ElderTrack/patient/${param.id}/medicalRecord/${medicalRecordID}/info`), data)
        .then(() => {
            if(referral.type !== "" && referral.description !== "")
            {
                set(ref(database, `ElderTrack/patient/${param.id}/medicalRecord/${medicalRecordID}/referral`), {
                    type: referral.type,
                    description: referral.description
                })
                .then(() => {
                    const messageInfo = {
                        resourceType : "Basic",
                        id: medicalRecordID,
                        extension : [
                            {
                                valueReference : {
                                    reference : doctorUID,
                                    display: doctorInfo.lastname + " " + doctorInfo.firstname
                                }
                            },
                            {
                                valueString : referral.description
                            }
                        ],
                        modifierExtension : [
                            {
                                valueCodeableConcept : {
                                    coding : [
                                        {
                                            system : "http://snomed.info/sct",
                                            code: data.diagnosis,
                                            display: "Consultation"
                                        }
                                    ]
                                }
                            }
                        ],
                        subject : {
                            reference : param.id,
                            display: patientInfo.lastname + " " + patientInfo.firstname
                        },
                        created : data.date,
                        author : {
                            reference : doctorUID
                        }
                    }
    
                    fetch("https://teleasistenta-cc12b49944b9.herokuapp.com/send_consultation", {
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify(messageInfo)
                    })
                    .then((response) => response.json())
                    .then((responseData) => {
                        navigate(`/patient/${param.id}`);
                    })
                    .catch((error) =>{
                        alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                    })
                })
                .catch((error) => {
                    alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                })
            }
            else
            {
                navigate(`/patient/${param.id}`);
            }
        })
        .catch((error) => {
            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
        });
    };
      
return (
    <>
    <Navbar/>
    <Grid container className="add-medical-record-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={12} pb={6}>
                    <Typography className="title">Adăugare consultație</Typography>
                </Grid>
                <Grid item xs={12} py={1}>
                    <form onSubmit={onSubmit}>
                        <Paper elevation={5} sx={{padding:'45px 50px'}}>
                            <Grid container>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Motivul prezentării</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <TextField
                                        name="purpose"
                                        onChange={handleChange}
                                        required
                                        placeholder="Introduceți aici..."
                                        multiline
                                        maxRows={10}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Simptome</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <TextField
                                        name="symptoms"
                                        onChange={handleChange}
                                        required
                                        placeholder="Introduceți aici..."
                                        multiline
                                        maxRows={10}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Diagnostic</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <FormControl>
                                        <Select
                                            name="diagnosis"
                                            value={data.diagnosis}
                                            onChange={handleChange}
                                            sx={{width: '60%'}}
                                        >
                                            <MenuItem value={462}>462 FARINGITĂ ACUTĂ</MenuItem>
                                            <MenuItem value={464.0}>464.0 LARINGITĂ ACUTĂ</MenuItem>
                                            <MenuItem value={472}>472.0 RINITĂ CRONICĂ</MenuItem>
                                            <MenuItem value={476}>476 LARINGITĂ CRONICĂ ȘI LARINGOTRAHEITĂ</MenuItem>
                                            <MenuItem value={491}>491 BRONȘITĂ CRONICĂ</MenuItem>
                                            <MenuItem value={493}>493 ASTM</MenuItem>
                                            <MenuItem value={504}>504 PNEUMOPATIE</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Rețetă</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <TextField
                                        name="prescription"
                                        onChange={handleChange}
                                        required
                                        placeholder="Introduceți aici..."
                                        multiline
                                        maxRows={10}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Trimitere</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} p={1}>
                                    <FormControl>
                                        <InputLabel id="select-label-type">Tip</InputLabel>
                                        <Select
                                            labelId="select-label-type"
                                            name="type"
                                            label="Tip"
                                            value={referral.type}
                                            onChange={handleReferralChange}
                                            sx={{width: '200px'}}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value={"blood-tests"}>Analize</MenuItem>
                                            <MenuItem value={"specialty"}>Specialitate</MenuItem>
                                            <MenuItem value={"treatment"}>Tratament</MenuItem>
                                            <MenuItem value={"procedures"}>Proceduri</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} p={1}>
                                    <TextField 
                                        name="description" 
                                        type="text"  
                                        label="Descriere" 
                                        fullWidth 
                                        value={referral.description}
                                        onChange={handleReferralChange}
                                    />
                                </Grid>
                                <Grid item xs={12} p={1} pt={8}>
                                    <Divider/>
                                    <Box display='flex' justifyContent='flex-end' pt={4}>
                                        <Button variant="contained" type="submit"><SaveIcon sx={{mr: 1}}/>SALVEAZĂ</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                </Grid>
            </Grid>
        </Paper>
    </Grid>
    </>
)
}

export default AddMedicalRecord;