import { useOutletContext } from "react-router-dom";
import EmailSignIn from "../../components/User/emailSignin";

function SignIn() {
    // OutletContext
    const context = useOutletContext();
    // 사용자 정보 저장 함수
    const setUser = context.setUser;

    return (
        <div>
            로그인
            <EmailSignIn setUser={setUser} />
        </div>
    );
};

export default SignIn;