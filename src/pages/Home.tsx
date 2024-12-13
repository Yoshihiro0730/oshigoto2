import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
interface UserCardProps {
    userId: string,
    userName: string,
    imgUrl?: string | null,
    description?: string | null,
    onClick: () => void;
}

type FetchUser = {
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
    free_text: string,
    job_title: string, 
    gender: string
}

const Home: React.FC = () => {
    const [users, setUsers] = useState<FetchUser[]>([]);
    const navigate = useNavigate();
    const getUserEndpoint = `${process.env.REACT_APP_GET_USER_ENDPOINT}`;
    const [cookies] = useCookies(['user']);
    
    const getUserRole = () => {
        if (!cookies.user) return '';
        return cookies.user.roles || '';
    };

    const userRole = getUserRole();
    const showArtist = !userRole || userRole === 'artist';
    const showCreator = !userRole || userRole === 'creator';

    const fetchUser = async() => {
        try{
            const res = await fetch(`${getUserEndpoint}?limit=50`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
            });
            const response = await res.json();
            const users: FetchUser[] = response.map( (user: any) => ({
                userId: user.user_id,
                userName: user.profile?.user_name || "",
                imgUrl: `${process.env.REACT_APP_PATH}` + user.profile?.profile_image_url || "",
                roles: user.roles || "",
                group: user.profile?.agency_or_group || "",
                awards: user.profile?.awards || "",
                birthday: user.profile?.birth_date || "",
                challenges: user.profile?.challenges || "",
                dislikes: user.profile?.dislikes || null,
                workhistory: user.profile?.workhistory || null,
                portfolio: user.profile?.portfolio || null,
                specialization: user.profile?.specialization || null,
                free_text: user.profile?.free_text || null,
                job_title: user.profile?.job_title || null,
                gender: user.profile?.gender || null
            }));
            console.log(users);
            setUsers(users);
        } catch (error) {
            console.log('ユーザー取得に失敗しました。');
            console.log(error);
        }

    }

    
    const handleUserClick = (user: FetchUser) => {
        navigate(`/user-profile/${user.userId}`, { 
            state: { 
                user: {
                    userId: user.userId,
                    userName: user.userName,
                    imgUrl: user.imgUrl,
                    description: user.free_text,
                    roles: user.roles,
                    group: user.group,
                    awards: user.awards,
                    birthday: user.birthday,
                    challenges: user.challenges,
                    dislikes: user.dislikes,
                    workhistory: user.workhistory,
                    portfolio: user.portfolio,
                    specialization: user.specialization,
                    job_title: user.job_title,
                    gender: user.gender
                } 
            } 
        });
    };

    

    useEffect(() => {
        fetchUser();
        // console.log(cookies.user.roles);
    }, []);

    return (
        <>
            {showArtist && (
                <div className='w-full my-4'>
                    <Typography variant="h4" gutterBottom className="p-4">
                            制作者
                    </Typography>
                    <Box sx={{ width: '80%', margin: '0 auto', borderRadius: 5 ,backgroundColor: '#f5f5f5', padding: 3 }}> 
                        <Grid 
                            container 
                            spacing={3} 
                            justifyContent="center"
                            alignItems="center"
                        >
                            {users.map((user, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <UserCard
                                        users={user}
                                        onClick={() => handleUserClick(user)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </div>
            )}
            {showCreator && (
                <div className='w-full'>
                    <Typography variant="h4" gutterBottom className="p-4">
                        アーティスト
                    </Typography>
                    <Box sx={{ width: '80%', margin: '0 auto', borderRadius: 5 ,backgroundColor: '#f5f5f5', padding: 3 }}> 
                        <Grid 
                            container 
                            spacing={3} 
                            justifyContent="center"
                            alignItems="center"
                        >
                            {users.map((user, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <UserCard
                                        users={user}
                                        onClick={() => handleUserClick(user)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </div>
            )}
        </>
        
    )
};

export default Home;