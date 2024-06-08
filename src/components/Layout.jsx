import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./SearchBar";

const Wrapper = styled.nav``;

const Box = styled.nav`
    width: 100px;
    height: 100px;
    border: 1px solid red;
`;

function Layout() {
    // 식품 정보
    const [originalDatas, setOriginalDatas] = useState();
    // 검색된 식품 정보
    const [datas, setDatas] = useState();

    // 현재 페이지 번호
    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem("page");
        return savedPage ? JSON.parse(savedPage) : 1;
    });

    // json 파일 불러오기
    useEffect(() => {
        // 파일 경로
        const fileDir = `${process.env.PUBLIC_URL}/jsons/`;

        const fetchFoods = axios.get(`${fileDir}foods.json`);
        const fetchFoods2 = axios.get(`${fileDir}foods2.json`);
        const fetchItems = axios.get(`${fileDir}items.json`);
        const fetchItems2 = axios.get(`${fileDir}items2.json`);

        Promise.all([fetchFoods, fetchFoods2, fetchItems, fetchItems2])
            .then((response) => {
                const [response1, response2, response3, response4] = response;

                const datas1 = response1.data[Object.keys(response1.data)];
                const datas2 = response2.data[Object.keys(response2.data)];
                const datas3 = response3.data[Object.keys(response3.data)];
                const datas4 = response4.data[Object.keys(response4.data)];

                // sample 객체 삭제
                datas1.shift();
                datas2.shift();
                datas3.shift();
                datas4.shift();

                setOriginalDatas([...datas1, ...datas2, ...datas3, ...datas4]);
            })
            .catch((error) => {
                console.error("Error fetching JSON files:", error);
            })
    }, []);

    useEffect(() => {
        setDatas(originalDatas);
    }, [originalDatas]);

    // 세션스토리지에 페이지 번호 저장
    const setSessionPage = (number) => {
        setPage(number);
        sessionStorage.setItem("page", number);
    };

    return (
        <Wrapper>
            <nav>
                <Link to="/">List</Link>{"\t"}
            </nav>
            <SearchBar
                originalDatas={originalDatas}
                setDatas={setDatas}
                setSessionPage={setSessionPage} />
            <Outlet context={{ datas, page, setSessionPage }} />
        </Wrapper>
    );
}

export default Layout;