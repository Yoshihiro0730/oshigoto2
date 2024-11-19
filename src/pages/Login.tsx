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

const Login = () => {
    const { currentUser } = useAuth();
    // Googleアカウントを使用してログイン
    const signInwithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        try {
            await signInWithPopup(auth, provider);
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

    // useEffect(() => {
    //     console.log(currentUser)
    // }, [currentUser])

    return(
        <div className="w-full h-auto flex flex-col items-center">
            <Typography className="pt-4" variant="h3" gutterBottom>ログイン</Typography>
            <Box
                sx={{
                    height: "auto",
                    width: "60%",
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
                                id="custom-textfield"
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
                            id="custom-textfield"
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                </div>
                <Stack direction="row" spacing={2} className="flex justify-center my-8">
                    <Button variant="outlined" startIcon={<MdOutlineEmail />} className="w-64 h-16" sx={{borderRadius: '30px'}}>
                        メールアドレスでログイン
                    </Button>
                </Stack>
            </Box>
            <Button variant="outlined" color="warning" className="w-32 h-16" onClick={signOutHandler}>
                    ログアウト
            </Button>
            <div>
                <a href="/regist-page">会員登録はこちら</a>
            </div>
        </div>
    )
}

export default Login