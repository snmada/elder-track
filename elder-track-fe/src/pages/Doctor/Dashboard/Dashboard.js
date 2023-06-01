import {React, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, Paper} from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import Navbar from '../../../components/Navbar/Navbar.js'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import './Dashboard.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue} from 'firebase/database'

function Dashboard() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([])

    const columns = [
        {field: 'id', headerName: 'ID', width: 60, hideable: false},
        {field: 'lastname', headerName: 'Nume', width: 250, hideable: false},
        {field: 'firstname', headerName: 'Prenume', width: 250, hideable: false},
        {field: 'cnp', headerName: 'CNP', width: 250},
        {field: 'view', headerName: 'Vizualizare dosar', width: 150, sortable: false, filterable: false, hideable: false,
            renderCell: (cellValues) => {
                return (
                    <Button size="small"><FolderSharedIcon onClick={() => navigate(`/patient/${cellValues.row.uid}`)}/></Button>
                )
            }
        },
        {field: 'uid', headerName: 'UID'}
    ];

    useEffect(() => {
        onValue(ref(database, 'ElderTrack/Pacient'), (snapshot) => {
            const data = snapshot.val();

            const UID = sessionStorage.getItem("uid");

            const filteredPatients = Object.entries(data).reduce((filtered, [pacientUID, patient]) => {
                if (patient.medicUID === UID) 
                {
                    filtered[pacientUID] = patient;
                }
                return filtered;
            }, {});

            const patients = Object.entries(filteredPatients).map(([pacientUID, patient], index) => ({
                id: index + 1,
                cnp: patient.CNP,
                firstname: patient.prenume,
                lastname: patient.nume,
                uid: pacientUID
            }));
            setRows(patients); 
        });
    }, []);

    const filteredColumns = columns.filter((column) => !['uid'].includes(column.field));

  return (
    <>
    <Navbar/>
    <Grid container className="doctor-dashboard-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={12} pb={6}>
                    <Typography className="title">Pacienți</Typography>
                </Grid>
                <Grid item xs={12} py={1}>
                    <div style={{height: 500, width: '100%'}}>
                        <DataGrid 
                            columns={filteredColumns}
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