import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";


type ImgProps = {
    title?: string;
    image?: File | null;
}

const ProfileImage: React.FC<ImgProps> = () => {
    const [cookies] = useCookies(['user']);
    const navigation = useNavigate();
    const [title, setTitle] = useState<string>("");
    const [image,setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isLoading,setIsLoading] = useState(false)


    const uploadImageEndpoint = `${process.env.REACT_APP_UPLOAD_IMAGE_ENDPOINT}`;

    // ファイル選択時のハンドラー
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setImage(selectedFile);

            const newFormData = new FormData();
            newFormData.append('profile_image', selectedFile);
            if (cookies.user?.id) {
                newFormData.append('user_id', cookies.user.id);
            }
    
            setFormData(newFormData);
    
            // プレビュー生成
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };


    const handleSubmit = async() => {
        if (!image) {
            console.log('No image selected');
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post(uploadImageEndpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${cookies.user.token}`
                }
            });
            console.log(res);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsLoading(false)
            navigation("/home")
            console.log(formData);
        }
    }
    

    return (
        <div>
            <Typography 
                className="pt-4" 
                variant="h3" 
                gutterBottom
                sx={{
                    fontSize: {
                        xs: '2rem',     
                        sm: '2.5rem',   
                        md: '3rem',     
                        lg: '3.5rem',   
                    },
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                写真登録
            </Typography>
            <Box 
                component="form" 
                noValidate 
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 400,
                    margin: '0 auto'
                }}
            >

                
                <TextField
                    id="imgUrl"
                    name="imgUrl"
                    type="file"
                    inputProps={{ accept: "image/*,.png,.jpg,.jpeg,.gif" }}
                    onChange={handleFileChange}
                    fullWidth
                    variant="outlined"
                />

                {previewUrl && (
                    <Box
                        sx={{
                            width: '100%',
                            height: 200,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'grey.100',
                            borderRadius: 1,
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            src={previewUrl}
                            alt="プレビュー"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                )}  

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!formData}
                    
                    sx={{ mt: 2 }}
                >
                    登録
                </Button>
            </Box>
        </div>
    );
};

export default ProfileImage;