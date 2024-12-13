import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import { useCookies } from 'react-cookie';

type User = {
    uid: string;
    displayName: string | null;
    email: string | null;
    token: string | null;
    roles: string | null;
    isFirebase?: boolean;
};

type AuthContextType = {
    currentUser: User | null;
    setToken: (token: string) => void;
    setCustomUser: (user: User | null) => void;
    setEmail: (email: string) => void;
};

export const AuthContext = createContext<AuthContextType>({
    currentUser:  null,
    setToken: () => {},
    setCustomUser: () => {},
    setEmail: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cookies, setCookie] = useCookies(['user']);
    const initialUser = cookies.user ? cookies.user : null;
    const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
    
    const setToken = (token: string) => {
        if(currentUser) {
            const setUser = {
                ...currentUser,
                token: token
            }
            setCurrentUser(setUser);
            setCookie("user", setUser, {path: "/"}); 
        }
    }

    const setEmail = (email: string) => {  // 追加
        if(currentUser) {
            setCurrentUser({
                ...currentUser,
                email: email
            });
        }
    }

    const setCustomUser = (user: User | null) => {
        setCurrentUser(user);
        setCookie('user', user, { 
            path: '/',
            secure: true,
            sameSite: 'strict'
        });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                const user: User = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    token: currentUser?.token || "",
                    roles: currentUser?.roles || "",
                    isFirebase: true
                };
                if(!currentUser || !currentUser.isFirebase) {
                    setCurrentUser(user);
                }
            } else {
                if(currentUser && !currentUser.isFirebase) {
                    return;
                }
            }
        });

        return () => unsubscribe(); // クリーンアップ関数
    }, [currentUser]);

    const value = {
        currentUser,
        setToken,
        setCustomUser,
        setEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// カスタムフック
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};