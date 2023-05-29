import {React, useState} from 'react'
import {Grid, Typography, Button, Autocomplete, TextField, Box, Paper, Divider} from '@mui/material'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import SaveIcon from '@mui/icons-material/Save'
import Navbar from '../../../components/Navbar/Navbar.js'
import './EditPatient.css'

function EditPatient() {

    const [data, setData] = useState({firstname: "", lastname: "", cnp: "", age: "", profession : "", occupation: "", street: "", number: "", buildingNumber: "", 
    staircase: "", floor: "", apartment: "", city: "", county: "", phoneNumber: "", email: "", allergies: ""});

    const [medicalHistory, setMedicalHistory] = useState([{diagnosis: "", treatment: "", medicationSchedule: ""}]);
    
    const handleAddHistory = () => {
        setMedicalHistory([...medicalHistory, {diagnosis: "", treatment: "", medicationSchedule: ""}]);
    };
    
    const handleMedicalHistoryChange = (index, event) => {
        const {name, value} = event.target;
        const updatedMedicalHistory = [...medicalHistory];
        updatedMedicalHistory[index] = {...updatedMedicalHistory[index], [name]: value};
        setMedicalHistory(updatedMedicalHistory);
    };

    const handleDeleteMedicalHistory = (index) => {
        const updatedMedicalHistory = [...medicalHistory];
        updatedMedicalHistory.splice(index, 1);
        setMedicalHistory(updatedMedicalHistory);
    };

    const [recommendation, setRecommendation] = useState([{type: "", duration: "", note: ""}]);

    const handleAddRecommendation = () => {
        setRecommendation([...recommendation, {type: "", duration: "", note: ""}]);
    };
    
    const handleRecommendationChange = (index, event) => {
        const {name, value} = event.target;
        const updatedRecommendation = [...recommendation];
        updatedRecommendation[index] = {...updatedRecommendation[index], [name]: value};
        setRecommendation(updatedRecommendation);
    };

    const handleDeleteRecommendation = (index) => {
        const updatedRecommendation = [...recommendation];
        updatedRecommendation.splice(index, 1);
        setRecommendation(updatedRecommendation);
    };

    const schema = yup.object().shape({
        lastname: yup.string().matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, "Nume invalid!"),
        firstname: yup.string().matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, "Prenume invalid!"),
        cnp: yup.string().min(13, "CNP invalid!").max(13, "CNP invalid!"),
        email: yup.string().email("Adresa de e-mail este invalidă!"),
        phoneNumber: yup.string().matches(/^[0-9]+$/, "Număr invalid!").min(10, "Număr invalid!").max(10, "Număr invalid!")
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const handleChange = (e) => {
        if(e.target.name === 'cnp' && e.target.value.length === 13)
        {
            const age = getAge(e.target.value);
            setData({...data, cnp: e.target.value, age: age});
        }
        else
        {
            setData({...data, [e.target.name]: e.target.value});
        }
    }

    const getAge = (cnp) => {
        let year, month, day, age, month_difference="", full_year="";

        if(cnp.substring(0,1) === "1" || cnp.substring(0,1) === "2")
        {
            year = parseInt("19" + cnp.substring(1,3));
        }
        if(cnp.substring(0,1) === "5" || cnp.substring(0,1) === "6")
        {
            year = parseInt("20" + cnp.substring(1,3));
        }

        month = cnp.substring(3, 5);
        day = cnp.substring(5, 7);

        month_difference = Date.now() - new Date(month + "/" + day + "/" + year).getTime();
        full_year = new Date(month_difference).getUTCFullYear();

        age = Math.abs(full_year - 1970);

        return age;
    }

    const onSubmit = async () => {
        const filteredRecommendation = recommendation.filter(entry => entry.type !== "" && entry.duration !== "" && entry.note !== "");
        const filteredHistory = medicalHistory.filter(entry => entry.diagnosis !== "" && entry.treatment !== "" && entry.medicationSchedule !== "");
        console.log(filteredRecommendation);
        console.log(filteredHistory);
        console.log(data);
    }

  return (
    <>
    <Navbar/>
    <Grid container className="edit-patient-container">
        <Paper elevation={0} className="paper">
            <Grid container>
                <Grid item xs={12} pb={6}>
                    <Typography className="title">Fișa pacientului</Typography>
                </Grid>
                <Grid item xs={12} py={1}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Paper elevation={5} sx={{padding:'45px 50px'}}>
                            <Grid container>
                                <Grid item xs={12} px={1}>
                                    <Typography variant="h6" className="description">Informații personale</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} p={1}>
                                    <TextField 
                                        required 
                                        name="lastname" 
                                        type="text"  
                                        label="Nume" 
                                        placeholder="Introduceți numele..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        {...register("lastname")} 
                                        onChange={handleChange}
                                    />
                                    <Typography className="error">{errors.lastname?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} p={1}>
                                    <TextField 
                                        required 
                                        name="firstname" 
                                        type="text"  
                                        label="Prenume" 
                                        placeholder="Introduceți prenumele..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        {...register("firstname")} 
                                        onChange={handleChange}
                                    />
                                    <Typography  className="error">{errors.firstname?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} p={1}>
                                    <TextField 
                                        required 
                                        name="cnp" 
                                        type="text"  
                                        label="CNP (Cod Numeric Personal)" 
                                        placeholder="Introduceți CNP-ul..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        {...register("cnp")} 
                                        onChange={handleChange}
                                    />
                                    <Typography className="error">{errors.cnp?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={2} p={1}>
                                    <TextField 
                                        name="age" 
                                        type="text"  
                                        label="Vârsta" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        value={data.age}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} p={1}>
                                    <TextField 
                                        required 
                                        name="profession" 
                                        type="text"  
                                        label="Profesie" 
                                        placeholder="Introduceți profesia..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid> 
                                <Grid item xs={12} sm={3} p={1}>
                                    <TextField 
                                        required 
                                        name="occupation" 
                                        type="text"  
                                        label="Ocupație" 
                                        placeholder="Introduceți ocupația..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid> 
                                <Grid item xs={12} mt={2} px={1}>
                                    <Typography variant="h6" className="description">Adresa</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9} p={1}>
                                    <TextField 
                                        required 
                                        name="street" 
                                        type="text"  
                                        label="Stradă" 
                                        placeholder="Introduceți strada..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} p={1}>
                                    <TextField 
                                        name="number" 
                                        type="text"  
                                        label="Număr" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} p={1}>
                                    <TextField 
                                        name="buildingNumber" 
                                        type="text"  
                                        label="Bloc" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} p={1}>
                                    <TextField 
                                        name="staircase" 
                                        type="text"  
                                        label="Scară" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}  p={1}>
                                    <TextField 
                                        name="floor" 
                                        type="text"  
                                        label="Etaj" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} p={1}>
                                    <TextField 
                                        name="apartment" 
                                        type="text"  
                                        label="Apartament" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} p={1}>
                                    <Autocomplete
                                        disablePortal
                                        options={['Alba Iulia', 'Arad', 'Pitești', 'Bacău', 'Oradea', 'Brașov','Cluj-Napoca', 'București', 'Timișoara']}
                                        onChange={(event, newValue) => {setData({...data, city: newValue})}}
                                        renderInput={(params) => <TextField {...params} {...register("city")} required variant="standard" label="Oraș" size="small"/>}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} p={1}>
                                    <Autocomplete
                                        disablePortal
                                        options={['Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Brașov','Cluj', 'Ilfov', 'Timiș']}
                                        onChange={(event, newValue) => {setData({...data, county: newValue})}}
                                        renderInput={(params) => <TextField {...params} {...register("county")}  required variant="standard" label="Județ" size="small"/>}
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2} px={1}>
                                    <Typography variant="h6" className="description">Contact</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} p={1}>
                                    <TextField 
                                        required 
                                        name="phoneNumber" 
                                        type="text"  
                                        label="Telefon" 
                                        placeholder="Introduceți numărul de telefon..." 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        {...register("phoneNumber")} 
                                        onChange={handleChange}
                                    />
                                    <Typography className="error">{errors.phoneNumber?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} p={1}>
                                    <TextField 
                                        name="email" 
                                        type="text"  
                                        label="E-mail" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        {...register("email")} 
                                        onChange={handleChange}
                                    />
                                    <Typography className="error">{errors.email?.message}</Typography>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1}>
                                    <Typography variant="h6" className="description">Alergii</Typography>
                                </Grid>
                                <Grid item xs={12} p={1}>
                                    <TextField
                                        name="allergies"
                                        onChange={handleChange}
                                        required
                                        placeholder="Introduceți aici..."
                                        multiline
                                        maxRows={10}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2} px={1}>
                                    <Typography variant="h6" className="description">Recomandări</Typography>
                                </Grid>
                                {recommendation.map((value, index) => (
                                    <div key={index} style={{width: '100%'}}>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <TextField 
                                                name="type" 
                                                type="text"  
                                                label="Tipul recomandării" 
                                                placeholder="Ex: bicicletă, alergat, plimbare" 
                                                fullWidth 
                                                value={value.type}
                                                onChange={(event) => handleRecommendationChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <TextField
                                                name="duration"
                                                type="text"  
                                                label="Durata zilnică" 
                                                fullWidth
                                                value={value.duration}
                                                onChange={(event) => handleRecommendationChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <TextField
                                                name="note"
                                                label="Alte indicații" 
                                                multiline
                                                maxRows={10}
                                                fullWidth
                                                value={value.note}
                                                onChange={(event) => handleRecommendationChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} pb={0}>
                                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button onClick={() => handleDeleteRecommendation(index)} sx={{color: 'red'}}>ȘTERGE</Button>
                                            </Box>
                                        </Grid>
                                    </div>
                                ))}
                                <Grid item xs={12} pb={6}>
                                    <Button onClick={handleAddRecommendation}>+ ADAUGĂ</Button>
                                </Grid>
                                <Grid item xs={12} mt={2} px={1} pb={2}>
                                    <Typography variant="h6" className="description">Istoric</Typography>
                                </Grid>
                                {medicalHistory.map((value, index) => (
                                    <div key={index} style={{width: '100%'}}>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <TextField 
                                                name="diagnosis" 
                                                type="text"  
                                                label="Diagnostic" 
                                                placeholder="Introduceți diagnosticul..." 
                                                fullWidth 
                                                value={value.diagnosis}
                                                onChange={(event) => handleMedicalHistoryChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} p={1}>
                                            <TextField
                                                name="treatment"
                                                label="Tratament" 
                                                placeholder="Introduceți tratamentul..."
                                                multiline
                                                maxRows={10}
                                                fullWidth
                                                value={value.treatment}
                                                onChange={(event) => handleMedicalHistoryChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} p={1}>
                                            <TextField
                                                name="medicationSchedule"
                                                label="Schema de medicație" 
                                                placeholder="Introduceți schema de medicație..."
                                                multiline
                                                maxRows={10}
                                                fullWidth
                                                value={value.medicationSchedule}
                                                onChange={(event) => handleMedicalHistoryChange(index, event)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} pb={0}>
                                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button onClick={() => handleDeleteMedicalHistory(index)} sx={{color: 'red'}}>ȘTERGE</Button>
                                            </Box>
                                        </Grid>
                                    </div>
                                ))}
                                <Grid item xs={12} pb={6}>
                                    <Button onClick={handleAddHistory}>+ ADAUGĂ</Button>
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

export default EditPatient;