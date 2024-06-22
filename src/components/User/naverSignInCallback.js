import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function NaverSignInCallback() {

  const initializeNaverLogin = () => {
    const { naver } = window;
    // config 파일에서 클라이언트 아이디 추출
    const config = require("../../config");
    const NAVER_CLIENT_ID = config.NAVER_CLIENT_ID;

    // 네이버 로그인 기능 및 버튼 구현
    const naverLogin = new naver.LoginWithNaverId({ clientId: NAVER_CLIENT_ID });

    // 네이버 로그인 초기화
    naverLogin.init();
    
    naverLogin.getLoginStatus((status) => {
      if (status) {
        console.log("naver user id:", naverLogin.user.id);
        console.log("status:", status);
      } else {
        console.log("no status");
      }
    });
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

  const handleInfoClick = () => {
    initializeNaverLogin();
  };


  return (
    <div>
      <div id='naverIdLogin' />
      <button onClick={handleInfoClick}>로그인 정보 확인</button>
    </div>
  );
};

export default NaverSignInCallback;