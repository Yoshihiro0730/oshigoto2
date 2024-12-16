import React, {useState, useEffect} from "react"
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FaGoogle } from "react-icons/fa";
import Box from '@mui/system/Box';
import { FormControl, InputLabel, TextField, Typography } from '@mui/material';
import { MdOutlineEmail } from "react-icons/md";
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, provider } from "../lib/firebase";
import { useAuth } from "../providers/AuthProviders";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Resistration = () => {
    const [registData, setRegistData] = useState({
        email: "",
        password: ""
    });

    const { setToken, setCustomUser } = useAuth(); 
    const { currentUser } = useAuth();
    const navigate = useNavigate();


    const registUserEndpoint = `${process.env.REACT_APP_REGIST_ENDPOINT}`;

    const inputLoginData = (e:any) => {
        const {name, value} = e.target;
        setRegistData(data => ({
            ...data,
            [name]: value
        }))
    }

    const registUser = async() => {
        try {
            const res = await axios.post(registUserEndpoint,registData, {
                headers:{
                    "Content-Type": "application/json",
                    'ngrok-skip-browser-warning': 'true' ,
                    'Accept': 'application/json'
                }
            })
            if(res.data.tokens.access) {
                setCustomUser({
                    uid: res.data.user.id || "",
                    email: registData.email,
                    displayName: null,
                    token: res.data.tokens.access || "",
                    roles: res.data.roles || ""
                });
                setToken(res.data.tokens.access);
            }
            console.log(res.data)
            console.log("登録に成功しました。", res.data.tokens.access)
            navigate("/regist-profile")
        } catch (error) {
            console.log("ユーザー登録に失敗しました。",error)
        }
    }

    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    useEffect(() => {
        console.log(registData)
    }, [registData])

    return(
        <div className="w-full h-auto flex flex-col items-center pt-4">
            <Typography 
                className="pt-4" 
                variant="h3" 
                gutterBottom
                sx={{
                    fontSize: {
                        xs: '2rem',   
                        sm: '2.5rem', 
                        md: '3rem',   
                        lg: '3.5rem', 
                    },
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                新規アカウント登録
            </Typography>
            <Box
                sx={{
                    height: "auto",
                    width: "90%",
                    my: 4,
                    gap: 4,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: 'background.paper'
                    }}
            >
                <div className="mx-auto flex justify-center">
                    <FormControl variant="outlined" className="w-2/3">
                        <div className="my-4">
                            <InputLabel  
                                shrink 
                                sx={{
                                position: 'relative',
                                transform: 'none',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                                }}
                            >
                                <Typography variant="body1">
                                メールアドレス
                                </Typography>
                            </InputLabel>
                            <TextField
                                name="email"
                                id="custom-textfield"
                                variant="outlined"
                                placeholder="hoge@example.com"
                                value={registData.email}
                                onChange={inputLoginData}
                                fullWidth
                            />
                        </div>
                        <InputLabel 
                            shrink 
                            sx={{
                            position: 'relative',
                            transform: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                            }}
                        >
                            <Typography variant="body1">
                            パスワード
                            </Typography>
                        </InputLabel>
                        <TextField
                            name="password"
                            id="custom-textfield"
                            variant="outlined"
                            fullWidth
                            value={registData.password}
                            type="password"
                            onChange={inputLoginData}
                        />
                    </FormControl>
                </div>
                <Stack direction="row" spacing={2} className="flex justify-center my-8">
                    <Button 
                        variant="outlined" 
                        startIcon={<MdOutlineEmail />} 
                        className="w-64 h-16" 
                        sx={{borderRadius: '30px'}}
                        onClick={registUser}
                    >
                        メールアドレスで登録する
                    </Button>
                </Stack>
            </Box>
        </div>

    )
}

export default Resistration