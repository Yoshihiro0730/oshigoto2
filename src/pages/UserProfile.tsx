import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

type UserProfileProps = {
    user: {
        userId: string,
        userName: string,
        imgUrl: string,
        roles: string,
        group: string,
        awards: string,
        birthday: string,
        challenges: string,
        dislikes: string,
        workhistory: string,
        portfolio: string,
        specialization: string,
        description: string,
        job_title: string,
        gender: string
    }
}

const UserProfile = () => {
    const location = useLocation();
    const user = location.state?.user as UserProfileProps["user"];
    useEffect(() => {
        console.log(user);
    }, []);
    return (
        <>
            <div className="flex pl-4 pt-4">
                <Typography variant="h4" component="div" 
                    sx={{
                        fontFamily: 'Noto Sans JP, sans-serif',
                        letterSpacing: '0.1em',
                        fontWeight: 'bold',
                        fontSize: {
                            xs: '2.0rem',
                            sm: '2.0rem',
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
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
            > 
                <Grid container spacing={2} display="flex" 
                        sx={{
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}
                >
                    <Box sx={{
                            flexShrink: 0,
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                            width: { xs: '100%', sm: '30%' },
                            height: { xs: 'auto', sm: 'auto' },
                            aspectRatio: "1"
                        }} 
                        className="mx-4"
                    >
                        <img src={user.imgUrl} alt={user.userName} 
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                            className="pt-4"
                        />
                    </Box>
                    <div style={{ flexGrow: 1}} className="mx-16 my-4">
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            事務所、グループ名
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.group}
                        </Typography>
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            性別
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.gender}
                        </Typography>
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            受賞履歴
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.awards}
                        </Typography>
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            得意分野
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.specialization}
                        </Typography>
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            挑戦したいこと
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.challenges}
                        </Typography>
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            NGなこと
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.dislikes}
                        </Typography>
                        <Typography variant="h4" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}
                        >
                            自由記述欄
                        </Typography>
                        <Typography variant="h6" component="div" 
                            sx={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                                letterSpacing: '0.1em',
                                marginBottom: 4 
                            }}
                        >
                            {user.description}
                        </Typography>
                    </div>
                
                </Grid>
            </Box>
        </>
    )
}

export default UserProfile;
