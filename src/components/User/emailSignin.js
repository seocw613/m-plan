import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";


function EmailSignIn() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        console.log(auth.currentUser);

        // 로그인
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // 메인페이지로 이동
                navigate("../");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error ", errorCode, ": ", errorMessage);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <span>이메일</span>
            <input type="email" name="email" />
            <span>비밀번호</span>
            <input type="password" name="password" />
            <button>로그인</button>
        </form>
    );
};

export default EmailSignIn;