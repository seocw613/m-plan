import { useOutletContext } from "react-router-dom";
import EmailSignUp from "../../components/User/emailSignUp";
import GithubLogin from "../../components/User/githubLogin";

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
                <GithubLogin setUser={setUser} />
            </div>
        </div>
    );
};

export default SignUp;