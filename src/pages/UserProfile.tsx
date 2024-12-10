import React from "react";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

type UserProfileProps = {
    user: {
        userId: string;
        userName: string;
        imgUrl: string;
        description: string;
    }
}

const UserProfile = () => {
    const location = useLocation();
    const user = location.state?.user as UserProfileProps["user"];
    return (
        <>
            <div className="flex pl-4 pt-4">
                <Typography variant="h4" component="div" 
                    sx={{
                        fontFamily: 'Edu AU Vic WA NT Arrows, serif',
                        letterSpacing: '0.1em',
                        fontWeight: 'bold',
                        fontSize: {
                            xs: '1.0rem',
                            sm: '1.5rem',
                            md: '2.0rem',
                            lg: '2.5rem' 
                        },
                        textAlign: { xs: 'center', sm: 'left' },
                        width: '100%' 
                    }}
                >
                    {user.userName}
                </Typography>
            </div>
            <Box sx={{
                        width: '90%', 
                        margin: '2rem auto', 
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                        padding: 3,
                    }}
            > 
                <Grid container spacing={3} display="flex" 
                        sx={{
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}
                >
                    <Box sx={{
                            flexShrink: 0,
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                            width: "30%",
                            height: "auto"
                        }} 
                        className="mx-4"
                    >
                        <img src={user.imgUrl} alt={user.userName} 
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                    <div style={{ flexGrow: 1}} className="mx-16">
                        <Typography variant="h5" component="div" 
                            sx={{
                                fontFamily: 'Edu AU Vic WA NT Arrows, serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            概要
                        </Typography>
                        <div>{user.description}</div>
                    </div>
                
                </Grid>
            </Box>
        </>
    )
}

export default UserProfile;
