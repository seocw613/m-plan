import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { AuthCredential, signOut } from "firebase/auth";
import GithubLink from "./User/GithubLink";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MessageContext } from "../contexts/MessageContext";
import { UserContext } from "../contexts/UserContext";
import { MealPlanContext } from "../contexts/MealPlanContext";
import { useMessage } from "../hooks/useMessage";
import { useUser } from "../hooks/useUser";
import { useMealPlan } from "../hooks/useMealPlan";
import MessageBox from "./Common/MessageBox";

const Wrapper = styled.nav``;

function Layout() {
    const navigate = useNavigate();

    // 식품 정보
    const [originalFoodDatas, setOriginalFoodDatas] = useState();
    // 검색된 식품 정보
    const [foodDatas, setFoodDatas] = useState();

    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 사용자의 DB 정보, 현재 사용자 정보 삭제
    const { user, removeSessionUser } = useContext(UserContext);
    // 식단 목록 가져오기
    const { getMealPlanDatas } = useContext(MealPlanContext);

    // 현재 페이지 번호
    // 새로고침 해도 페이지 유지될 수 있게 세션 스토리지 이용
    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem("page");
        return savedPage ? JSON.parse(savedPage) : 1;
    });

    // 사용자 정보 확인
    const handleCheckUserClick = () => {
        addMessage(`user: ${auth.currentUser.email}`);
    };

    // 로그아웃
    const handleSignOutClick = () => {
        signOut(auth).then(() => {
            // 로그아웃
            removeSessionUser();
            // 메시지 띄우기
            addMessage("로그아웃 되었습니다.");
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
    }, []);

    useEffect(() => {
        setFoodDatas(originalFoodDatas);
    }, [originalFoodDatas]);

    useEffect(() => {
        // 사용자 정보가 바뀔 때마다 식단 목록 최신화
        getMealPlanDatas(user);
    }, [user]);

    // 세션스토리지에 페이지 번호 저장
    const setSessionPage = (num) => {
        setPage(num);
        sessionStorage.setItem("page", num);
    };

    return (
        <Wrapper>
            <MessageBox />
            <nav>
                <Link to="/">Main Page</Link>{"\t"}
                <Link to="/food/">Food</Link>{"\t"}
                {user &&
                    <Link to="/mealPlan/">Meal Plan</Link>
                }
                {user
                    ? null
                    : <>
                        <Link to="/user/signIn">로그인</Link>{"\t"}
                        <Link to="/user/signUp">회원가입</Link>{"\t"}
                    </>
                }
            </nav>
            {user &&
                <div>
                    <button onClick={handleCheckUserClick}>사용자 정보</button>
                    {user?.loginMethods?.some((method) => method === "github")
                        ? null
                        : <GithubLink />
                    }
                    <button onClick={handleSignOutClick}>로그아웃</button>
                </div>
            }
            <Outlet context={{ originalFoodDatas, foodDatas, page, setFoodDatas, setSessionPage }} />
        </Wrapper>
    );
};

export default Layout;