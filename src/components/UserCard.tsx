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

type UserCardProps = {
    users:{
        userId?: string,
        userName?: string,
        imgUrl?: string,
        roles?: {
            role: string
        }[] | [],
        group?: string,
        awards?: string,
        birthday?: string,
        challenges?: string,
        dislikes?: string,
        workhistory: string,
        portfolio: string,
        specialization: string,
        free_text: string,
        job_title: string
    }
    onClick?: () => void,
}

type LikedUser = {
    userId: string,
}

const UserCard: React.FC<UserCardProps> = ({ users, onClick }) => {
    const getLikesEndpoint = `${process.env.REACT_APP_GET_LIKES_ENDPOINT}`; 
    const sendLikeEndpoint = `${process.env.REACT_APP_SEND_LIKE_ENDPOINT}`;
    const getSendLikesEndpoint = `${process.env.REACT_APP_GET_SEND_LIKE_ENDPOINT}`;
    const [isHeart, setIsHeart] = useState(false);
    const [cookies] = useCookies(['user']);
    const token = cookies.user?.token;
    const [likedUser, setLikedUser] = useState([]);
    const [sendLikedUser, setSendLikedUser] = useState([]);
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
                
                const likesUser = data.map((like: any) => like.sender_id);
                console.log(likesUser);
                setLikedUser(likesUser);

                // 自分が送ったいいねを取得
                const resLiked = await fetch(getSendLikesEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const dataLiked = await resLiked.json();
                const sendLikedUser = dataLiked.map((like: any) => like.receiver_id);
                console.log("IDリスト" ,dataLiked);
                setSendLikedUser(sendLikedUser);
                const hasLiked = sendLikedUser.includes(users.userId);
                console.log(users.userId);
                console.log(hasLiked);
                setIsHeart(hasLiked);
                
                console.log("自分が送ったいいね:", sendLikedUser);
            } catch (error) {
                console.error("いいね情報の取得エラー:", error);
            }
        };

        fetchLikes();
    }, [token, users.userId, getLikesEndpoint]);

    const handleHeart = async () => {
        if (isHeart) {
            alert("既にいいね済みです。");
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
                body: JSON.stringify({ receiver_id: users.userId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("いいね送信エラー:", errorData);
                return;
            }

            setIsHeart(true); // いいね送信成功時にボタンを青色に変更
            console.log("いいねを送信しました。")
        } catch (error) {
            console.error("予期しないエラー:", error);
        }
    };

    return (
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
                image={users.imgUrl}
                title={users.userName}
                onClick={onClick}
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
                    {users.userName}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ 
                        color: 'text.secondary' ,
                        fontFamily: 'Noto Sans JP, sans-serif',
                    
                    }}
                >
                    {users.job_title}
                </Typography>
            </CardContent>
            <CardActions>
                {isHeart ? 
                    <Button 
                        size="large" 
                        onClick={handleHeart}
                        sx={{ 
                            color: 'blue'
                        }}
                    >
                        <FaHeart />
                    </Button> 
                : 
                    <Button 
                        size="large" 
                        onClick={handleHeart}
                        sx={{
                            color: 'blue'
                        }}
                    >
                        <FiHeart />
                    </Button>
                }
            </CardActions>
        </Card>
    );
};

export default UserCard;
