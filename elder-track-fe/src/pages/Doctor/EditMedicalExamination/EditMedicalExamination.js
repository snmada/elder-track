import {React, useState} from 'react'
import {Grid, Typography, Button, TextField, Box, Paper, Divider, FormControl, Select, MenuItem, InputLabel} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import Navbar from '../../../components/Navbar/Navbar.js'
import './EditMedicalExamination.css'

function EditMedicalExamination() {

    const [data, setData] = useState({purpose: "a", symptoms: "b", diagnosis: 10, prescription : "c"});

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const [referral, setReferral] = useState([{type: 10, description: "e"}, {type: 20, description: "g"}]);

    const handleAddReferral = () => {
        setReferral([...referral, {type: "", description: ""}]);
    };
    
    const handleReferralChange = (index, event) => {
        const {name, value} = event.target;
        const updatedReferral = [...referral];
        updatedReferral[index] = {...updatedReferral[index], [name]: value};
        setReferral(updatedReferral);
    };

    const handleDeleteReferral = (index) => {
        const updatedReferral= [...referral];
        updatedReferral.splice(index, 1);
        setReferral(updatedReferral);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const filteredReferral = referral.filter(entry => entry.type !== "" && entry.description !== "");
        console.log(filteredReferral);
        console.log(data);
    }

  return (
    <>
    <Navbar/>
    <Grid container className="edit-medical-examination-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={12} pb={6}>
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
                                            sx={{width: '500px'}}
                                        >
                                            <MenuItem value={10}>462 ACUTE PHARYNGITIS</MenuItem>
                                            <MenuItem value={20}>464.0 ACUTE LARYNGITIS</MenuItem>
                                            <MenuItem value={30}>476 CHRONIC LARYNGITIS AND LARYNGOTRACHEITIS</MenuItem>
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
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Trimiteri</Typography>
                                </Grid>
                                {referral.map((value, index) => (
                                    <div key={index} style={{width: '100%'}}>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <FormControl>
                                                <InputLabel id="select-label-type">Tip</InputLabel>
                                                <Select
                                                    labelId="select-label-type"
                                                    name="type"
                                                    label="Tip"
                                                    value={value.type}
                                                    onChange={(event) => handleReferralChange(index, event)}
                                                    sx={{width: '500px'}}
                                                >
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    <MenuItem value={10}>Analize</MenuItem>
                                                    <MenuItem value={20}>Specialitate</MenuItem>
                                                    <MenuItem value={30}>Tratament</MenuItem>
                                                    <MenuItem value={30}>Proceduri</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <TextField 
                                                name="description" 
                                                type="text"  
                                                label="Descriere" 
                                                fullWidth 
                                                value={value.description}
                                                onChange={(event) => handleReferralChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} pb={0}>
                                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button onClick={() => handleDeleteReferral(index)} sx={{color: 'red'}}>ȘTERGE</Button>
                                            </Box>
                                        </Grid>
                                    </div>
                                ))}
                                <Grid item xs={12} pb={6}>
                                    <Button onClick={handleAddReferral}>+ ADAUGĂ</Button>
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

export default EditMedicalExamination;