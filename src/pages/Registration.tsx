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

const Resistration = () => {
    return(
        <div className="w-full h-auto flex flex-col items-center">
            <Typography className="pt-4" variant="h3" gutterBottom>新規アカウント登録</Typography>
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
                        メールアドレスで登録する
                    </Button>
                </Stack>
            </Box>
        </div>

    )
}

export default Resistration