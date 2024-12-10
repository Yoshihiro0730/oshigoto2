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
import { useCookies } from 'react-cookie';

const Header = () => {
    const { currentUser, setCustomUser } = useAuth();
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const handleLogin = () => {
        navigation('/login')
    }
    const handleHome = () => {
        navigation('/home')
    }
    const signOutHandler = async() => {
        try {
            await signOut(auth);
            removeCookie('user', { path: '/' });
            setCustomUser(null);
            alert('ログアウトに成功しました。');
        } catch (error) {
            console.error('ログアウト失敗:', error);
        }
    }
    return(
        <Box sx = {{ width: "100%" }}>
            <AppBar position="static" style={{ backgroundColor: '#fffdf3', color: '#000' }}>
                <Toolbar>
                    <div className="flex items-center flex-grow">
                        <GiDolphin className="text-2xl mx-2" onClick={handleHome} />
                        <Typography 
                            variant="h4" 
                            component="div" 
                            sx={{ 
                                flexGrow: 1, 
                                fontFamily: 'Edu AU Vic WA NT Arrows, serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                fontSize: {
                                    xs: '1.0rem',
                                    sm: '1.5rem',
                                    md: '2.0rem',
                                    lg: '2.5rem' 
                                },
                                margin: {
                                    xs: '0.5rem 0',
                                    sm: '0.75rem 0',
                                    md: '1rem 0'
                                }
                            }}
                        >
                            Oshigoto
                        </Typography>
                    </div>
                    { currentUser != null ? (
                        <Box 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1, sm: 2 },
                                ml: 'auto',
                                overflow: 'hidden'
                            }}
                        >
                            
                            <Box sx={{ 
                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                                mx: 1
                            }}>
                                <FiHeart style={{ margin: 'auto' }} />
                            </Box>
                            <Box sx={{ 
                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                                mx: 1
                            }}>
                                <TiMessages style={{ margin: 'auto' }} />
                            </Box>
                            <Button variant="outlined" color="warning" className="w-32 h-16" onClick={signOutHandler}>
                                ログアウト
                            </Button>
                        </Box>
                    ) : (
                        <Button 
                            color="inherit" 
                            onClick={handleLogin}
                            sx={{
                                fontSize: {
                                    xs: '0.8rem',
                                    sm: '0.9rem',
                                    md: '1rem'
                                },
                                padding: {
                                    xs: '4px 8px',
                                    sm: '6px 16px',
                                    md: '8px 20px'
                                },
                                minWidth: {
                                    xs: '60px',
                                    sm: '80px',
                                    md: '100px'
                                }
                            }}
                        >
                            ログイン
                        </Button>

                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header