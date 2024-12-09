import React from 'react';
import UserCard from '../components/UserCard';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';

interface UserCardProps {
    userId: string,
    userName: string,
    imgUrl: string,
    description: string,
}

const Home: React.FC = () => {
    const users: UserCardProps[] = [
        {
            userId: "aeb7722b-454d-4942-a3d8-98c8690ede5e",
            userName: "秋元 康",
            imgUrl: "data:image/jpeg;base64,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",
            description: "こんにちは"
        },
        {
            userId: "ddd4807f-d446-40aa-b79a-8d9ba9b59830",
            userName: "つんく♂",
            imgUrl: "data:image/jpeg;base64,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",
            description: "こんにちは"
        }
    ]   

    return (
        <>
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
                                    userId={user.userId}
                                    userName={user.userName}
                                    imgUrl={user.imgUrl}
                                    description={user.description}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
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
                                    userId={user.userId}
                                    userName={user.userName}
                                    imgUrl={user.imgUrl}
                                    description={user.description}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        </>
        
    )
};

export default Home;