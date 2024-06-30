import { GithubAuthProvider, fetchSignInMethodsForEmail, linkWithPopup, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useContext } from "react";
import { MessageContext } from "../../contexts/MessageContext";
import { UserContext } from "../../contexts/UserContext";

function GithubLink() {
    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 현재 사용자 정보 저장
    const { setSessionUser } = useContext(UserContext);

    const handleClick = () => {
        const provider = new GithubAuthProvider();
        // 연동
        linkWithPopup(auth.currentUser, provider).then(async (result) => {
            const credential = GithubAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log("user:", user);
            // DB 정보 업데이트
            // 사용자 정보 가져오기
            const collectionName = "users";
            const email = user.email;
            const q = query(collection(db, collectionName), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            const userDb = querySnapshot.docs[0].data();
            // 사용자 DB 업데이트
            userDb.loginMethods.push("github");
            await setDoc(doc(db, collectionName, userDb.UID), userDb);
            // 사용자 업데이트
            setSessionUser(userDb);

            addMessage("Github와 연동되었습니다.");
        }).catch((error) => {
            console.log("Error: ", error);
        });
    };

    return (
        <button onClick={handleClick}>Github 연동</button>
    )
};

export default GithubLink;