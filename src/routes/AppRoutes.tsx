import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Header from '../components/Header';
import Resistration from '../pages/Registration';
import ResistProfile from '../pages/RegistProfile';
import Home from '../pages/Home';
import UserProfile from '../pages/UserProfile';
import ProfileImage from '../pages/ProfileImage';

const AppRoutes = () => (
    <>
        <Header />
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/regist-page" element={<Resistration />} />
            <Route path="/regist-profile" element={<ResistProfile />} />
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/profile-image" element={<ProfileImage />} />
        </Routes>
    </>
);

export default AppRoutes;