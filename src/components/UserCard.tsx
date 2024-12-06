import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface UserCardProps {
    userId: string,
    userName: string,
    imgUrl: string,
    description: string,
}



const UserCard: React.FC<UserCardProps> = ({ userId, userName, imgUrl, description }) => {
    const [isHeart, setIsHeart] = useState(false);
    const handleHeart = () => {
        console.log("いいねを押しました！", userId)
        setIsHeart(!isHeart);
    }
    return (
        <Card 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
                }} 
            className="my-4 mx-6">
            <CardMedia
                sx={{
                        height: 140,
                        backgroundSize: 'contain',
                        backgroundColor: 'grey.100'
                    }}
                image={imgUrl}
                title={userName}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {userName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                {isHeart ? 
                    <Button size="large" onClick={handleHeart}><FaHeart /></Button> 
                : 
                    <Button size="large" onClick={handleHeart}><FiHeart /></Button>
                }
            </CardActions>
        </Card>
    );
};

export default UserCard;