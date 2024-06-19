import { GithubAuthProvider, fetchSignInMethodsForEmail, linkWithPopup, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function GithubLink() {
    const handleClick = () => {
        const provider = new GithubAuthProvider();
        // 연동
        linkWithPopup(auth.currentUser, provider).then((result) => {
            const credential = GithubAuthProvider.credentialFromResult(result);
            const user = result.user;
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