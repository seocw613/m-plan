import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { MessageContext } from "../../contexts/MessageContext";
import styled from "styled-components";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 400px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.25rem;
    & input {
        width: 250px;
        margin-left: 20px;
        font-size: 1rem;
        padding: 6px 10px;
        outline: none;
        border: 1px solid gray;
        border-radius: 6px;
        background-color: white;
    };
`;

const Button = styled.button`
    font-size: 1.25rem;
    padding: 6px;
    border: none;
    border-radius: 100px;
    box-shadow: 0 0 2px 0 black;
    background-color: white;
    cursor: pointer;
    &:hover {
        box-shadow: 0 0 3px 0 black;
    };
`;

const ErrorMessage = styled.div`
    font-size: 1.125rem;
    text-align: center;
`;

function EmailSignIn() {
    const navigate = useNavigate();
    // 현재 사용자 저장
    const { setSessionUser } = useContext(UserContext);
    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 오류메시지
    const [errorMessage, setErrorMessage] = useState("안녕하세요!");

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        // 로그인
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                // 사용자 정보 저장
                const collectionName = "users";
                const q = query(collection(db, collectionName), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs[0].data();
                sessionStorage.setItem("user", JSON.stringify(userData));
                setSessionUser(userData);
                // 메시지 띄우기
                addMessage("로그인 되었습니다.");
                // 메인페이지로 이동
                navigate("/");
            })
            .catch((error) => {
                // 이메일 형식이 맞지 않음
                if (error.code === "auth/invalid-email") {
                    const content = "이메일을 형식에 맞게 입력해주세요.";
                    return setErrorMessage(content);
                };
                // 비밀번호를 작성하지 않음
                if (error.code === "auth/missing-password") {
                    const content = "비밀번호를 입력해주세요.";
                    return setErrorMessage(content);
                };
                // 등록되지 않은 아이디, 비밀번호 조합
                if (error.code === "auth/invalid-credential") {
                    const content = "이메일 혹은 비밀번호를 확인해주세요.";
                    return setErrorMessage(content);
                };
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error ", errorCode, ": ", errorMessage);
                console.log(error);
            });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <span>이메일</span>
                <input name="email" />
            </Row>
            <Row>
                <span>비밀번호</span>
                <input type="password" name="password" />
            </Row>
            <Button>로그인</Button>
            <ErrorMessage>{errorMessage}</ErrorMessage>
        </Form>
    );
};

export default EmailSignIn;