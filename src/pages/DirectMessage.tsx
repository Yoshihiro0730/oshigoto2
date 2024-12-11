import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { useCookies } from 'react-cookie';

interface MatchedUser {
    user_id: string;
    user_name: string | null;
    profile_image: string | null;
    matched_at: string;
}

const DirectMessage: React.FC = () => {
    const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);
    const [cookies] = useCookies(['user']);
    const token = cookies.user?.token;

    const checkMatchEndpoint = `${process.env.REACT_APP_CHECK_MATCH_ENDPOINT}`;

    // 「マッチング済みユーザー」を取得
    useEffect(() => {
        const fetchMatchedUsers = async () => {
            if (!token) {
                console.error("トークンが見つかりません。ログインしてください。");
                return;
            }

            try {
                const res = await fetch(checkMatchEndpoint, {
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
                setMatchedUsers(data?.data || []);
            } catch (error) {
                console.error("マッチング情報の取得エラー:", error);
            }
        };

        fetchMatchedUsers();
    }, [token, checkMatchEndpoint]);

    return (
        <div className="w-full my-4">
            <Typography variant="h4" gutterBottom className="p-4">
                マッチング済みのユーザー
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
                <List>
                    {matchedUsers.map((user) => (
                        <ListItem key={user.user_id} sx={{ marginBottom: 2, borderBottom: '1px solid #ddd' }}>
                            <ListItemAvatar>
                                <Avatar
                                    src={user.profile_image || "https://via.placeholder.com/150"}
                                    alt={user.user_name || "User"}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.user_name || "名前未設定"}
                                secondary={`マッチング日: ${new Date(user.matched_at).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </div>
    );
};

export default DirectMessage;
