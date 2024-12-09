import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useCookies } from 'react-cookie';
import { useAuth } from "../providers/AuthProviders";

interface UserCardProps {
    userId: string;
    userName: string;
    imgUrl: string;
    description: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId, userName, imgUrl, description }) => {
    const getLikesEndpoint = `${process.env.REACT_APP_GET_LIKES_ENDPOINT}`; 
    const sendLikeEndpoint = `${process.env.REACT_APP_SEND_LIKE_ENDPOINT}`;
    // const getLikesEndpoint = "https://9453-1-75-223-48.ngrok-free.app/api/get-likes/"; 
    // const sendLikeEndpoint = "https://9453-1-75-223-48.ngrok-free.app/api/send-like/";
    const [isHeart, setIsHeart] = useState(false);
    const [cookies] = useCookies(['user']);
    const token = cookies.user?.token;

    useEffect(() => {
        const fetchLikes = async () => {
            if (!token) {
                console.error("トークンが見つかりません。ログインしてください。");
                return;
            }

            try {
                const res = await fetch(getLikesEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTPエラー: ${res.status}`);
                }

                const data = await res.json();
                const sentLikes = data?.data?.sent_likes || [];
                const hasLiked = sentLikes.some((like: any) => like.receiver__user_id === userId);
                setIsHeart(hasLiked);
            } catch (error) {
                console.error("いいね情報の取得エラー:", error);
            }
        };

        fetchLikes();
    }, [token, userId, getLikesEndpoint]);

    const handleHeart = async () => {
        if (isHeart) {
            console.log("既にいいね済みです。");
            return;
        }

        if (!token) {
            console.error("トークンが見つかりません。ログインしてください。");
            return;
        }

        try {
            const res = await fetch(sendLikeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ receiver_id: userId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("いいね送信エラー:", errorData);
                return;
            }

            setIsHeart(true); // いいね送信成功時にボタンを青色に変更
        } catch (error) {
            console.error("予期しないエラー:", error);
        }
    };

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
