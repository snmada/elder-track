import {React, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Grid, Typography, Button, TextField, Paper, Box} from '@mui/material'
import Navbar from '../../../components/Navbar/Navbar.js'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import './PatientAlarm.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue, update} from 'firebase/database'

function Patient() {

    const navigate = useNavigate();
    const param = useParams();
    const [data, setData] = useState([]);
    const [alarm, setAlarm] = useState({});

    const handleChange = (e) => {
        setAlarm({...alarm, [e.target.name]: e.target.value});
    };

    useEffect(() => {
        onValue(ref(database, `ElderTrack/patient/${param.id}/personalInfo`), (snapshot) => {
            const patient = snapshot.val();
            setData(patient);
        });

        onValue(ref(database, `ElderTrack/patient/${param.id}/ambientParameters/${param.id_parameter}/alarms/${param.id_alarm}`), (snapshot) => {
            const data = snapshot.val();
            if(data)
            {
                setAlarm({...data, type: "ambient"});
            }
            else
            {
                onValue(ref(database, `ElderTrack/patient/${param.id}/vitalParameters//${param.id_parameter}/alarms/${param.id_alarm}`), (snapshot) => {
                    const data = snapshot.val();
                    setAlarm({...data, type: "ambient"});
                });
            }
        });
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        if(alarm.type === "ambient")
        {
            update(ref(database, `ElderTrack/patient/${param.id}/ambientParameters/${param.id_parameter}/alarms/${param.id_alarm}`), {
                description: alarm.description,
                remarks: alarm.remarks,
                solvedDate: new Date().toLocaleDateString(),
                solvedHour: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: "solved"
            })
            .then(() => {
                window.confirm("Alarma a fost salvată cu succes!")? navigate("/supervisor-dashboard") : navigate("/supervisor-dashboard");
            });
        }
        else
        {
            update(ref(database, `ElderTrack/patient/${param.id}/vitalParameters//${param.id_parameter}/alarms/${param.id_alarm}`), {
                description: alarm.description,
                remarks: alarm.remarks,
                solvedDate: new Date().toLocaleDateString(),
                solvedHour: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: "solved"
            })
            .then(() => {
                window.confirm("Alarma a fost salvată cu succes!")? navigate("/supervisor-dashboard") : navigate("/supervisor-dashboard");
            });
        }
    }

    return (
        <>
        <Navbar/>
        <Grid container className="patient-alarm-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper elevation={0}>
                            <Grid container pt={5}>
                                <Grid item xs={12} py={2}>
                                    <Typography variant="h6" className="description">Informații pacient</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} p={1}>
                                    <Typography><b>Nume:</b> {data.lastname}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} p={1}>
                                    <Typography><b>Prenume:</b> {data.firstname}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} p={1}>
                                    <Typography><b>CNP:</b> {data.CNP}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} p={1}>
                                    <Typography><b>Vârsta:</b> {data.age}</Typography>
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
                                <Grid item xs={12} sm={4} p={1}>
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
                        </Paper>
                    </Grid>
                    <Grid item xs={12} py={2}>
                        <Typography variant="h6" className="description">Alarmă</Typography>
                    </Grid>
                    <Grid item xs={12} mb={1} p={2} sx={{background: "#FFE6E6"}}>  
                        <Typography sx={{fontSize: "18px"}}>{alarm.description}</Typography>
                    </Grid>
                    <Box sx={{width: '100%'}}>
                        <form onSubmit={onSubmit}>
                            <Grid container> 
                                <Grid item xs={12} py={2}>
                                    <TextField
                                        name="remarks"
                                        required
                                        value={alarm.remarks}
                                        onChange={handleChange}
                                        label="Observații"
                                        placeholder="Introduceți aici..."
                                        multiline
                                        maxRows={10}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} py={2}>
                                    <Box display='flex' justifyContent='flex-end'>
                                        <Button variant="contained" type="submit" sx={{background: "#68B984", ":hover" : {background: "#68B984"}}}><DoneOutlineIcon sx={{mr: 2}}/>REZOLVAT</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Paper>
        </Grid>
        </>
    )
}

export default Patient;