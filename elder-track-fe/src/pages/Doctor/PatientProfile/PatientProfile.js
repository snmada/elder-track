import {React, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Box, Paper, TextField} from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import Navbar from '../../../components/Navbar/Navbar.js'
import DescriptionIcon from '@mui/icons-material/Description';
import './PatientProfile.css'

function PatientProfile() {

    const navigate = useNavigate();

    const patient = {
        firstname: "-", 
        lastname: "-", 
        cnp: "-", 
        age: "-", 
        profession : "-",
        occupation: "-", 
        street: "-", 
        number: "-", 
        buildingNumber: "-", 
        staircase: "-", 
        floor: "-", 
        apartment: "-", 
        city: "-", 
        county: "-", 
        phoneNumber: "-", 
        email: "-", 
        allergies: "-", 
        treatment: "-",
        recommendation: "-",
        medicalHistory: "-",
    };

    const parameter = {
        bloodPressureMin: 20, bloodPressureMax: 300,
        pulseMin: 40, pulseMax: 200,
        bodyTemperatureMin: 30.0, bodyTemperatureMax: 42.0,
        weightMin: 30.00, weightMax: 200.00,
        glucoseMin: 10, glucoseMax: 400,
        ambientTemperatureMin: 5, ambientTemperatureMax: 90

    };

    const [data, setData] = useState(patient);

    const columns = [
        {field: 'id', headerName: 'No.', width: 150},
        {field: 'date', headerName: 'Data', type: 'date', width: 250},
        {field: 'view', headerName: 'Vizualizare', width: 85, sortable: false, filterable: false,
            renderCell: (cellValues) => {
                return (
                    <Button><DescriptionIcon/></Button>
                )
            },
        },
    ];

    const rows = [
        { id: 1, date: new Date('2022','09','03')},
        { id: 2, date: new Date('2022','09','03')},
        { id: 3, date: new Date('2022','09','03')},
        { id: 4, date: new Date('2022','09','03')},
        { id: 5, date: new Date('2022','09','03')},
        { id: 6, date: new Date('2022','09','03')},
        { id: 7, date: new Date('2022','09','03')},
        { id: 8, date: new Date('2022','09','03')},
        { id: 9, date: new Date('2022','09','03')},
    ];

  return (
    <>
    <Navbar/>
    <Grid container className="patient-profile-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={6} pb={6}>
                    <Typography className="title">Dosar pacient</Typography>
                </Grid>
                <Grid item xs={6} pb={2}>
                    <Box display='flex' justifyContent='flex-end'>
                        <Button variant="contained" sx={{mr: 2, background: '#3F3B6C'}}>ADĂUGARE CONSULTAȚIE</Button>
                        <Button variant="contained" onClick={() => {navigate("/edit-patient")}} sx={{mr: 2, background: '#FFE69A', color: 'black', "&:hover":{color: 'white'}}}>EDITARE</Button>
                        <Button variant="contained" sx={{background: '#E45B5F'}}>ȘTERGERE</Button>
                    </Box>
                </Grid>
                <Grid item xs={6} py={1}>
                    <Paper elevation={0} sx={{padding:'20px 20px 0px 0px', minHeight: '560px'}}>
                        <Grid container>
                            <Grid item xs={12} px={1}>
                                <Typography variant="h6" className="description">Informații personale</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Nume:</b> {data.lastname}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Prenume:</b> {data.firstname}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>CNP:</b> {data.cnp}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Vârsta:</b> {data.age}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Profesie:</b> {data.profession}</Typography>
                            </Grid> 
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Ocupație:</b> {data.occupation}</Typography>
                            </Grid> 
                            <Grid item xs={12} mt={2} px={1}>
                                <Typography variant="h6" className="description">Adresa</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Strada:</b> {data.street}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Număr:</b> {data.number}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Bloc:</b> {data.buildingNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Scara:</b> {data.staircase}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}  p={1}>
                                <Typography><b>Etaj:</b> {data.floor}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Apartament:</b> {data.apartment}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Oraș:</b> {data.city}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} p={1}>
                                <Typography><b>Județ:</b> {data.county}</Typography>
                            </Grid>
                            <Grid item xs={12} mt={2} px={1}>
                                <Typography variant="h6" className="description">Contact</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} p={1}>
                                <Typography><b>Telefon:</b> {data.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} p={1}>
                                <Typography><b>E-mail:</b> {data.email}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={6} py={1}>
                    <Paper elevation={0} sx={{padding:'20px 0px 0px 0px', minHeight: '560px'}}>
                        <Grid container>
                            <Grid item xs={12} pl={1}>
                                <Typography variant="h6" className="description">Consultații</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} py={1} pl={1}>
                                <div style={{height: 500, width: '100%'}}>
                                    <DataGrid 
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        rows={rows}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} py={1}>
                    <Paper elevation={0} sx={{padding:'20px 0px 0px 0px'}}>
                        <Grid container>
                            <Grid item xs={12} mt={2} px={1} pb={1}>
                                <Typography variant="h6" className="description">Alergii</Typography>
                            </Grid>
                            <Grid item xs={12} p={1}>
                                <Typography>{data.allergies}</Typography>
                            </Grid>
                            <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Referințe</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} py={2} px={1} sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '18px'}}>Tensiune arterială (mm Hg)</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8} p={1}>
                                <TextField
                                    label="min"
                                    type="number"
                                    name="bloodPressureMin"
                                    defaultValue={parameter.bloodPressureMin}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                                <TextField
                                    label="max"
                                    type="number"
                                    name="bloodPressureMax"
                                    defaultValue={parameter.bloodPressureMax}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
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
                                    defaultValue={parameter.pulseMin}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                                <TextField
                                    label="max"
                                    type="number"
                                    name="pulseMax"
                                    defaultValue={parameter.pulseMax}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
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
                                    defaultValue={parameter.bodyTemperatureMin}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                                <TextField
                                    label="max"
                                    type="number"
                                    name="bodyTemperatureMax"
                                    defaultValue={parameter.bodyTemperatureMax}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
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
                                    defaultValue={parameter.weightMin}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                                <TextField
                                    label="max"
                                    type="number"
                                    name="weightMax"
                                    defaultValue={parameter.weightMax}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
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
                                    defaultValue={parameter.glucoseMin}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                                <TextField
                                    label="max"
                                    type="number"
                                    name="glucoseMax"
                                    defaultValue={parameter.glucoseMax}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
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
                                    defaultValue={parameter.ambientTemperatureMin}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                                <TextField
                                    label="max"
                                    type="number"
                                    name="ambientTemperatureMax"
                                    defaultValue={parameter.ambientTemperatureMax}
                                    sx={{paddingRight: 2, paddingBottom: 2, width: '100px'}}
                                    InputProps={{
                                        inputProps: {
                                            readOnly: true
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} mt={2} px={1} pb={1}>
                                <Typography variant="h6" className="description">Tratamente</Typography>
                            </Grid>
                            <Grid item xs={12} p={1}>
                                <Typography>{data.treatment}</Typography>
                            </Grid>
                            <Grid item xs={12} mt={2} px={1} pb={1}>
                                <Typography variant="h6" className="description">Recomandări</Typography>
                            </Grid>
                            <Grid item xs={12} p={1}>
                                <Typography>{data.recommendation}</Typography>
                            </Grid>
                            <Grid item xs={12} mt={2} px={1} pb={1}>
                                <Typography variant="h6" className="description">Istoric</Typography>
                            </Grid>
                            <Grid item xs={12} p={1}>
                                <Typography>{data.medicalHistory}</Typography>
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

export default PatientProfile