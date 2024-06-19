import EmailSignUp from "../../components/User/emailSignUp";
import GithubLogin from "../../components/User/githubLogin";

function SignUp() {
    return (
        <div>
            회원가입
            <EmailSignUp />
            <div>
                <GithubLogin />
            </div>
        </div>
    );
};

export default SignUp;