import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../providers/AuthProviders';

type LikedCardProps = {
    likedUser: {
        userId: string;
        userName: string;
        imgUrl: string;
        job_title: string;
    }
};


const LikedCard: React.FC<LikedCardProps> = ({ likedUser }) => {
    const { currentUser, setToken } = useAuth();

    return (
        <div>
            <Card 
                sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 5,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }} 
                className="my-4 mx-6"
            >
                <CardMedia
                    sx={{
                            height: 140,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: 'grey.100'
                        }}
                    image={likedUser.imgUrl}
                    title={likedUser.userName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="div"
                        sx={{
                            fontFamily: 'Noto Sans JP, sans-serif',
                        }}
                    >
                        {likedUser.userName}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ 
                            color: 'text.secondary' ,
                            fontFamily: 'Noto Sans JP, sans-serif',
                        
                        }}
                    >
                        {likedUser.job_title}
                    </Typography>
                </CardContent>
                <CardActions className="flex justify-center">
                    <Button 
                        size="large" 
                        variant="outlined"
                        color="primary"
                        // onClick={handleHeart}
                    >
                            承諾する
                    </Button> 
                </CardActions>
            </Card>
        </div>
    );
};

export default LikedCard;