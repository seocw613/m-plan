import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function KakaoSignIn() {
    const handleClick = () => {
        // SDK에서 Kakao 객체 추출
        const { Kakao } = window;
        // config 파일에서 클라이언트 아이디 추출
        const config = require("../../config");
        const KAKAO_REST_API_KEY = config.KAKAO_REST_API_KEY;
        const KAKAO_JAVASCRIPT_KEY = config.KAKAO_JAVASCRIPT_KEY;
        // Callback URL
        const KAKAO_REDIRECT_URI = "http://localhost:3000/m-plan/user/kakaoSignInCallback";
        // 인가코드 요청 URL
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

        // 초기화
        Kakao.init(KAKAO_JAVASCRIPT_KEY);
        console.log(Kakao.isInitialized());
    };

    const auth = () => {
        // SDK에서 Kakao 객체 추출
        const { Kakao } = window;
        // Callback URL
        const KAKAO_REDIRECT_URI = "http://localhost:3000/m-plan/user/kakaoSignInCallback";

        Kakao.Auth.authorize({
            redirectUri: KAKAO_REDIRECT_URI,
        });
    };

    return (
        <div>
            <button onClick={handleClick}>Kakao</button>
            <button onClick={auth}>kakao auth</button>
        </div>
    );
};

export default KakaoSignIn;