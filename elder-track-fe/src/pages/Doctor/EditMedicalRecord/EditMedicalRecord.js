import {React, useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Grid, Typography, Button, TextField, Box, Paper, Divider, FormControl, Select, MenuItem, InputLabel} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import Navbar from '../../../components/Navbar/Navbar.js'
import './EditMedicalRecord.css'
import {v4 as uuidv4} from 'uuid'
import {database} from '../../../utils/firebase.js'
import {ref, onValue, update} from 'firebase/database'

function EditMedicalRecord() {

    const param = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({purpose: "", symptoms: "", diagnosis: 462, prescription : ""});

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const [referral, setReferral] = useState([{id: "", type: "", description: ""}]);

    const handleAddReferral = () => {
        setReferral([...referral, {id: uuidv4(), type: "", description: ""}]);
    };
    
    const handleReferralChange = (index, event) => {
        const {name, value} = event.target;
        const updatedReferral = [...referral];
        updatedReferral[index] = {...updatedReferral[index], [name]: value};
        setReferral(updatedReferral);
    };

    const handleDeleteReferral = (index) => {
        const updatedReferral= [...referral];
        updatedReferral[index] = { ...updatedReferral[index], type: "-", description: "-"};
        setReferral(updatedReferral);
    };

    useEffect(() => {
        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}`), (snapshot) => {
            const medicalRecord = snapshot.val();
            setData(medicalRecord.info);
        });

        onValue(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/referral`), (snapshot) => {
            const referral = snapshot.val();

            if(referral && !referral.deleted)
            {
                const referrals = Object.entries(referral).filter(([referralID, referral]) => !referral.deleted)
                .map(([referralID, referral], index) => ({
                    id: referralID,
                    ...referral
                }));
                setReferral(referrals);
            }
        });
    }, []);


    const onSubmit = (event) => {
        event.preventDefault();
      
        const filteredReferral = referral.filter((entry) => entry.type !== "" && entry.description !== "");
      
        update(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/info`), data)
          .then(() => {
            const referralPromises = filteredReferral.map(({ id, ...rest }, index) => {
                if(rest.type === "-" && rest.description === "-") 
                {
                    const updates = { 
                        deleted: true 
                    };
                    return update(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/referral/${id}`), updates)
                    .then(() => {
                        handleDeleteReferral(index);
                    });
                } 
                else 
                {
                    return update(ref(database, `ElderTrack/patient/${param.id_patient}/medicalRecord/${param.id_medical_record}/referral/${id}`), rest)
                }
            });
      
            Promise.all(referralPromises)
            .then(() => {
                navigate(`/view-medical-record/${param.id_patient}/${param.id_medical_record}`);
            })
            .catch((error) => {
                alert("A intervenit o eroare. Vă rugăm să mai încercați!");
            });
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
                                            <MenuItem value={462}>462 ACUTE PHARYNGITIS</MenuItem>
                                            <MenuItem value={464.0}>464.0 ACUTE LARYNGITIS</MenuItem>
                                            <MenuItem value={476}>476 CHRONIC LARYNGITIS AND LARYNGOTRACHEITIS</MenuItem>
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
                                {referral.map((value, index) => {
                                    if(value.type !== "-" && value.description !== "-")
                                    {
                                        return(
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
                                                            sx={{width: '200px'}}
                                                        >
                                                            <MenuItem value=""><em>None</em></MenuItem>
                                                            <MenuItem value={"blood-tests"}>Analize</MenuItem>
                                                            <MenuItem value={"specialty"}>Specialitate</MenuItem>
                                                            <MenuItem value={"treatment"}>Tratament</MenuItem>
                                                            <MenuItem value={"procedures"}>Proceduri</MenuItem>
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
                                        )
                                    }
                                })}
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

export default EditMedicalRecord;