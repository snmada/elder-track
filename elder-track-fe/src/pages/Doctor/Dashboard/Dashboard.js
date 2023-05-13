import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Fab, Tooltip, Box, Paper} from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import Navbar from '../../../components/Navbar/Navbar.js'
import AddIcon from '@mui/icons-material/Add'
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import './Dashboard.css'

function Dashboard() {

    const navigate = useNavigate();

    const columns = [
        {field: 'id', headerName: 'ID', width: 60, hideable: false},
        {field: 'lastname', headerName: 'Nume', width: 250, hideable: false},
        {field: 'firstname', headerName: 'Prenume', width: 250, hideable: false},
        {field: 'cnp', headerName: 'CNP', width: 250},
        {field: 'view', headerName: 'Vizualizare dosar', width: 150, sortable: false, filterable: false, hideable: false,
            renderCell: (cellValues) => {
                return (
                    <Button size="small"><FolderSharedIcon sx={{color: '#EC994B'}}/></Button>
                )
            }
        }
    ];

    const rows = [
        { id: 1, lastname: 'Snow', firstname: 'Jon', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 2, lastname: 'Lannister', firstname: 'Cersei', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 3, lastname: 'Lannister', firstname: 'Jaime', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 4, lastname: 'Stark', firstname: 'Arya', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 5, lastname: 'Targaryen', firstname: 'Daenerys', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 6, lastname: 'Melisandre', firstname: 'Jennifer', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 7, lastname: 'Clifford', firstname: 'Ferrara', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 8, lastname: 'Frances', firstname: 'Rossini', cnp: 5030419123456, email: 'snow@gmail.com'},
        { id: 9, lastname: 'Roxie', firstname: 'Harvey', cnp: 5030419123456, email: 'snow@gmail.com'},
    ];

  return (
    <>
    <Navbar/>
    <Grid container className="doctor-dashboard-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={8} pb={6}>
                    <Typography className="title">Pacienți</Typography>
                </Grid>
                <Grid item xs={4} pb={6}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Tooltip title="Adăugare pacient">
                            <Fab color="primary" sx={{width: '40px', height: '40px'}} onClick={() => {navigate('/add-patient')}}><AddIcon/></Fab>
                        </Tooltip>
                    </Box>
                </Grid>
                <Grid item xs={12} py={1}>
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
    </>
  )
}

export default Dashboard;