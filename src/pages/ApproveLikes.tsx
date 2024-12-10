import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import Typography from '@mui/material/Typography';
import { Box, Grid, Button } from '@mui/material';
import { useCookies } from 'react-cookie';
import axios from 'axios';

interface LikeData {
    sender__user_id: string;
    sender__username: string;
    sender__email: string;
    created_at: string;
}

const ApproveLikes: React.FC = () => {
    const [likes, setLikes] = useState<LikeData[]>([]);
    const [matchedUserIds, setMatchedUserIds] = useState<string[]>([]);
    const [cookies] = useCookies(['user']);
    const token = cookies.user?.token;

    const getLikesEndpoint = `${process.env.REACT_APP_GET_LIKES_ENDPOINT}`;
    const checkMatchEndpoint = `${process.env.REACT_APP_CHECK_MATCH_ENDPOINT}`;
    const approveLikeEndpoint = `${process.env.REACT_APP_APPROVE_LIKE_ENDPOINT}`;

    // 「もらったいいね」と「マッチング済みユーザー」を一度に取得
    useEffect(() => {
        const fetchData = async () => {
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
                    (like: LikeData) => !matchedIds.includes(like.sender__user_id)
                );

                setLikes(filteredLikes);
                setMatchedUserIds(matchedIds);
            } catch (error) {
                console.error("データ取得エラー:", error);
            }
        };

        fetchData();
    }, [token, getLikesEndpoint, checkMatchEndpoint]);

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
            setLikes((prevLikes) => prevLikes.filter((like) => like.sender__user_id !== senderId));
        } catch (error) {
            console.error("いいね承認エラー:", error);
        }
    };

    return (
        <div className="w-full my-4">
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
                    {likes.map((like) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={like.sender__user_id}>
                            <UserCard
                                userId={like.sender__user_id}
                                userName={like.sender__username}
                                imgUrl="https://via.placeholder.com/150"
                                description={`送信者: ${like.sender__email}`}
                            />
                            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => approveLike(like.sender__user_id)}
                                >
                                    承認
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
};

export default ApproveLikes;
