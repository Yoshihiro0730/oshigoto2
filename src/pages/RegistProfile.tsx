import React, { useState, useRef, useEffect, useContext } from "react"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../providers/AuthProviders";
import { useCookies } from 'react-cookie';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    width: {
        xs: '90%', 
        sm: '400px', 
    },
};

interface ProfileProps {
    jobType: string,
}

const ResistProfile: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isBirthday, setIsBirthday] = useState(false);
    const [jobType, setJobType] = useState({
        role: ""
    })
    const [error, setError] = useState(false);
    const navigation = useNavigate();
    const [isLoading,setIsLoading] = useState(false)
    const [birthYear, setBirthYear] = useState("")
    const [birthMonth, setBirthMonth] = useState("")
    const [birthDay, setBirthDay] = useState("")
    const [userProfile, setUserProfile] = useState({
        user_name: "",
        agency_or_group: "",
        birth_date: "",
        gender: "",
        job_title: "",
        workhistory: "",
        skills: "",
        awards: "",
        portfolio: "",
        specialization: "",
        challenges: "",
        dislikes: "",
        free_text: "",
        imgUrl: ""
    })
    const { currentUser, setToken } = useAuth();
    const [cookies] = useCookies(['user']);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 年月日の選択肢を生成
    const years = Array.from({length: 100}, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const days = Array.from({length: 31}, (_, i) => i + 1);

    const roleEndpoint = `${process.env.REACT_APP_ASSIGN_ROLE_ENDPOINT}`;
    const profileEndpoint = `${process.env.REACT_APP_REGIST_PROFILE_ENDPOINT}`;

    const handleInputData = (e: any) => {
        const { name, value, files } = e.target;
        setUserProfile(data => ({
            ...data,
            [name]: name === 'age' ? parseInt(value, 10) : value
        }));
    }

    const handleButton = async(job: string) => {
        console.log('Cookie中のユーザー情報:', cookies.user);
        console.log('Context中のユーザー情報:', currentUser);
        try{
            setJobType(prev => ({
                ...prev,
                role: job
            }));
            const res = await axios.post(roleEndpoint,
                { "role": job}, 
                {
                    headers: {
                        "Content-Type": "application/json" ,
                        "Authorization": `Bearer ${currentUser?.token}`,
                    }
                }
            );
            console.log(currentUser?.token);
            console.log(res.data);
            setIsOpen(false);
        } catch (error) {
            console.log("役割登録でエラーが発生しました。",error);
        }
    }

    const ModalHandler = () => {
        setIsOpen(false);
    }

    const birthHandler = () => {
        setIsBirthday(!isBirthday);
    }

    const registHandler = async() => {
        setIsLoading(true);
        try {
            const response = await axios.post(profileEndpoint, userProfile, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentUser?.token}` 
                }
            })
            if(response.data.token) {
                setToken(response.data.token);
            }
            console.log(response)
        } finally {
            setIsLoading(false)
            
            navigation("/profile-image")
            console.log(userProfile)
        }
    };

    useEffect(() => {
        console.log(jobType);
        console.log(userProfile)
    }, [userProfile])

    useEffect(() => {
        if (birthYear && birthMonth && birthDay) {
            const formattedMonth = birthMonth.toString().padStart(2, '0');
            const formattedDay = birthDay.toString().padStart(2, '0');
            const formattedDate = `${birthYear}-${formattedMonth}-${formattedDay}`;
            
            setUserProfile(prev => ({
                ...prev,
                birth_date: formattedDate
            }));
        }
    }, [birthYear, birthMonth, birthDay]);

    return(
        <>
        {isLoading ? (
            <Loading title="登録中" />
        ) : (
            <div>
            
                <Modal
                    open={isOpen}
                    onClose={ModalHandler}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h5" className="text-center">
                            あなたは？
                        </Typography>
                        <div className="flex flex-col"> 
                            <div className="my-4 mx-auto">
                                <Button 
                                    onClick={() => handleButton("artist")} 
                                    variant="contained" 
                                    color="success"
                                    sx={{
                                        width: 200,
                                        fontSize: "1.2rem"
                                    }}
                                >
                                    アーティスト
                                </Button>
                            </div>
                            <div className="my-4 mx-auto">
                                <Button 
                                    onClick={() => handleButton("creator")} 
                                    variant="contained" 
                                    color="secondary"
                                    sx={{
                                        width: 200,
                                        fontSize: "1.2rem"
                                    }}
                                >
                                    制作者
                                </Button>
                            </div>
                        </div>
                    </Box>
                </Modal>
                
                <div>
                    {jobType.role == "artist" ? (
                        // アーティスト入力欄
                        <Card 
                            sx={{ 
                                width: {
                                    xs: '90%', 
                                    sm: '60%'   
                                }
                            }} 
                            className="mx-auto mt-4"
                        >
                            <CardContent>
                                <Typography 
                                    gutterBottom 
                                    variant="h4" 
                                    component="div" 
                                    className="underline"
                                    sx={{
                                        fontSize: {
                                            xs: '1.5rem',    
                                            sm: '2rem',      
                                            md: '2.5rem',    
                                        },
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}
                                >
                                    詳細情報
                                </Typography>

                                {/* 名前入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        お名前
                                    </Typography>
                                    <TextField 
                                        name="user_name"
                                        id="user-name"
                                        label="お名前" 
                                        variant="outlined" 
                                        fullWidth 
                                        required 
                                        value={userProfile.user_name}
                                        onChange={handleInputData}
                                    />
                                </div>

                                {/* 事務所、グループ名入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        事務所・グループ名
                                    </Typography>
                                    <TextField 
                                        name="agency_or_group"
                                        id="user-group" 
                                        label="事務所・グループ名" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.agency_or_group}
                                        onChange={handleInputData}
                                    />
                                </div>

                                {/* 年齢入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        誕生日
                                    </Typography>
                                    <div className="flex gap-4">
                                        <FormControl fullWidth>
                                            <InputLabel>年</InputLabel>
                                            <Select
                                                value={birthYear}
                                                label="年"
                                                onChange={(e) => setBirthYear(e.target.value)}
                                            >
                                                {years.map((year) => (
                                                    <MenuItem key={year} value={year}>
                                                        {year}年
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>月</InputLabel>
                                            <Select
                                                value={birthMonth}
                                                label="月"
                                                onChange={(e) => setBirthMonth(e.target.value)}
                                            >
                                                {months.map((month) => (
                                                    <MenuItem key={month} value={month}>
                                                        {month}月
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>日</InputLabel>
                                            <Select
                                                value={birthDay}
                                                label="日"
                                                onChange={(e) => setBirthDay(e.target.value)}
                                            >
                                                {days.map((day) => (
                                                    <MenuItem key={day} value={day}>
                                                        {day}日
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                {/* 性別入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        性別
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">性別</InputLabel>
                                        <Select
                                            name="gender"
                                            labelId="user-gender"
                                            id="use-gender"
                                            label="gender"
                                            required
                                            onChange={handleInputData}
                                        >
                                        <MenuItem value={"選択しない"}>未選択</MenuItem>
                                        <MenuItem value={"男性"}>男性</MenuItem>
                                        <MenuItem value={"女性"}>女性</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* 職種入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        職種
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">職種</InputLabel>
                                        <Select
                                            name="job_title"
                                            labelId="user-job"
                                            id="use-job"
                                            label="job"
                                            onChange={handleInputData}
                                            required
                                        >
                                        <MenuItem value={"actor"}>俳優・役者</MenuItem>
                                        <MenuItem value={"singer"}>歌手</MenuItem>
                                        <MenuItem value={"idol"}>アイドル</MenuItem>
                                        <MenuItem value={"writer"}>作家</MenuItem>
                                        <MenuItem value={"others"}>その他</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* 職種入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        職歴
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">職種</InputLabel>
                                        <Select
                                            name="workhistory"
                                            labelId="user-job"
                                            id="use-job"
                                            label="job"
                                            onChange={handleInputData}
                                            required
                                        >
                                        <MenuItem value={"actor"}>俳優・役者</MenuItem>
                                        <MenuItem value={"singer"}>歌手</MenuItem>
                                        <MenuItem value={"idol"}>アイドル</MenuItem>
                                        <MenuItem value={"writer"}>作家</MenuItem>
                                        <MenuItem value={"others"}>その他</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* 受賞歴入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        受賞履歴
                                    </Typography>
                                    <TextField 
                                        name="awards"
                                        id="user-award" 
                                        label="受賞履歴" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.awards}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* 得意なこと入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        特技
                                    </Typography>
                                    <TextField 
                                        name="specialization"
                                        id="user-specialization" 
                                        label="特技" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.specialization}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* 挑戦したいこと入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        挑戦したいこと
                                    </Typography>
                                    <TextField 
                                        name="challenges"
                                        id="user-challenge" 
                                        label="挑戦したいこと" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.challenges}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* NGなこと入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        NGなこと
                                    </Typography>
                                    <TextField 
                                        name="dislikes"
                                        id="user-dislike" 
                                        label="NGなこと" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.dislikes}
                                        onChange={handleInputData}
                                        multiline
                                    />
                                </div>

                                {/* 自由記述入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        自由記述欄
                                    </Typography>
                                    <TextField 
                                        name="free_text"
                                        id="user-free" 
                                        label="自由記述欄" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.free_text}
                                        onChange={handleInputData}
                                        multiline
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                            <div className="flex justify-center">
                                <CardActions>
                                    <Button size="large" variant="contained" onClick={registHandler}>登録</Button>
                                </CardActions>
                            </div>
                        </Card>
                    ) : (

                        // 制作者側入力フォーム
                        <Card 
                        sx={{ 
                            width: {
                                xs: '90%', 
                                sm: '60%'   
                            }
                        }}
                            className="mx-auto mt-4"
                        >
                            <CardContent>
                                <Typography gutterBottom variant="h4" component="div" className="underline">
                                    詳細情報
                                </Typography>
                                {/* 名前入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        お名前
                                    </Typography>
                                    <TextField 
                                        name="user_name"
                                        id="user-name"
                                        label="お名前" 
                                        variant="outlined" 
                                        fullWidth 
                                        required 
                                        value={userProfile.user_name}
                                        onChange={handleInputData}
                                    />
                                </div>

                                {/* 事務所、グループ名入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        事務所
                                    </Typography>
                                    <TextField 
                                        name="agency_or_group"
                                        id="user-group" 
                                        label="事務所" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.agency_or_group}
                                        onChange={handleInputData}
                                    />
                                </div>

                                {/* 年齢入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        誕生日
                                    </Typography>
                                    <div className="flex gap-4">
                                        <FormControl fullWidth>
                                            <InputLabel>年</InputLabel>
                                            <Select
                                                value={birthYear}
                                                label="年"
                                                onChange={(e) => setBirthYear(e.target.value)}
                                            >
                                                {years.map((year) => (
                                                    <MenuItem key={year} value={year}>
                                                        {year}年
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>月</InputLabel>
                                            <Select
                                                value={birthMonth}
                                                label="月"
                                                onChange={(e) => setBirthMonth(e.target.value)}
                                            >
                                                {months.map((month) => (
                                                    <MenuItem key={month} value={month}>
                                                        {month}月
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>日</InputLabel>
                                            <Select
                                                value={birthDay}
                                                label="日"
                                                onChange={(e) => setBirthDay(e.target.value)}
                                            >
                                                {days.map((day) => (
                                                    <MenuItem key={day} value={day}>
                                                        {day}日
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                {/* 性別入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        性別
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">性別</InputLabel>
                                        <Select
                                            name="gender"
                                            labelId="user-gender"
                                            id="use-gender"
                                            label="gender"
                                            required
                                            onChange={handleInputData}
                                        >
                                        <MenuItem value={"選択しない"}>未選択</MenuItem>
                                        <MenuItem value={"男性"}>男性</MenuItem>
                                        <MenuItem value={"女性"}>女性</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* 職種入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        職種
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">職種</InputLabel>
                                        <Select
                                            name="job"
                                            labelId="user-job"
                                            id="use-job"
                                            label="job"
                                            onChange={handleInputData}
                                            required
                                        >
                                        <MenuItem value={"actor"}>俳優・役者</MenuItem>
                                        <MenuItem value={"singer"}>歌手</MenuItem>
                                        <MenuItem value={"idol"}>アイドル</MenuItem>
                                        <MenuItem value={"writer"}>作家</MenuItem>
                                        <MenuItem value={"others"}>その他</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* 職種入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        職歴
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">職種</InputLabel>
                                        <Select
                                            name="workhistory"
                                            labelId="user-job"
                                            id="use-job"
                                            label="job"
                                            onChange={handleInputData}
                                            required
                                        >
                                        <MenuItem value={"actor"}>俳優・役者</MenuItem>
                                        <MenuItem value={"singer"}>歌手</MenuItem>
                                        <MenuItem value={"idol"}>アイドル</MenuItem>
                                        <MenuItem value={"writer"}>作家</MenuItem>
                                        <MenuItem value={"others"}>その他</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* 受賞歴入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        スキル
                                    </Typography>
                                    <TextField 
                                        name="skills"
                                        id="user-skills" 
                                        label="スキル" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.skills}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>


                                {/* 受賞歴入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        受賞履歴
                                    </Typography>
                                    <TextField 
                                        name="awards"
                                        id="user-award" 
                                        label="受賞履歴" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.awards}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* ポートフォリオフィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        ポートフォリオ
                                    </Typography>
                                    <TextField 
                                        name="portfolio"
                                        id="user-portfolio" 
                                        label="ポートフォリオ" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.portfolio}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* 得意なこと入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        得意な分野
                                    </Typography>
                                    <TextField 
                                        name="specialization"
                                        id="user-specialization" 
                                        label="得意な分野" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.specialization}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* 挑戦したいこと入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        挑戦したいこと
                                    </Typography>
                                    <TextField 
                                        name="challenges"
                                        id="user-challenge" 
                                        label="挑戦したいこと" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.challenges}
                                        onChange={handleInputData}
                                        multiline
                                        rows={6}
                                    />
                                </div>

                                {/* NGなこと入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        NGなこと
                                    </Typography>
                                    <TextField 
                                        name="dislikes"
                                        id="user-dislike" 
                                        label="NGなこと" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.dislikes}
                                        onChange={handleInputData}
                                        multiline
                                    />
                                </div>

                                {/* 自由記述入力フィールド */}
                                <div className="my-4">
                                    <Typography gutterBottom variant="h6" component="div">
                                        自由記述欄
                                    </Typography>
                                    <TextField 
                                        name="free_text"
                                        id="user-free" 
                                        label="自由記述欄" 
                                        variant="outlined" 
                                        fullWidth 
                                        value={userProfile.free_text}
                                        onChange={handleInputData}
                                        multiline
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                            <div className="flex justify-center">
                                <CardActions>
                                    <Button size="large" variant="contained" onClick={registHandler}>登録</Button>
                                </CardActions>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        )
    }
        
        </>
    )
}

export default ResistProfile