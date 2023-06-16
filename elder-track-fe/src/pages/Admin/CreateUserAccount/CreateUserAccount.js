import {React, useState, useEffect} from 'react'
import {Grid, Typography, TextField, IconButton, InputAdornment, Button, Paper, Select, MenuItem, InputLabel, FormControl} from '@mui/material'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import './CreateUserAccount.css'
import Navbar from '../../../components/Navbar/Navbar.js'
import {database} from '../../../utils/firebase.js'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {ref, set, onValue} from 'firebase/database'

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
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const [doctors, setDoctors] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [caregivers, setCaregivers] = useState([]);

    useEffect(() => {
        onValue(ref(database, "ElderTrack/doctor"), (snapshot) => {
            const data = snapshot.val();
            const users = Object.entries(data).filter(([doctorUID, doctor]) => !doctor.deleted)
            .map(([doctorUID, user]) => ({
                uid: doctorUID,
                firstname: user.firstname,
                lastname: user.lastname,
            }));
            setDoctors(users); 
        });

        onValue(ref(database, "ElderTrack/supervisor"), (snapshot) => {
            const data = snapshot.val();
            const users = Object.entries(data).filter(([supervisorUID, supervisor]) => !supervisor.deleted)
            .map(([supervisorUID, user]) => ({
                uid: supervisorUID,
                firstname: user.firstname,
                lastname: user.lastname,
            }));
            setSupervisors(users); 
        });

        onValue(ref(database, "ElderTrack/caregiver"), (snapshot) => {
            const data = snapshot.val();
            const users = Object.entries(data).filter(([caregiverUID, caregiver]) => !caregiver.deleted)
            .map(([caregiverUID, user]) => ({
                uid: caregiverUID,
                firstname: user.firstname,
                lastname: user.lastname,
            }));
            setCaregivers(users); 
        });
    },[]);

    const auth = getAuth();

    const onSubmit = async () => {
        if(data.userType === "patient")
        {
            let cnpList;
            await new Promise((resolve, reject) => {
                onValue(ref(database, 'ElderTrack/patient'), (snapshot) => {
                    const patient = snapshot.val();
                    if(patient) 
                    {
                        cnpList = Object.entries(patient).map(([patientUID, patient], index) => ({
                            cnp: patient.personalInfo?.CNP || '',
                        }));
                    }
                    resolve();
                }, reject);
            });

            if(!cnpList || !cnpList.some((obj) => Object.values(obj).includes(data.cnp)))
            {
                createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    const user = userCredential.user;
    
                    set(ref(database, `ElderTrack/access/${user.uid}`), {
                        role: data.userType,
                    })
                    .then(() => {
                        set(ref(database, `ElderTrack/patient/${user.uid}/careTeam`), {
                            doctorUID: data.doctor,
                            supervisorUID: data.supervisor,
                            caregiverUID: data.caregiver
                        })
                        .then(() => {
                                set(ref(database, `ElderTrack/patient/${user.uid}/personalInfo`), {
                                CNP: data.cnp,
                                firstname: data.firstname,
                                lastname: data.lastname,
                                email: data.email,
                                age: getAge(data.cnp), 
                                profession : "",
                                occupation: "", 
                                street: "", 
                                number: "", 
                                buildingNumber: "", 
                                staircase: "", 
                                floor: "", 
                                apartment: "", 
                                city: "", 
                                county: "", 
                                phoneNumber: "", 
                                allergies: ""
                            })
                            .then(() => {
                                set(ref(database, `ElderTrack/patient/${user.uid}/normalMedicalRanges`), {
                                    bloodPressureMin: 20, bloodPressureMax: 300,
                                    pulseMin: 40, pulseMax: 200,
                                    bodyTemperatureMin: 30.0, bodyTemperatureMax: 42.0,
                                    weightMin: 30.00, weightMax: 200.00,
                                    glucoseMin: 10, glucoseMax: 400,
                                    ambientTemperatureMin: 5, ambientTemperatureMax: 90,
                                    ambientHumidityMin: 40, ambientHumidityMax: 70
                                })
                                .then(() => {
                                    alert("Contul a fost creat cu succes!");
                                })
                                .catch((error) => {
                                    alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                                });
                            })
                            .catch((error) => {
                                console.error("Error saving data:", error);
                            });
                        })
                        .catch((error) => {
                            console.error("Error saving data:", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error saving data:", error);
                    });
                })
                .catch((error) => {
                    if(error.code === "auth/email-already-in-use")
                    {
                        alert("Există deja un cont înregistrat cu această adresă de e-mail!")
                    }
                    else
                    {
                        alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                    }
                });
            }
            else
            {
                alert(`Există deja un pacient în baza de date înregistrat cu acest CNP: ${data.cnp}.`);
            }
        }
        else if(data.userType === "doctor")
        {
            let cnpList;
            await new Promise((resolve, reject) => {
                onValue(ref(database, 'ElderTrack/doctor'), (snapshot) => {
                    const doctor = snapshot.val();
                    if(doctor) 
                    {
                        cnpList = Object.entries(doctor).map(([doctorUID, doctor], index) => ({
                            cnp: doctor.CNP || '',
                        }));
                    }
                    resolve();
                }, reject);
            });

            if(!cnpList.some((obj) => Object.values(obj).includes(data.cnp)))
            {
                createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    const user = userCredential.user;
    
                    set(ref(database, `ElderTrack/access/${user.uid}`), {
                        role: data.userType,
                    })
                    .then(() => {
                        set(ref(database, `ElderTrack/doctor/${user.uid}`), {
                            CNP: data.cnp,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            email: data.email
                        })
                        .then(() => {
                            alert("Contul a fost creat cu succes!");
                        })
                        .catch((error) => {
                            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                        });
                    })
                    .catch((error) => {
                        console.error("Error saving data:", error);
                    });
                })
                .catch((error) => {
                    if(error.code === "auth/email-already-in-use")
                    {
                        alert("Există deja un cont înregistrat cu această adresă de e-mail!")
                    }
                    else
                    {
                        alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                    }
                });
            }
            else
            {
                alert(`Există deja un doctor în baza de date înregistrat cu acest CNP: ${data.cnp}.`);
            }
        }
        else if(data.userType === "caregiver")
        {
            let cnpList;
            await new Promise((resolve, reject) => {
                onValue(ref(database, 'ElderTrack/caregiver'), (snapshot) => {
                    const caregiver = snapshot.val();
                    if(caregiver) 
                    {
                        cnpList = Object.entries(caregiver).map(([caregiverUID, caregiver], index) => ({
                            cnp: caregiver.CNP || '',
                        }));
                    }
                    resolve();
                }, reject);
            });

            if(!cnpList.some((obj) => Object.values(obj).includes(data.cnp)))
            {
                createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    const user = userCredential.user;
    
                    set(ref(database, `ElderTrack/access/${user.uid}`), {
                        role: data.userType,
                    })
                    .then(() => {
                        set(ref(database, `ElderTrack/caregiver/${user.uid}`), {
                            CNP: data.cnp,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            email: data.email
                        })
                        .then(() => {
                            alert("Contul a fost creat cu succes!");
                        })
                        .catch((error) => {
                            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                        })
                    })
                    .catch((error) => {
                        console.error("Error saving data:", error);
                    });
                })
                .catch((error) => {
                    if(error.code === "auth/email-already-in-use")
                    {
                        alert("Există deja un cont înregistrat cu această adresă de e-mail!")
                    }
                    else
                    {
                        alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                    }
                });
            }
            else
            {
                alert(`Există deja un îngrijitor în baza de date înregistrat cu acest CNP: ${data.cnp}.`);
            }
        }
        else if(data.userType === "supervisor")
        {
            let cnpList;
            await new Promise((resolve, reject) => {
                onValue(ref(database, 'ElderTrack/supervisor'), (snapshot) => {
                    const supervisor = snapshot.val();
                    if(supervisor) 
                    {
                        cnpList = Object.entries(supervisor).map(([supervisorUID, supervisor], index) => ({
                            cnp: supervisor.CNP || '',
                        }));
                    }
                    resolve();
                }, reject);
            });

            if(!cnpList.some((obj) => Object.values(obj).includes(data.cnp)))
            {
                createUserWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    const user = userCredential.user;
    
                    set(ref(database, `ElderTrack/access/${user.uid}`), {
                        role: data.userType,
                    })
                    .then(() => {
                        set(ref(database, `ElderTrack/supervisor/${user.uid}`), {
                            CNP: data.cnp,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            email: data.email
                        })
                        .then(() => {
                            alert("Contul a fost creat cu succes!");
                        })
                        .catch((error) => {
                            alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                        });
                    })
                    .catch((error) => {
                        console.error("Error saving data:", error);
                    });
                })
                .catch((error) => {
                    if(error.code === "auth/email-already-in-use")
                    {
                        alert("Există deja un cont înregistrat cu această adresă de e-mail!")
                    }
                    else
                    {
                        alert("A intervenit o eroare. Vă rugăm să mai încercați!");
                    }
                });
            }
            else
            {
                alert(`Există deja un supraveghetor în baza de date înregistrat cu acest CNP: ${data.cnp}.`);
            }
        }
    };

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
                                    <MenuItem value="doctor">Medic</MenuItem>
                                    <MenuItem value="patient">Pacient</MenuItem>
                                    <MenuItem value="supervisor">Supraveghetor</MenuItem>
                                    <MenuItem value="caregiver">Îngrijitor</MenuItem>
                                
                                </Select>
                            </FormControl>
                        </Grid>
                        {
                            data.userType === "patient" && (
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
                                                        <MenuItem value={doctor.uid} key={index}>Dr. {doctor.lastname} {doctor.firstname}</MenuItem>
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
                                                        <MenuItem value={supervisor.uid} key={index}>{supervisor.lastname} {supervisor.firstname}</MenuItem>
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
                                                        <MenuItem value={caregiver.uid} key={index}>{caregiver.lastname} {caregiver.firstname}</MenuItem>
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