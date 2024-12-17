import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import Typography from '@mui/material/Typography';
import { Box, Grid, Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import LikedCard from '../components/LikedCard';
import Loading from '../components/Loading';

type LikesData = {
    profile: {
        userId?: string,
        userName?: string,
        imgUrl?: string,
        roles?: string,
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
}
type LikedCardProps = {
    userId: string;
    userName: string;
    imgUrl: string;
    job_title: string;
};

const ApproveLikes: React.FC = () => {
    const [likes, setLikes] = useState<LikedCardProps[]>([]);
    const [likedUsers, setLikedUsers] = useState<LikedCardProps[]>([]);
    const [matchedUserIds, setMatchedUserIds] = useState<string[]>([]);
    const [cookies] = useCookies(['user']);
    const token = cookies.user?.token;
    const [isLoading, setIsLoading] = useState(false);
    const getLikesEndpoint = `${process.env.REACT_APP_GET_LIKES_ENDPOINT}`;
    const checkMatchEndpoint = `${process.env.REACT_APP_CHECK_MATCH_ENDPOINT}`;
    const approveLikeEndpoint = `${process.env.REACT_APP_APPROVE_LIKE_ENDPOINT}`;

    // 「もらったいいね」と「マッチング済みユーザー」を一度に取得
    useEffect(() => {
        const fetchReceivedLikesData = async () => {
            setIsLoading(true);
            if (!token) {
                console.error("トークンが見つかりません。ログインしてください。");
                return;
            }

            try {
                // 「もらったいいね」を取得
                const likesResponse = await fetch(getLikesEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });
                
                if (!likesResponse.ok) {
                    throw new Error(`いいねの取得エラー: ${likesResponse.status}`);
                }

                const likesData = await likesResponse.json();
                console.log("apiレスポンス", likesData[0].profile.user_name);

                // レスポンス内容を成形
                const users: LikedCardProps[] = likesData.map( (user: any) => ({
                    userId: user?.sender_id || "",
                    userName: user?.profile.user_name || "",
                    imgUrl: user?.profile?.profile_image_url 
                        ? `${process.env.REACT_APP_PATH}${user.profile.profile_image_url}`
                        : "",
                    job_title: user?.profile?.job_title || null
                }));
                
                setLikedUsers(users);
                const receivedLikes = likesData?.data?.received_likes || [];

                // 「マッチング済みユーザー」を取得
                const matchResponse = await fetch(checkMatchEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                if (!matchResponse.ok) {
                    throw new Error(`マッチングユーザー取得エラー: ${matchResponse.status}`);
                }

                const matchData = await matchResponse.json();
                const matchedIds = matchData?.data?.map((match: { user_id: string }) => match.user_id) || [];

                // マッチング済みユーザーを除外
                const filteredLikes = receivedLikes.filter(
                    (like: LikesData) => !matchedIds.includes(like.profile.userId)
                );

                setLikes(filteredLikes);
                setMatchedUserIds(matchedIds);
            } catch (error) {
                console.error("データ取得エラー:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReceivedLikesData();
    }, []);

    useEffect(() => {
        console.log("プロップスに渡しているもの", likedUsers);
    }, [likedUsers]);   

    // 「いいね」を承認
    const approveLike = async (senderId: string) => {
        if (!token) {
            console.error("トークンが見つかりません。ログインしてください。");
            return;
        }

        try {
            const res = await axios.post(
                approveLikeEndpoint,
                { sender_id: senderId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log("承認成功:", res.data);
            // 承認されたユーザーをリストから削除
            setLikes((prevLikes) => prevLikes.filter((like) => like.userId == senderId));
        } catch (error) {
            console.error("いいね承認エラー:", error);
        }
    };

    return (
        <div className="w-full my-4">
            {isLoading ? (<Loading title="" />) 
            :
            (
                <>
                    <Typography variant="h4" gutterBottom className="p-4">
                        もらったいいね
                    </Typography>
                    <Box
                        sx={{
                            width: '80%',
                            margin: '0 auto',
                            borderRadius: 5,
                            backgroundColor: '#f5f5f5',
                            padding: 3,
                        }}
                    >
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                            {likedUsers.map((user) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={user.userId}>
                                    <LikedCard likedUser={user} onAgreement={() => approveLike(user.userId)} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </div>
    );
};

export default ApproveLikes;
