import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 建立 AuthContext
const AuthContext = createContext();

// 使用者可使用的 hook
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider 用來包裹應用，提供全域的登入狀態
export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);

    // 檢查 localStorage 中是否有 JWT，並解碼
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken); // 解析 token 並設置用戶
            } catch (error) {
                console.error('Token decoding failed', error);
                logout();
            }
        }
    }, []);

    // 登入方法
    const login = (token) => {
        localStorage.setItem('jwt', token);
        const decodedToken = jwtDecode(token); // 解碼 token 以取得用戶資料
        setUsername(decodedToken);
    };

    // 登出方法
    const logout = () => {
        localStorage.removeItem('jwt');
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
