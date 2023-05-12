import {React} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Fab, Accordion, Tooltip, Box, AccordionSummary, AccordionDetails, Paper} from '@mui/material'
import {DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton} from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import '../Dashboard/Dashboard.css'
import Navbar from '../../../components/Navbar/Navbar.js'

function Dashboard() {

    const navigate = useNavigate();

    const columns = [
        {field: 'id', headerName: 'ID', width: 60, hideable: false},
        {field: 'lastname', headerName: 'Nume', width: 200, hideable: false},
        {field: 'firstname', headerName: 'Prenume', width: 200, hideable: false},
        {field: 'cnp', headerName: 'CNP', width: 180},
        {field: 'email', headerName: 'E-mail', width: 180},
        {field: 'edit', headerName: 'Editare', width: 110, sortable: false, filterable: false, hideable: false,
        renderCell: (cellValues) => {
            return (
                <Button size="small"><EditIcon color="primary"/></Button>
            )
        }
        },
        {field: 'delete', headerName: 'Ștergere', width: 110, sortable: false, filterable: false, hideable: false,
            renderCell: (cellValues) => {
                return (
                    <Button size="small"><DeleteIcon sx={{color: '#E45B5F'}}/></Button>
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

    function CustomToolbar(){
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton/>
                <GridToolbarFilterButton/>
            </GridToolbarContainer>
        )
    }

    return (
        <>
        <Navbar/>
        <Grid container className="dashboard-container">
            <Paper elevation={0} className="paper">
                <Grid container>
                    <Grid item xs={8} pb={6}>
                        <Typography className="title">Listele utilizatorilor înregistrați în aplicație: Medici, Pacienți și Supraveghetori</Typography>
                    </Grid>
                    <Grid item xs={4} pb={6}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Tooltip title="Înregistrare utilizator">
                                <Fab color="primary" sx={{width: '40px', height: '40px'}} onClick={() => {navigate('/create-user')}}><AddIcon/></Fab>
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion defaultExpanded={true} sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>MEDICI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 500, width: '100%'}}>
                                        <DataGrid 
                                            columns={columns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rows}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion defaultExpanded={true} sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>PACIENȚI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 500, width: '100%'}}>
                                        <DataGrid 
                                            columns={columns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rows}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} py={1}>
                        <Accordion defaultExpanded={true} sx={{width: '100%'}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{background: '#EEEEEE'}}>
                                <Typography>SUPRAVEGHETORI</Typography>
                            </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{height: 500, width: '100%'}}>
                                        <DataGrid 
                                            columns={columns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            rows={rows}
                                            components={{Toolbar: CustomToolbar}}
                                        />
                                    </div>
                                </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </>
    )
}

export default Dashboard;