import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useContext, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { MessageContext } from "../../contexts/MessageContext";
import { UserContext } from "../../contexts/UserContext";

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

const Message = styled.div`
    font-size: 1.125rem;
    line-height: 1.2rem;
    text-align: center;
    overflow: wrap;
    word-break: keep-all;
    white-space: pre-wrap;
    &.error_message {
        color: red;
    }
`;

function EmailSignUp() {
    const navigate = useNavigate();
    // 회원가입 관련 안내 메시지
    const [message, setMessage] = useState();
    // 회원가입 관련 오류 메시지
    const [errorMessage, setErrorMessage] = useState();
    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 현재 사용자 정보 저장
    const { setSessionUser } = useContext(UserContext);
    // 모두 true여야 회원가입 가능
    let isEmailAccept = false;
    let isPasswordAccept = false;
    let isDisplayNameAccept = true;

    // 생성 조건 출력
    const handleFocus = (event) => {
        const type = event.target.id;
        let content = "";
        switch (type) {
            case "email":
                content = "이메일 형식에 맞춰 작성해주세요.\n예시: sample@naver.com";
                break;
            case "password":
                content = "비밀번호는 6~16자의 영문, 숫자와 특수기호(!, @, #, $, %, ^, &, *, ?, _)의 사용 가능합니다.";
                break;
            case "displayName":
                content = "닉네임은 문자, 숫자로 시작하는 2~10자의 한글, 영문, 숫자와 특수기호(_, -)의 사용 가능합니다.";
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
            const content = "이메일은 필수 정보입니다.";
            setErrorMessage(content);
            isEmailAccept = false;
            return;
        };
        // 정규표현식 검사
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/;
        if (!regex.test(email)) {
            const content = "이메일은 이메일 주소를 확인해 주세요.";
            setErrorMessage(content);
            isEmailAccept = false;
            return;
        };
        // 중복 검사
        const collectionName = "users";
        const q = query(collection(db, collectionName), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const content = "사용할 수 없는 이메일입니다. 본인의 이메일이 맞다면 다른 방식으로 회원가입 했는지 확인해주세요.";
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
            const content = "비밀번호는 필수 정보입니다.";
            setErrorMessage(content);
            isPasswordAccept = false;
            return;
        };
        // 정규표현식 검사
        const regex = /^[a-zA-Z0-9!@#$%^&*?_]{6,16}$/;
        if (!regex.test(password)) {
            const content = "비밀번호 생성 규칙을 확인해 주세요.";
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
            const content = "닉네임 생성 규칙을 확인해 주세요.";
            setErrorMessage(content);
            isDisplayNameAccept = false;
            return;
        };
        // 중복 검사
        const collectionName = "users";
        const q = query(collection(db, collectionName), where("displayName", "==", displayName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const content = "사용할 수 없는 닉네임입니다.";
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
            const content = "이메일 생성 규칙을 확인해주세요.";
            setErrorMessage(content);
            return;
        };
        // 비밀번호 적합 여부 확인
        if (!isPasswordAccept) {
            event.target.password.focus();
            const content = "비밀번호 생성 규칙을 확인해주세요.";
            setErrorMessage(content);
            return;
        };
        // 닉네임 적합 여부 확인
        if (!isDisplayNameAccept) {
            event.target.displayName.focus();
            const content = "닉네임 생성 규칙을 확인해주세요.";
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
                    mealPlanIds: [],
                };
                await setDoc(docRef, userData);

                addMessage("회원가입 되었습니다.");
                // 로컬 스토리지에 사용자 정보 저장
                delete userData.UID;
                sessionStorage.setItem("user", JSON.stringify(userData));
                setSessionUser(userData);
                // 로그인 페이지로 이동
                navigate("/");
            })
            .catch((error) => {
                console.log("Error ", error.code, ": ", error.message);
            });
    };

    return (
        <Form onSubmit={handleSubmit} >
            <Row>
                <span>이메일</span>
                <input
                    name="email"
                    id="email"
                    onFocus={handleFocus}
                    onBlur={(event) => handleEmailBlur(event.target.value)}
                    autocomplete='off' />
            </Row>
            <Row>
                <span>비밀번호</span>
                <input
                    name="password"
                    id="password"
                    onFocus={handleFocus}
                    onBlur={(event) => handlePasswordBlur(event.target.value)}
                    type="password"
                    autocomplete='off' />
            </Row>
            <Row>
                <span>닉네임(선택)</span>
                <input
                    name="displayName"
                    id="displayName"
                    onFocus={handleFocus}
                    onBlur={(event) => handleDisplayNameBlur(event.target.value)}
                    autocomplete='off' />
            </Row>
            <Button>회원가입</Button>
            <Message>{message}</Message>
            <Message className="error_message">{errorMessage}</Message>
        </Form>
    );
};

export default EmailSignUp;