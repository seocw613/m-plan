import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

function LoadJSON({ datas, setDatas, limit, page}) {
    const navigate = useNavigate();

    // 페이지 시작, 마지막 항목
    let startOrder = (page - 1) * limit;
    let lastOrder = page * limit;

    // json 파일 불러오기
    useEffect(() => {
        const fetchFoods = axios.get("../src/jsons/foods.json");
        const fetchFoods2 = axios.get("../src/jsons/foods2.json");
        const fetchItems = axios.get("../src/jsons/items.json");
        const fetchItems2 = axios.get("../src/jsons/items2.json");

        Promise.all([fetchFoods, fetchFoods2, fetchItems, fetchItems2])
            .then((response) => {
                console.log(response);
                const [response1, response2, response3, response4] = response;

                console.log("response:", response);
                const datas1 = response1.data[Object.keys(response1.data)];
                const datas2 = response2.data[Object.keys(response2.data)];
                const datas3 = response3.data[Object.keys(response3.data)];
                const datas4 = response4.data[Object.keys(response4.data)];

                // sample 객체 삭제
                datas1.shift();
                datas2.shift();
                datas3.shift();
                datas4.shift();

                setDatas([...datas1, ...datas2, ...datas3, ...datas4]);
            })
            .catch((error) => {
                console.error("Error fetching JSON files:", error);
            });
    }, []);

    const handleGetDetail = (food) => {
        navigate("/detail", {
            state: {
                food: food,
            }
        });
    }

    return (
        <FoodContainerWrapper limit={limit}>
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
    )
}

export default LoadJSON;