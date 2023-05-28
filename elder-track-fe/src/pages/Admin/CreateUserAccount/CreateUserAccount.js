import {React, useState} from 'react'
import {Grid, Typography, TextField, IconButton, InputAdornment, Button, Paper, Select, MenuItem, InputLabel, FormControl} from '@mui/material'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import './CreateUserAccount.css'
import Navbar from '../../../components/Navbar/Navbar.js'

function CreateUserAccount() {
    
    const [data, setData] = useState({lastname: "", firstname: "", cnp: "", email: "", userType: "", doctor: "", supervisor: "", caregiver: "", password: ""});
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    };

    const schema = yup.object().shape({
        lastname: yup.string().matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, "Nume invalid!"),
        firstname: yup.string().matches(/[a-zA-ZăâîșțĂÂÎȘȚ -]+$/, "Prenume invalid!"),
        cnp: yup.string().min(13, "CNP invalid!").max(13, "CNP invalid!"),
        email: yup.string().email("Adresa de e-mail este invalidă!"),
        password: yup.string().min(8, "Parola trebuie să conțină minim 8 caractere!").max(32, "Parola trebuie să conțină maxim 32 de caractere!")
    })

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = () => {
       console.log(data);
    };

    const doctors = [
        {cnp: '1234567896432', lastname: 'Popescu', firstname: 'Ion'},
        {cnp: '1234567896435', lastname: 'Pop', firstname: 'Andrei'},
    ];

    const supervisors = [
        {cnp: '1234567896432', lastname: 'Stan', firstname: 'Ion'},
        {cnp: '1234567896435', lastname: 'Pop', firstname: 'George'},
    ];

    const caregivers = [
        {cnp: '1234567896432', lastname: 'Stanescu', firstname: 'Alex'},
        {cnp: '1234567896435', lastname: 'Albu', firstname: 'Timeea'},
    ];

    return (
        <>
        <Navbar/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container className="create-user-container">
                <Paper elevation={10} className="paper">
                    <Grid container spacing={2}>
                        <Grid item xs={12} py={2}>
                            <Typography className="title">Înregistrare utilizator</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                required
                                type="text"
                                label="Nume"
                                placeholder="Introduceți numele"
                                variant="outlined"
                                fullWidth
                                {...register("lastname")} 
                                value={data.lastname}
                                onChange={handleChange}
                            />
                            <Typography className="error">{errors.lastname?.message}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                required
                                type="text"
                                label="Prenume"
                                placeholder="Introduceți prenumele"
                                variant="outlined"
                                fullWidth
                                {...register("firstname")} 
                                value={data.firstname}
                                onChange={handleChange}
                            />
                            <Typography className="error">{errors.firstname?.message}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                required
                                type="text"
                                label="CNP (Cod Numeric Personal)"
                                placeholder="Introduceți CNP-ul"
                                variant="outlined"
                                fullWidth
                                {...register("cnp")} 
                                value={data.cnp}
                                onChange={handleChange}
                            />
                            <Typography className="error">{errors.cnp?.message}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="select-user-type">Tip utilizator</InputLabel>
                                <Select
                                    required
                                    labelId="select-user-type"
                                    label="Tip utilizator"
                                    name="userType"
                                    value={data.userType}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="medic">Medic</MenuItem>
                                    <MenuItem value="pacient">Pacient</MenuItem>
                                    <MenuItem value="supraveghetor">Supraveghetor</MenuItem>
                                
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            data.userType === "pacient" && (
                                <>
                                    <Grid item xs={4}> 
                                        <FormControl fullWidth>
                                            <InputLabel id="select-user">Medic</InputLabel>
                                            <Select
                                                required
                                                labelId="select-user"
                                                label="Medic"
                                                name="doctor"
                                                value={data.doctor}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {doctors.map((doctor, index) => {
                                                    return(
                                                        <MenuItem value={doctor.cnp} key={index}>Dr. {doctor.lastname} {doctor.firstname}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}> 
                                        <FormControl fullWidth>
                                            <InputLabel id="select-user">Supraveghetor</InputLabel>
                                            <Select
                                                required
                                                labelId="select-user"
                                                label="Supraveghetor"
                                                name="supervisor"
                                                value={data.supervisor}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {supervisors.map((supervisor, index) => {
                                                    return(
                                                        <MenuItem value={supervisor.cnp} key={index}>{supervisor.lastname} {supervisor.firstname}</MenuItem>
                                                    )
                                                })}
                                            
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}> 
                                        <FormControl fullWidth>
                                            <InputLabel id="select-user">Îngrijitor</InputLabel>
                                            <Select
                                                required
                                                labelId="select-user"
                                                label="Îngrijitor"
                                                name="caregiver"
                                                value={data.caregiver}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {caregivers.map((caregiver, index) => {
                                                    return(
                                                        <MenuItem value={caregiver.cnp} key={index}>{caregiver.lastname} {caregiver.firstname}</MenuItem>
                                                    )
                                                })}
                                            
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        <Grid item xs={12} md={6}>
                            <TextField 
                                required
                                type="text"
                                label="E-mail"
                                placeholder="Introduceți adresa de e-mail"
                                variant="outlined"
                                fullWidth
                                {...register("email")} 
                                value={data.email}
                                onChange={handleChange}
                            />
                            <Typography className="error">{errors.email?.message}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                required
                                type={showPassword ? 'text' : 'password'}
                                label="Parola"
                                placeholder="Introduceți parola"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }}
                                {...register("password")} 
                                value={data.password}
                                onChange={handleChange}
                            />
                            <Typography className="error">{errors.password?.message}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} py={3}> 
                        <Button className="button" type="submit" variant="contained">Înregistrare</Button>
                    </Grid>
                </Paper>
            </Grid>
        </form>
        </>
    )
}

export default CreateUserAccount;