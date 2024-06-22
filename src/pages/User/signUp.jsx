import { useOutletContext } from "react-router-dom";
import EmailSignUp from "../../components/User/emailSignUp";
import GithubSignIn from "../../components/User/githubSignIn";
import NaverSignIn from "../../components/User/naverSignIn";
import KakaoSignIn from "../../components/User/kakaoSignIn";

function SignUp() {
    // OutletContext
    const context = useOutletContext();
    // 사용자 정보 저장 함수
    const setUser = context.setUser;

    return (
        <div>
            회원가입
            <EmailSignUp setUser={setUser} />
            <div>
                <GithubSignIn setUser={setUser} />
                <NaverSignIn setUser={setUser} />
                <KakaoSignIn setUser={setUser} />
            </div>
        </div>
    );
};

export default SignUp;