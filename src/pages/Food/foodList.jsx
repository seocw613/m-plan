import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import Pagination from "../../components/Pagination.jsx";
import { db } from "../../firebase.jsx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const FoodListLayout = styled.div`
`;

const FoodListContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
`;

const FoodContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
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
`;

const Maker = styled.span`
    font-size: 14px;
    color: rgba(155, 155, 155, 0.8);
`;

const NutrientsContainer = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
`;

const NutrientsBox = styled.span`
    display: flex;
    justify-content: center;
`;

const Nutrients = styled.span`
    width: 100px;
    text-align: center;
    &.title_upper {
        flex-basis: 20px;
    }
`;

function FoodList() {
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

    // 단위 추가
    const isNone = (nutrient) => {
        if (nutrient === undefined || nutrient === "-") return "-";
        return nutrient;
    };

    // 1회 섭취참고량 값에서 숫자만 추출하여 size에 저장
    const setSize = (size) => {
        if (size === "" || size === undefined) return 100;
        const regex = /[^0-9]/g;
        return Number(size.replace(regex, ""));
    };

    // 식단 목록에 식품 추가
    const handleAddFoodToMeal = async (event) => {
        // collection 이름
        const collection = "mealPlans";

        const foodData = JSON.parse(event.target.value);
        const serving_size = setSize(foodData.serving_size);

        const food = { id: String(foodData.id), size: serving_size };

        // 문서 고유식별번호, 문서명
        // const UUID = uuidv4();
        const UUID = "test1";
        const mealPlanName = "name1";

        // 기존 데이터가 있다면 가져오기
        const docRef = doc(db, collection, UUID);
        const docSnap = await getDoc(docRef);
        const oldData = docSnap.data();

        const foods = [];

        if (!(oldData === undefined)) {
            // 기존의 식품 데이터 저장
            foods.push(...oldData.foods);
        };

        // 해당 식단에 선택한 식품과 중복되는 게 없다면 데이터 저장
        if (!foods.some((element) => element.id === food.id)) {
            foods.push(food);
        };

        const data = {
            id: UUID,
            name: mealPlanName,
            foods: foods
        };

        await setDoc(doc(db, collection, UUID), data);
    }

    return (
        <FoodListLayout>
            <FoodListContainer>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
                    </FoodTitle>
                    <NutrientsContainer>
                        <NutrientsBox>
                            <Nutrients>1회 제공량당</Nutrients>
                        </NutrientsBox>
                        <NutrientsBox>
                            <Nutrients>에너지(kcal)</Nutrients>
                            <Nutrients>탄수화물(g)</Nutrients>
                            <Nutrients>단백질(g)</Nutrients>
                            <Nutrients>지방(g)</Nutrients>
                        </NutrientsBox>
                    </NutrientsContainer>
                </FoodContainer>
                {foodDatas &&
                    foodDatas.slice(startOrder, lastOrder).map((food) => (
                        <FoodContainer key={food.id}>
                            <FoodTitle>
                                <Name>
                                    <Link to="/food/detail" state={{ food: food }}>
                                        {food.name}
                                    </Link>
                                </Name>
                                <Maker>{food.description} | {food.maker}</Maker>
                            </FoodTitle>
                            <NutrientsContainer>
                                <NutrientsBox>
                                    <Nutrients name="calorie">{isNone(food.calorie)}</Nutrients>
                                    <Nutrients name="carbohydrate">{isNone(food.carbohydrate)}</Nutrients>
                                    <Nutrients name="protein">{isNone(food.protein)}</Nutrients>
                                    <Nutrients name="fat">{isNone(food.fat)}</Nutrients>
                                </NutrientsBox>
                            </NutrientsContainer>
                            <button onClick={handleAddFoodToMeal} value={JSON.stringify(food)} >담기</button>
                        </FoodContainer>
                    ))
                }
            </FoodListContainer>
            <Pagination
                foodDatas={foodDatas}
                limit={limit}
                page={page}
                setSessionPage={setSessionPage} />
        </FoodListLayout>
    )
}

export default FoodList;