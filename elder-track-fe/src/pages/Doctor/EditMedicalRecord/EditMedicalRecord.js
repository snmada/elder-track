import {React, useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, TextField, Box, Paper, Divider, FormControl, Select, MenuItem, InputLabel} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import Navbar from '../../../components/Navbar/Navbar.js'
import './EditMedicalRecord.css'
import {database} from '../../../utils/firebase.js'
import {ref, onValue, update} from 'firebase/database'

function EditMedicalRecord() {

    const param = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({purpose: "", symptoms: "", diagnosis: 462, prescription : ""});

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}`), (snapshot) => {
            const medicalRecord = snapshot.val();
            setData(medicalRecord.info);
        });
    }, []);


    const onSubmit = (event) => {
        event.preventDefault();
        update(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/info`), data)
        .then(() => {
            navigate(`/view-medical-record/${param.id_patient}/${param.id_medical_record}`);
        })
        .catch((error) => {
            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
        });
    };
      
  return (
    <>
    <Navbar/>
    <Grid container className="edit-medical-record-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={12} pb={4}>
                    <Typography className="title">Editare consultație</Typography>
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
                                        value={data.purpose}
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
                                        value={data.symptoms}
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
                                        value={data.prescription}
                                        onChange={handleChange}
                                        required
                                        placeholder="Introduceți aici..."
                                        multiline
                                        maxRows={10}
                                        fullWidth
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

export default EditMedicalRecord;