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
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";

interface LoginProps {
    email: string,
    password: string,
    uid: string,
    displayName: string,
    gmail: string
}

const Login = () => {
    const { currentUser } = useAuth();
    const { setToken, setCustomUser } = useAuth(); 
    const navigation = useNavigate();
    const [isProfile, setIsProfile] = useState(null);
    const [isLoading,setIsLoading] = useState(false)
    const [loginParam, setLoginParam] = useState({
        email: "",
        password: ""
    })
    const [googleParam, setGoogleParam] = useState({
        uid: "",
        displayName: "",
        gmail: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    // const googleEndpoint = "XXXXXX";
    const loginEndpoint = `${process.env.REACT_APP_LOGIN_ENDPOINT}`;

    // Googleアカウントを使用してログイン
    const signInwithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Googleの情報をjson式に格納
            setGoogleParam({
                uid: user.uid,
                displayName: user.displayName as string,
                gmail: user.email as string
            })
        } catch (error) {
        console.log('Googleサインインエラー:', error);
        console.error(error);
        }
    };

    const signOutHandler = async() => {
        try {
            await signOut(auth);
            console.log('ログアウトに成功しました。');
        } catch (error) {
            console.error('ログアウト失敗:', error);
        }
    }
    
    // const registGoogle = async() => {
    //     try {
    //         const res = await axios.post(googleEndpoint,googleParam, {
    //             headers:{
    //                 "Content-Type": "application/json"
    //             }
    //         })
    //     } catch (error) {
    //         console.log("Google登録に失敗しました。",error)
    //     }
    // }

    // メール・パスワード認証
    useEffect(() => {
        // console.log(loginParam);
        // console.log(currentUser);
        console.log(googleParam);
        // registGoogle();
    }, [googleParam]);

    const postHandler = async() => {
        if (isSubmitting) return;
        setIsLoading(true);
        try {
            setIsSubmitting(true);
            const res = await axios.post(loginEndpoint, loginParam);
            setLoginParam({
                email: "",
                password:""
            })
            console.log(res.data);
            // setIsProfile(res.data.profile_created_at);
            if(res.data.access) {
                setCustomUser({
                    uid: "",
                    email: loginParam.email,
                    displayName: null,
                    token: res.data.access,
                    roles: res.data.roles[0]
                });
                setToken(res.data.access);
            }
            console.log(res);
            if(res.data.profile_created_at === null) {
                navigation("/regist-profile");
            } else {
                navigation("/home");
            }
        } catch(error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    } 

    useEffect(() => {
        console.log(loginParam);
    }, [loginParam]);

    return(
        <>
            {isLoading ? (<Loading title="ログイン中" />) 
                : 
            (
                <div className="w-full h-auto flex flex-col items-center">
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
                    ログイン
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
                    {/* Google認証ボタン */}
                    <Stack direction="row" spacing={2} className="flex justify-center">
                        <Button variant="outlined" startIcon={<FaGoogle />}  className="w-64 h-16" onClick={signInwithGoogle}>
                            Google認証
                        </Button>
                    {/* メールアドレスログインフォーム欄 */}
                    </Stack>
                    <div className="my-4 text-center">または</div>
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
                                    value={loginParam.email}
                                    onChange={(e) =>{
                                        setLoginParam({...loginParam, email: e.target.value})
                                    }}
                                    id="input-email"
                                    variant="outlined"
                                    placeholder="hoge@example.com"
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
                                value={loginParam.password}
                                onChange={(e) =>{
                                    setLoginParam({...loginParam, password: e.target.value})
                                }}
                                id="input-password"
                                variant="outlined"
                                type='password'
                                fullWidth
                            />
                        </FormControl>
                    </div>
                    <Stack direction="row" spacing={2} className="flex justify-center my-8">
                        <Button 
                            variant="outlined" 
                            startIcon={<MdOutlineEmail />} 
                            className="w-64 h-16" 
                            sx={{borderRadius: '30px'}} 
                            onClick={postHandler}
                        >
                            メールアドレスでログイン
                        </Button>
                    </Stack>
                    <div className="text-center">
                        <a href="/regist-page" style={{ color: 'blue', textDecoration: 'underline' }}>
                            会員登録はこちら
                        </a>
                    </div>
                </Box>
                {/* <Button variant="outlined" color="warning" className="w-32 h-16" onClick={signOutHandler}>
                        ログアウト
                </Button> */}
                </div>
            )}
            </>
        
    )
}

export default Login