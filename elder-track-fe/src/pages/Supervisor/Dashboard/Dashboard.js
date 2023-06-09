import {React, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Paper} from '@mui/material'
import Navbar from '../../../components/Navbar/Navbar.js'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import SosIcon from '@mui/icons-material/Sos'
import './Dashboard.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue} from 'firebase/database'

function Dashboard() {

    const navigate = useNavigate();
    const [alarms, setAlarms] = useState([]);

    useEffect(() => {
        onValue(ref(database, 'ElderTrack/patient'), (snapshot) => {
            const data = snapshot.val();
            if(data)
            {
                const UID = sessionStorage.getItem("uid");

                const filteredPatients = Object.entries(data).reduce((filtered, [patientUID, patient]) => {
                    if(patient.careTeam.supervisorUID === UID && !patient.deleted) 
                    {
                        filtered[patientUID] = patient;
                    }
                    return filtered;
                }, {});

                const ambientAlarms = Object.entries(filteredPatients).reduce((alarms, [patientUID, patient]) => {
                    const ambientParameters = patient.ambientParameters;
                    if(ambientParameters) 
                    {
                        const filteredAlarms = Object.entries(ambientParameters).reduce((result, [parameterID, parameter]) => {
                            const alarms = parameter.alarms || {};
                            const filteredAlarmEntries = Object.entries(alarms).filter(([alarmID, alarm]) => alarm.status !== "solved");
                            const filteredAlarms = filteredAlarmEntries.map(([alarmID, alarm]) => ({
                                patientUID: patientUID,
                                parameterID: parameterID,
                                alarmID: alarmID,
                                description: alarm.description,
                                date: parameter.datetime.date,
                                hour: parameter.datetime.hour
                            }));
                            return [...result, ...filteredAlarms];
                        }, []);
                        return [...alarms, ...filteredAlarms];
                    }
                    return alarms;
                }, []);
                  
                const vitalAlarms = Object.entries(filteredPatients).reduce((alarms, [patientUID, patient]) => {
                    const vitalParameters = patient.vitalParameters;
                    if(vitalParameters) 
                    {
                        const filteredAlarms = Object.entries(vitalParameters).reduce((result, [parameterID, parameter]) => {
                            const alarms = parameter.alarms || {};
                            const filteredAlarmEntries = Object.entries(alarms).filter(([alarmID, alarm]) => alarm.status !== "solved");
                            const filteredAlarms = filteredAlarmEntries.map(([alarmID, alarm]) => ({
                                patientUID: patientUID,
                                parameterID: parameterID,
                                alarmID: alarmID,
                                description: alarm.description,
                                date: parameter.datetime.date,
                                hour: parameter.datetime.hour
                            }));
                            return [...result, ...filteredAlarms];
                        }, []);
                        return [...alarms, ...filteredAlarms];
                    }
                    return alarms;
                }, []);

                const combinedAlarms = vitalAlarms.concat(ambientAlarms);

                combinedAlarms.sort((v, a) => {
                    const dateV = new Date(`${v.date} ${v.hour}`);
                    const dateA = new Date(`${a.date} ${a.hour}`);
                  
                    if(dateV > dateA) 
                    {
                        return -1;
                    } 
                    else if (dateV < dateA) 
                    {
                        return 1;
                    }
                  
                    const hourV = parseInt(v.hour.split(':')[0]);
                    const hourA = parseInt(a.hour.split(':')[0]);
                  
                    return hourV - hourA;
                });
                setAlarms(combinedAlarms);
            }
        });
    }, []);

    return (
        <>
        <Navbar/>
        <Grid container className="supervisor-dashboard-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={12} pb={6}>
                        <Typography className="title">Alarme recente</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{minHeight: 'fit-content', maxHeight: '450px', width: '100%', overflow: 'auto'}}>
                            {
                                alarms.map((value, index) => (
                                    <Grid container mb={2} px={4} py={3} sx={{background: "#FFE6E6"}} key={index}>
                                        <Grid item sm={1}>
                                            <Typography><WarningAmberIcon sx={{fontSize: '1.8rem', color: '#E74646'}}/></Typography>
                                        </Grid>
                                        <Grid item sm={7}>
                                            <Typography sx={{fontSize: "18px"}}>{value.description}</Typography>
                                        </Grid>
                                        <Grid item sm={3}>
                                            <Typography sx={{fontSize: "18px"}}>{value.date} {value.hour}</Typography>
                                        </Grid>
                                        <Grid item sm={1}>
                                            <Button variant="contained" sx={{background: '#EA5455', ":hover" : {background: "#EA5455"}}} onClick={() => {navigate(`/patient-alarm/${value.patientUID}/${value.parameterID}/${value.alarmID}`)}}><SosIcon sx={{fontSize: '1.8rem', color: 'white'}}/></Button>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        </>
    )
}

export default Dashboard;