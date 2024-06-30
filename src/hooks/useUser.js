import { useState } from "react";

export function useUser() {
    // 현재 사용자 정보
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

    // 사용자 정보 수정
    const setSessionUser = (userData) => {
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
    };
    // 사용자 정보 삭제
    const removeSessionUser = () => {
        setUser(null);
        sessionStorage.removeItem("user");
    };

    // 로그인 여부 확인
    const checkSignIn = () => {
        if (!user) return false;
        return true;
    };

    return { user, setSessionUser, removeSessionUser, checkSignIn };
};