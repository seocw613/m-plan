import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

const EmailSignUpLayout = styled.div`
`;

const Form = styled.form`
    display: inline-flex;
    flex-direction: column;
    width: 300px;
    input {
        font-size: 1rem;
    }
`;

const Message = styled.div`
    overflow: wrap;
    word-break: keep-all;
    &.error_message {
        color: red;
    }
`;


function EmailSignUp({ setUser }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();
    // 모두 true여야 회원가입 가능
    let isEmailAccept = false;
    let isPasswordAccept = false;
    let isDisplayNameAccept = true;

    // 생성 조건 출력
    const handleFocus = (event) => {
        const type = event.target.id;
        let content = "";
        switch (type) {
            case "password":
                content = "·비밀번호 생성 규칙: 6~16자의 영문, 숫자와 특수기호 (!, @, #, $, %, ^, &, *, ?, _)만 사용 가능합니다.";
                break;
            case "displayName":
                content = "·닉네임 생성 규칙: 글자, 숫자로 시작하는 2~10자의 한글, 영문, 숫자와 특수기호 (_, -)만 사용 가능합니다.";
                break;
            default:
                break;
        };
        setMessage(content);
    };

    // 이메일 검사
    const handleEmailBlur = async (email) => {
        setMessage();
        // 공백 검사
        if (email === "") {
            const content = "·이메일: 필수 정보입니다.";
            setErrorMessage(content);
            isEmailAccept = false;
            return;
        };
        // 정규표현식 검사
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/;
        if (!regex.test(email)) {
            const content = "·이메일: 이메일 주소를 확인해 주세요.";
            setErrorMessage(content);
            isEmailAccept = false;
            return;
        };
        // 중복 검사
        const collectionName = "users";
        const q = query(collection(db, collectionName), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const content = "·이메일: 사용할 수 없는 이메일입니다. 본인의 이메일이 맞다면 다른 방식으로 회원가입 했는지 확인해보세요.";
            setErrorMessage(content);
            isEmailAccept = false;
            return;
        };
        // 검사 통과
        setErrorMessage("");
        isEmailAccept = true;
    };

    // 비밀번호 검사
    const handlePasswordBlur = async (password) => {
        setMessage();
        // 공백 검사
        if (password === "") {
            const content = "·비밀번호: 필수 정보입니다.";
            setErrorMessage(content);
            isPasswordAccept = false;
            return;
        };
        // 정규표현식 검사
        const regex = /^[a-zA-Z0-9!@#$%^&*?_]{6,16}$/;
        if (!regex.test(password)) {
            const content = "·비밀번호: 생성 규칙을 확인해 주세요.";
            setErrorMessage(content);
            isPasswordAccept = false;
            return;
        };
        // 검사 통과
        setErrorMessage("");
        isPasswordAccept = true;
    };

    // 닉네임 검사
    const handleDisplayNameBlur = async (displayName) => {
        setMessage();
        // 공백 검사
        if (displayName === "") {
            isDisplayNameAccept = true;
            return;
        };
        // 정규표현식 검사
        const regex = /^[a-zA-Zㄱ-힣0-9][a-zA-Zㄱ-힣0-9_-]{1,9}$/;
        if (!regex.test(displayName)) {
            const content = "·닉네임: 생성 규칙을 확인해 주세요.";
            setErrorMessage(content);
            isDisplayNameAccept = false;
            return;
        };
        // 중복 검사
        const collectionName = "users";
        const q = query(collection(db, collectionName), where("displayName", "==", displayName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const content = "·닉네임: 사용할 수 없는 닉네임입니다.";
            setErrorMessage(content);
            isDisplayNameAccept = false;
            return;
        };
        // 검사 통과
        setErrorMessage("");
        isDisplayNameAccept = true;
    };

    // 계정 등록
    const handleSubmit = async (event) => {
        event.preventDefault();
        let displayName = event.target.displayName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        // 적합 여부 확인 업데이트를 위한 함수 호출
        await handleDisplayNameBlur(displayName);
        await handlePasswordBlur(password);
        await handleEmailBlur(email);
        // 이메일 적합 여부 확인
        if (!isEmailAccept) {
            event.target.email.focus();
            const content = "·이메일: 생성 규칙을 확인해주세요.";
            setErrorMessage(content);
            return;
        };
        // 비밀번호 적합 여부 확인
        if (!isPasswordAccept) {
            event.target.password.focus();
            const content = "·비밀번호: 생성 규칙을 확인해주세요.";
            setErrorMessage(content);
            return;
        };
        // 닉네임 적합 여부 확인
        if (!isDisplayNameAccept) {
            event.target.displayName.focus();
            const content = "·닉네임: 생성 규칙을 확인해주세요.";
            setErrorMessage(content);
            return;
        };
        // 계정 생성
        if (displayName === "") displayName = null;
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                // UID 저장
                const UID = user.uid;
                // 로그인 방식 저장
                const loginMethod = "password";
                // db에 등록
                const collectionName = "users";
                const docRef = doc(db, collectionName, UID);
                const userData = {
                    UID: UID,
                    displayName: displayName,
                    email: email,
                    loginMethods: [loginMethod],
                };
                await setDoc(docRef, userData);

                alert("회원가입 되었습니다.");
                // 로컬 스토리지에 사용자 정보 저장
                delete userData.UID;
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                // 로그인 페이지로 이동
                navigate("/");
            })
            .catch((error) => {
                console.log("Error ", error.code, ": ", error.message);
            });
    };

    return (
        <EmailSignUpLayout>
            <Form onSubmit={handleSubmit} >
                <input
                    name="email"
                    id="email"
                    placeholder="이메일"
                    onBlur={(event) => handleEmailBlur(event.target.value)}
                    autocomplete='off' />
                <input
                    name="password"
                    id="password"
                    placeholder="비밀번호"
                    onFocus={handleFocus}
                    onBlur={(event) => handlePasswordBlur(event.target.value)}
                    type="password"
                    autocomplete='off' />
                <input
                    name="displayName"
                    id="displayName"
                    placeholder="(선택)닉네임"
                    onFocus={handleFocus}
                    onBlur={(event) => handleDisplayNameBlur(event.target.value)}
                    autocomplete='off' />
                <Message>{message}</Message>
                <Message className="error_message">{errorMessage}</Message>
                <button>회원가입</button>
            </Form>
        </EmailSignUpLayout>
    );
};

export default EmailSignUp;