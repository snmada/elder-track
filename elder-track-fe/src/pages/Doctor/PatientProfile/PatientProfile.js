import {React, useState} from 'react'
import {Grid, Typography, Button, Box, Paper} from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import Navbar from '../../../components/Navbar/Navbar.js'
import DescriptionIcon from '@mui/icons-material/Description';

function PatientProfile() {

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
        recommendation: "-",
        medicalHistory: "-",
        medicationSchedule: "-"
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
    <Grid container className="add-patient-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={6} pb={6}>
                    <Typography className="title">Dosar pacient</Typography>
                </Grid>
                <Grid item xs={6} pb={2}>
                    <Box display='flex' justifyContent='flex-end'>
                        <Button variant="contained" sx={{mr: 2, background: '#3F3B6C'}}>ADĂUGARE CONSULTAȚIE</Button>
                        <Button variant="contained" sx={{mr: 2, background: '#FFE69A', color: 'black', "&:hover":{color: 'white'}}}>EDITARE</Button>
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
                            <Grid item xs={12} mt={2} px={1} pb={1}>
                                <Typography variant="h6" className="description">Schemă de medicație</Typography>
                            </Grid>
                            <Grid item xs={12} p={1}>
                                <Typography>{data.medicationSchedule}</Typography>
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