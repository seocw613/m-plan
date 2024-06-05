import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import SearchBar from "../components/search-bar";
import LoadJSON from "../components/load-json";
import Pagination from "../components/pagination";

const Wrapper = styled.div`
`;

const FoodContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const FoodContainer = styled.div`
    height: 66px;
    display: flex;
    padding: 12px;
    align-items: center;
    border-bottom: 1px solid rgba(155, 155, 155, 0.5);
    &.title {
        background-color: lightblue;
        border-top: 1px solid blue;
        text-align: center;
        span {
            cursor: default;
        }
    }
`;

const FoodTitle = styled.span`
    height: 40px;
    flex-basis: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
`;

const Name = styled.div`
    height: 20px;
    font-size: 18px;
    line-height: 20px;
`;

const Maker = styled.div`
    height: 14px;
    font-size: 14px;
    color: rgba(155, 155, 155, 0.8);
    margin-top: 5px;
`;

const NutrientsWrapper = styled.span`
    width: 240px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const NutrientsLowerWrapper = styled.span`
    display: flex;
`;

const Nutrients = styled.span`
    flex-basis: 80px;
    text-align: center;
    &.title_upper {
        flex-basis: 20px;
    }
`;

function FoodList() {
    const navigate = useNavigate();
    const apiKey = "0583d0a8e4d044e6a4e9";

    // 식품 정보
    const [datas, setDatas] = useState();

    // 페이지 관련 states
    // 현재 페이지
    const [page, setPage] = useState(1);
    // 한 페이지에 표시할 식품 수
    const [limit, setLimit] = useState(10);
    // 페이지 시작, 마지막 항목
    let startOrder = (page - 1) * limit;
    let lastOrder = page * limit;

    // 검색 키워드
    const searchRef = useRef("");

    // 페이지 url
    const [url, setUrl] = useState(`http://openapi.foodsafetykorea.go.kr/api/${apiKey}/I2790/json/1/1000`);

    const handleSetUrl = () => {
        setUrl(`http://openapi.foodsafetykorea.go.kr/api/${apiKey}/I2790/json/1/1000/DESC_KOR="${searchRef.current.value}"`);
    }

    const fetchDatas = () => {
        axios.get(url)
            .then((response) => {
                setDatas(response.data.I2790.row);
            });
    }

    useEffect(() => {
        // fetchDatas();
    }, [url]);

    const handleGetDetail = (food) => {
        navigate("/detail", {
            state: {
                food: food,
            }
        });
    }

    return (
        <Wrapper>
            <SearchBar
                apiKey={apiKey}
                searchRef={searchRef}
                setPage={setPage}
                setDatas={setDatas}
                handleSetUrl={handleSetUrl} />
            <FoodContainerWrapper limit={limit}>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
                        <Maker>제조사</Maker>
                    </FoodTitle>
                    <NutrientsWrapper>
                        <Nutrients>1회 제공량당</Nutrients>
                        <NutrientsLowerWrapper>
                            <Nutrients>탄수화물(g)</Nutrients>
                            <Nutrients>단백질(g)</Nutrients>
                            <Nutrients>지방(g)</Nutrients>
                        </NutrientsLowerWrapper>
                    </NutrientsWrapper>
                </FoodContainer>
                {datas &&
                    datas.slice(startOrder, lastOrder).map((e) => (
                        <FoodContainer key={e.FOOD_CD}>
                            <FoodTitle onClick={() => handleGetDetail(e)}>
                                <Name>{e.DESC_KOR}</Name>
                                <Maker>{e.MAKER_NAME}</Maker>
                            </FoodTitle>
                            <Nutrients name="carbohydrate">{e.NUTR_CONT2 || '-'}</Nutrients>
                            <Nutrients name="protein">{e.NUTR_CONT3 || '-'}</Nutrients>
                            <Nutrients name="fat">{e.NUTR_CONT4 || '-'}</Nutrients>
                        </FoodContainer>
                    ))
                }
            </FoodContainerWrapper>
            <Pagination
                datas={datas}
                limit={limit}
                page={page}
                setPage={setPage} />

            <LoadJSON
                datas={datas}
                setDatas={setDatas}
                limit={limit}
                page={page} />
        </Wrapper>
    )
}

export default FoodList;