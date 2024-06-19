import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { AuthCredential, signOut } from "firebase/auth";
import GithubLink from "./User/githubLink";
import { collection, getDocs, query, where } from "firebase/firestore";

const Wrapper = styled.nav``;

function Layout() {
    const navigate = useNavigate();

    // 식품 정보
    const [originalFoodDatas, setOriginalFoodDatas] = useState();
    // 검색된 식품 정보
    const [foodDatas, setFoodDatas] = useState();

    // 현재 페이지 번호
    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem("page");
        return savedPage ? JSON.parse(savedPage) : 1;
    });

    // 사용자 정보
    const [user, setUser] = useState(auth.currentUser);

    // 사용자의 db 정보
    const [userDb, setUserDb] = useState();

    // 사용자 db 정보 가져오기
    const getUserDb = async () => {
        const collectionName = "users";
        const email = user.email;
        const q = query(collection(db, collectionName), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        setUserDb(querySnapshot.docs[0].data());
        console.log("userDb:", userDb);
    };

    // 사용자 정보 확인
    const handleCheckUserClick = () => {
        console.log("user:", auth.currentUser);
        console.log("UID:", auth.currentUser.uid);
        console.log("credential:", new AuthCredential());
    };

    // 로그아웃
    const handleSignOutClick = () => {
        signOut(auth).then(() => {
            alert("로그아웃 되었습니다.");
            navigate("/");
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error ", errorCode, ": ", errorMessage);
        });
    };

    // json 파일 불러오기
    useEffect(() => {
        // 파일 경로
        const fileDir = `${process.env.PUBLIC_URL}/jsons`;

        const fetchFoodDatas1 = axios.get(`${fileDir}/foods1.json`);
        const fetchFoodDatas2 = axios.get(`${fileDir}/foods2.json`);
        const fetchFoodDatas3 = axios.get(`${fileDir}/foods3.json`);
        const fetchFoodDatas4 = axios.get(`${fileDir}/foods4.json`);

        Promise.all([fetchFoodDatas1, fetchFoodDatas2, fetchFoodDatas3, fetchFoodDatas4])
            .then((response) => {
                const [response1, response2, response3, response4] = response;

                const foodDatas1 = response1.data;
                const foodDatas2 = response2.data;
                const foodDatas3 = response3.data;
                const foodDatas4 = response4.data;

                setOriginalFoodDatas([...foodDatas1, ...foodDatas2, ...foodDatas3, ...foodDatas4]);
            })
            .catch((error) => {
                console.error("Error fetching JSON files:", error);
            });
        // 로그인된 사용자 정보 가져오기
        if (auth.currentUser) getUserDb();
        console.log("rendered");
        console.log("auth user:", auth.currentUser);
        console.log("user:", user);
    }, []);

    useEffect(() => {
        setFoodDatas(originalFoodDatas);
    }, [originalFoodDatas]);

    // 세션스토리지에 페이지 번호 저장
    const setSessionPage = (num) => {
        setPage(num);
        sessionStorage.setItem("page", num);
    };

    return (
        <Wrapper>
            <nav>
                <Link to="/">Main Page</Link>{"\t"}
                <Link to="/food/">Food</Link>{"\t"}
                <Link to="/mealPlan/">Meal Plan</Link>{"\t"}
                {auth.currentUser
                    ? null
                    : <>
                        <Link to="/signIn">로그인</Link>{"\t"}
                        <Link to="/signUp">회원가입</Link>{"\t"}
                    </>
                }
            </nav>
            {auth.currentUser
                ? <div>
                    <button onClick={handleCheckUserClick}>사용자 정보</button>
                    {userDb
                        ? <GithubLink />
                        : null
                    }
                    <button onClick={handleSignOutClick}>로그아웃</button>
                </div>
                : null
            }
            <Outlet context={{ originalFoodDatas, foodDatas, page, setFoodDatas, setSessionPage }} />
        </Wrapper>
    );
}

export default Layout;