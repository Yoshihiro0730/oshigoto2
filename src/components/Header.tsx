import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { GiDolphin } from "react-icons/gi";
import { useAuth } from '../providers/AuthProviders';
import { FiHeart } from "react-icons/fi";
import { TiMessages } from "react-icons/ti";
import { signOut } from 'firebase/auth';
import { auth } from "../lib/firebase";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { currentUser } = useAuth();
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = () => {
        navigation('/login')
    }
    const signOutHandler = async() => {
        try {
            await signOut(auth);
            console.log('ログアウトに成功しました。');
        } catch (error) {
            console.error('ログアウト失敗:', error);
        }
    }
    return(
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: '#fffdf3', color: '#000' }}>
            <Toolbar>
                <div className="flex items-center flex-grow">
                    <GiDolphin className="text-2xl mx-6"/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        推仕事
                    </Typography>
                </div>
                { currentUser != null ? (
                    <div className="flex mx-4" style={{ fontSize: '2rem' }}>
                        <FiHeart className='mx-4 my-auto'/>
                        <TiMessages className='mx-4 my-auto'/>
                        <Button variant="outlined" color="warning" className="w-32 h-16" onClick={signOutHandler}>
                            ログアウト
                        </Button>
                    </div>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>ログイン</Button>

                )}
            </Toolbar>
        </AppBar>
        </Box>
    )
}

export default Header