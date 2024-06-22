import { GithubAuthProvider, fetchSignInMethodsForEmail, linkWithCredential, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

function GithubSignIn({ setUser }) {
    const navigate = useNavigate();

    const handleClick = () => {
        const provider = new GithubAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // 신규 사용자인 경우 db 등록
                // db에 등록된 사용자인지 확인
                const collectionName = "users";
                const email = user.email;
                const q = query(collection(db, collectionName), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                // 사용자 정보 저장
                let userData = querySnapshot.docs[0]?.data();
                // 없다면 db에 등록
                if (querySnapshot.docs.length === 0) {
                    // UID 저장
                    const UID = user.uid;
                    // 로그인 방식 저장
                    const loginMethod = "github";
                    // db에 등록
                    const docRef = doc(db, collectionName, UID);
                    userData = {
                        UID: UID,
                        displayName: user.displayName,
                        email: email,
                        loginMethods: [loginMethod],
                    };
                    await setDoc(docRef, userData);
                };
                // 로컬 스토리지에 사용자 정보 저장
                delete userData.UID;
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                // 메인 페이지로 이동
                navigate("/");
            }).catch(async (error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                console.log("Error ", errorCode, ": ", errorMessage);
                console.log("credential: ", credential);
                // An error happened.
                if (errorCode === 'auth/account-exists-with-different-credential') {
                    // 동일 이메일로 등록된 계정의 로그인 방법 확인
                    const collectionName = "users";
                    const q = query(collection(db, collectionName), where("email", "==", email));
                    const querySnapshot = await getDocs(q);
                    const userData = querySnapshot.docs[0].data();
                    const methods = userData.loginMethods;
                    // 로그인 방법에 따라 진행 여부 확인
                    let isContinue = false;
                    let password = "";
                    for (const method of methods) {
                        switch (method) {
                            case "password":
                                isContinue = window.confirm("동일한 이메일로 가입한 계정이 있습니다. 깃허브와 연동하시겠습니까?");
                                if (isContinue) {
                                    password = prompt("해당 계정의 비밀번호를 입력하세요.");
                                    // 해당 계정에 로그인
                                    signInWithEmailAndPassword(auth, email, password).then((result) => {
                                        // 깃허브 연동
                                        return linkWithCredential(result.user, credential);
                                    }).then(async () => {
                                        // 사용자 정보 업데이트
                                        userData.loginMethods.push("github");
                                        await setDoc(doc(db, collectionName, userData.UID), userData);
                                        // 메인 페이지로 이동
                                        navigate("/");
                                    });
                                };
                                break;
                            default:
                                break;
                        };
                    };
                }
            });
    }

    return (
        <button onClick={handleClick}>Github</button>
    );
}

export default GithubSignIn;