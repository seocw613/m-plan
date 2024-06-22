import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NaverSignIn() {
    // -------------------------------------------------------------------------------------
    // // config 파일에서 클라이언트 아이디 추출
    // const config = require("../../config");
    // const NAVER_CLIENT_ID = config.NAVER_CLIENT_ID;
    // const STATE = "false";
    // // Callback URL
    // const NAVER_CALLBACK_URL = "http://localhost:3000/m-plan/user/naverSignInCallback";
    // const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${NAVER_CALLBACK_URL}`;

    // // 인증 요청, 인증 후 callback 페이지로 연결됨
    // const handleClick = () => {
    //     window.location.href = NAVER_AUTH_URL;
    // };

    // return (
    //     <button onClick={handleClick}>Naver</button>
    // );
    // -------------------------------------------------------------------------------------

    //////////////////////////////////////////////////////////////////////////////
    const initializeNaverLogin = () => {
        // SDK에서 naver 객체 추출
        const { naver } = window;
        // config 파일에서 클라이언트 아이디 추출
        const config = require("../../config");
        const NAVER_CLIENT_ID = config.NAVER_CLIENT_ID;
        // Callback URL
        const NAVER_CALLBACK_URL = "http://localhost:3000/m-plan/user/naverSignInCallback";

        // 네이버 로그인 기능 및 버튼 구현
        const naverLogin = new naver.LoginWithNaverId({
            clientId: NAVER_CLIENT_ID,
            callbackUrl: NAVER_CALLBACK_URL,
            isPopup: false,
            loginButton: {
                color: "green",
                type: 1,
                height: 50,
            },
        });

        naverLogin.init();
    };

    useEffect(() => {
        initializeNaverLogin();
    }, []);

    return (
        <div id="naverIdLogin" />
    );
    //////////////////////////////////////////////////////////////////////////////
};

export default NaverSignIn;