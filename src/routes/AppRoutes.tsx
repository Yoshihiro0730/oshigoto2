import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Header from '../components/Header';
import Resistration from '../pages/Registration';
import ResistProfile from '../pages/RegistProfile';

const AppRoutes = () => (
    <>
        <Header />
        <Routes>
            <Route path="/" />
            <Route path="/login" element={<Login />} />
            <Route path="/regist-page" element={<Resistration />} />
            <Route path="/regist-profile" element={<ResistProfile />} />
        </Routes>
    </>
);

export default AppRoutes;