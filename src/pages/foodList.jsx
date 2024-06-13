import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
    display: flex;
    padding: 12px;
    align-items: center;
    border-bottom: 1px solid rgba(155, 155, 155, 0.5);
    &.title {
        background-color: lightblue;
        border-top: 1px solid blue;
        text-align: center;
    }
`;

const FoodTitle = styled.span`
    flex-basis: 500px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 2rem;
`;

const Name = styled.span`
    font-size: 18px;

    /* 한/중/일어 단어가 잘리지 않도록 설정 */
    word-break: keep-all;

    cursor: pointer;
    .title & {
        line-height: 40px;
        cursor: text;
    }
`;

const Maker = styled.div`
    font-size: 14px;
    color: rgba(155, 155, 155, 0.8);
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

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const foodDatas = context.foodDatas;
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
                food: food
            }
        });
    };

    // 단위 반영
    const isNone = (nutrient) => {
        if (nutrient === undefined || nutrient === "-") return "-";
        return nutrient;
    };

    return (
        <Wrapper>
            <FoodContainerWrapper>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
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
                {foodDatas &&
                    foodDatas.slice(startOrder, lastOrder).map((food) => (
                        <FoodContainer key={food.id}>
                            <FoodTitle>
                                <Name onClick={() => handleGetDetail(food)}>
                                    {food.name}
                                </Name>
                                <Maker>{food.description} | {food.maker}</Maker>
                            </FoodTitle>
                            <Nutrients name="calorie">{isNone(food.calorie)}</Nutrients>
                            <Nutrients name="carbohydrate">{isNone(food.carbohydrate)}</Nutrients>
                            <Nutrients name="protein">{isNone(food.protein)}</Nutrients>
                            <Nutrients name="fat">{isNone(food.fat)}</Nutrients>
                        </FoodContainer>
                    ))
                }
            </FoodContainerWrapper>
            <Pagination
                foodDatas={foodDatas}
                limit={limit}
                page={page}
                setSessionPage={setSessionPage} />
        </Wrapper>
    )
}

export default FoodList;