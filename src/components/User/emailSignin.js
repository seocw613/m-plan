import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";


function EmailSignIn({ setUser }) {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        // 로그인
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                // 로컬 스토리지에 사용자 정보 저장
                const collectionName = "users";
                const q = query(collection(db, collectionName), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs[0].data();
                delete userData.UID;
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                // 메인페이지로 이동
                navigate("/");
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