import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Pagination from "../components/Pagination";

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
    width: 400px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const NutrientsLowerWrapper = styled.span`
    display: flex;
`;

const Nutrients = styled.span`
    flex-basis: 100px;
    text-align: center;
    &.title_upper {
        flex-basis: 20px;
    }
`;

function FoodList() {
    const navigate = useNavigate();
    const foodApiKey = "0583d0a8e4d044e6a4e9";

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const datas = context.datas;
    // 현재 페이지 번호
    const page = context.page;
    // 페이지 번호 넣으면 현재 페이지 변경하는 함수
    const setSessionPage = context.setSessionPage;

    // 한 페이지에 표시할 식품 수
    const [limit, setLimit] = useState(10);
    // 페이지 시작, 마지막 항목
    let startOrder = (page - 1) * limit;
    let lastOrder = page * limit;

    const handleGetDetail = (food) => {
        navigate("/detail", {
            state: {
                food: food,
            }
        });
    };
    
    return (
        <Wrapper>
            <FoodContainerWrapper>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
                        <Maker>제조사</Maker>
                    </FoodTitle>
                    <NutrientsWrapper>
                        <Nutrients>1회 제공량당</Nutrients>
                        <NutrientsLowerWrapper>
                            <Nutrients>에너지(kcal)</Nutrients>
                            <Nutrients>탄수화물(g)</Nutrients>
                            <Nutrients>단백질(g)</Nutrients>
                            <Nutrients>지방(g)</Nutrients>
                        </NutrientsLowerWrapper>
                    </NutrientsWrapper>
                </FoodContainer>
                {datas &&
                    datas.slice(startOrder, lastOrder).map((e) => (
                        <FoodContainer key={e.식품코드 || e["DB10.2 색인"]}>
                            <FoodTitle onClick={() => handleGetDetail(e)}>
                                <Name>{e.식품명.split('_').reverse().join(' ')}</Name>
                                <Maker>{e.업체명}</Maker>
                            </FoodTitle>
                            <Nutrients name="calory">{e["에너지(kcal)"] || '-'}</Nutrients>
                            <Nutrients name="carbohydrate">{e["탄수화물(g)"] || '-'}</Nutrients>
                            <Nutrients name="protein">{e["단백질(g)"] || '-'}</Nutrients>
                            <Nutrients name="fat">{e["지방(g)"] || '-'}</Nutrients>
                        </FoodContainer>
                    ))
                }
            </FoodContainerWrapper>
            <Pagination
                datas={datas}
                limit={limit}
                page={page}
                setSessionPage={setSessionPage} />
        </Wrapper>
    )
}

export default FoodList;