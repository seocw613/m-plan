import { GithubAuthProvider, fetchSignInMethodsForEmail, linkWithPopup, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

function GithubLink() {
    const handleClick = () => {
        const provider = new GithubAuthProvider();
        // 연동
        linkWithPopup(auth.currentUser, provider).then(async (result) => {
            const credential = GithubAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log("user:", user);
            // db 정보 업데이트
            // 사용자 정보 가져오기
            const collectionName = "users";
            const email = user.email;
            const q = query(collection(db, collectionName), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            const userDb = querySnapshot.docs[0].data();
            // 사용자 정보 업데이트
            userDb.loginMethods.push("github");
            await setDoc(doc(db, collectionName, userDb.UID), userDb);

            alert("Github와 연동되었습니다.");
        }).catch((error) => {
            console.log("Error: ", error);
        });
    };

    return (
        <button onClick={handleClick}>Github 연동</button>
    )
};

export default GithubLink;