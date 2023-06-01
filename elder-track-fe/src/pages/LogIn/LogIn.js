import {React, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Typography, TextField, IconButton, InputAdornment, Button, Paper} from '@mui/material'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import '../LogIn/LogIn.css'
import {database} from '../../utils/firebase.js'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {ref, onValue} from 'firebase/database'

function LogIn() {
    
    const navigate = useNavigate();
    
    const [data, setData] = useState({email: "", password: ""});
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    };

    const schema = yup.object().shape({
        email: yup.string().email("Adresă de e-mail invalidă!")
    })

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const auth = getAuth();

    const onSubmit = () => {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;

                onValue(ref(database, `ElderTrack/Acces/${user.uid}`), (snapshot) => {
                    const data = snapshot.val();

                    sessionStorage.setItem("role", data.rol);
                    sessionStorage.setItem("uid", user.uid);

                    if(data.rol === "medic")
                    {
                        navigate("/doctor-dashboard");
                    }
                });
            })
            .catch((error) => {
                console.log("Error code:" + error.code);
                console.log("Error message:" + error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container className="login-container">
                <Paper elevation={10} className="paper">
                    <Grid item xs={12} pb={4} textAlign="center">
                        <Typography sx={{flexGrow: 1, fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontSize: '25px', fontWeight: '900', color: '#131A4C', cursor: 'pointer'}} onClick={() => {navigate("/")}}>
                            Elder<span style={{color:"#E45B5F"}}>Track</span>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} py={4}>
                        <Typography px={2} className="title">Puteți accesa contul dumneavoastră utilizând adresa de e-mail și parola asociată acestuia.</Typography>
                    </Grid>
                    <Grid item xs={12} py={1}>
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
                    <Grid item xs={12} py={1} pb={4}>
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
                    </Grid>
                    <Grid item xs={12} py={2}> 
                        <Button className="button" type="submit" variant="contained">Conectare</Button>
                    </Grid>
                </Paper>
            </Grid>
        </form>
    )
}

export default LogIn;