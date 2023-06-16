import {React, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Fab, Accordion, Tooltip, Box, AccordionSummary, AccordionDetails, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import {DataGrid, GridToolbarContainer, GridToolbarFilterButton} from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import '../Dashboard/Dashboard.css'
import Navbar from '../../../components/Navbar/Navbar.js'
import {database} from '../../../utils/firebase.js'
import {ref, onValue, update} from 'firebase/database'

function Dashboard() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [rowCaregiver, setRowCaregiver] = useState([]);
    const [rowDoctor, setRowDoctor] = useState([]);
    const [rowPatient, setRowPatient] = useState([]);
    const [rowSupervisor, setRowSupervisor] = useState([]);
    const [uid, setUID] = useState("");
    const [user, setUser] = useState("");
    
    const handleOpen = (uid, user) => {
        setUID(uid);
        setUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 60, hideable: false},
        {field: 'lastname', headerName: 'Nume', width: 250, hideable: false},
        {field: 'firstname', headerName: 'Prenume', width: 250, hideable: false},
        {field: 'cnp', headerName: 'CNP', width: 180},
        {field: 'email', headerName: 'E-mail', width: 180},
        {field: 'delete', headerName: 'Ștergere', width: 90, sortable: false, filterable: false, hideable: false,
            renderCell: (cellValues) => {
                return (
                    <Button size="small" onClick={() => {handleOpen(cellValues.row.uid, cellValues.row.user)}}><DeleteIcon sx={{color: '#E45B5F'}}/></Button>
                )
            }
        },
        {field: 'uid', headerName: 'UID'}
    ];

    useEffect(() => {
        onValue(ref(database, 'ElderTrack/caregiver'), (snapshot) => {
            const data = snapshot.val();
            if(data)
            {
                const caregivers = Object.entries(data).filter(([caregiverUID, caregiver]) => !caregiver.deleted)
                .map(([caregiverUID, caregiver], index) => ({
                    id: index + 1,
                    cnp: caregiver.CNP,
                    firstname: caregiver.firstname,
                    lastname: caregiver.lastname,
                    email: caregiver.email,
                    uid: caregiverUID,
                    user: "caregiver"
                }));
                setRowCaregiver(caregivers); 
            }
        });
        onValue(ref(database, 'ElderTrack/doctor'), (snapshot) => {
            const data = snapshot.val();
            if(data)
            {
                const doctors = Object.entries(data).filter(([doctortUID, doctor]) => !doctor.deleted)
                .map(([doctorUID, doctor], index) => ({
                    id: index + 1,
                    cnp: doctor.CNP,
                    firstname: doctor.firstname,
                    lastname: doctor.lastname,
                    email: doctor.email,
                    uid: doctorUID,
                    user: "doctor"
                }));
                setRowDoctor(doctors); 
            }
        });
        onValue(ref(database, 'ElderTrack/patient'), (snapshot) => {
            const data = snapshot.val();
            if(data) 
            {
                const patients = Object.entries(data).filter(([patientUID, patient]) => !patient.deleted)
                .map(([patientUID, patient], index) => {
                    const personalInfo = patient.personalInfo || {}; 
                    return {
                        id: index + 1,
                        cnp: personalInfo.CNP || "", 
                        firstname: personalInfo.firstname || "",
                        lastname: personalInfo.lastname || "",
                        email: personalInfo.email || "",
                        uid: patientUID,
                        user: "patient"
                    };
                });
                setRowPatient(patients);
            }
        });
        onValue(ref(database, 'ElderTrack/supervisor'), (snapshot) => {
            const data = snapshot.val();
            if(data)
            {
                const supervisors = Object.entries(data).filter(([supervisorUID, supervisor]) => !supervisor.deleted)
                .map(([supervisorUID, supervisor], index) => ({
                    id: index + 1,
                    cnp: supervisor.CNP,
                    firstname: supervisor.firstname,
                    lastname: supervisor.lastname,
                    email: supervisor.email,
                    uid: supervisorUID,
                    user: "supervisor"
                }));
                setRowSupervisor(supervisors); 
            }
        });
    }, []);

    const filteredColumns = columns.filter((column) => !['uid', 'user'].includes(column.field));

    function CustomToolbar(){
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton/>
            </GridToolbarContainer>
        )
    }

    const deleteUser = () => {
        handleClose();
        const updates = {
            deleted: true
        };
        switch(user)
        {
            case "caregiver" : 
                update(ref(database, `ElderTrack/caregiver/${uid}`), updates)
                .then(() => {
                    alert("Utilizatorul a fost șters cu succes!");
                })
                .catch((error) => {
                    alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                })
            break;
            case "doctor" : 
                update(ref(database, `ElderTrack/doctor/${uid}`), updates)
                .then(() => {
                    alert("Utilizatorul a fost șters cu succes!");
                })
                .catch((error) => {
                    alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                })
            break;
            case "patient" : 
                update(ref(database, `ElderTrack/patient/${uid}`), updates)
                .then(() => {
                    alert("Utilizatorul a fost șters cu succes!");
                })
                .catch((error) => {
                    alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                })
            break;
            case "supervisor" : 
                update(ref(database, `ElderTrack/supervisor/${uid}`), updates)
                .then(() => {
                    alert("Utilizatorul a fost șters cu succes!");
                })
                .catch((error) => {
                    alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                })
            break;
        }
    }

    return (
        <>
        <Navbar/>
        <Grid container className="admin-dashboard-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={8} pb={4}>
                        <Typography className="title">Utilizatori</Typography>
                    </Grid>
                    <Grid item xs={4} pb={4}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Tooltip title="Înregistrare utilizator">
                                <Fab color="primary" sx={{width: '40px', height: '40px'}} onClick={() => {navigate('/create-user')}}><AddIcon/></Fab>
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>ÎNGRIJITORI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 400, width: '100%'}}>
                                        <DataGrid 
                                            columns={filteredColumns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rowCaregiver}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>MEDICI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 400, width: '100%'}}>
                                        <DataGrid 
                                            columns={filteredColumns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rowDoctor}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>PACIENȚI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 400, width: '100%'}}>
                                        <DataGrid 
                                            columns={filteredColumns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rowPatient}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>SUPRAVEGHETORI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 400, width: '100%'}}>
                                        <DataGrid 
                                            columns={filteredColumns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rowSupervisor}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Confirmare Ștergere"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Sunteți sigur că doriți să ștergeți utilizatorul selectat?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {deleteUser()}} sx={{background: '#E45B5F', color: '#FBFBFB', "&:hover": {background: '#E45B5F'}}}>Șterge</Button>
                <Button onClick={handleClose}>Anulare</Button>
            </DialogActions>
        </Dialog>
    </>
    )
}

export default Dashboard;