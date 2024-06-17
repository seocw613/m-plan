import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.nav``;

function Layout() {
    // 식품 정보
    const [originalFoodDatas, setOriginalFoodDatas] = useState();
    // 검색된 식품 정보
    const [foodDatas, setFoodDatas] = useState();

    // 현재 페이지 번호
    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem("page");
        return savedPage ? JSON.parse(savedPage) : 1;
    });

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
            </nav>
            <Outlet context={{ originalFoodDatas, foodDatas, page, setFoodDatas, setSessionPage }} />
        </Wrapper>
    );
}

export default Layout;