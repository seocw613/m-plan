import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";

const Form = styled.form`
    display: none;
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
    justify-content: center;
`;

const Nutrients = styled.span`
    width: 100px;
    text-align: center;
    &.title_upper {
        flex-basis: 20px;
    }
`;

function MealPlanDetail() {
    const navigate = useNavigate();

    const location = useLocation();
    const mealPlan = location.state.mealPlan;

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;

    // 식단 이름
    const [mealPlanName, setMealPlanName] = useState(mealPlan.name);

    // 중량 정보
    const [sizes, setSizes] = useState([]);

    const handleClick = async () => {
        if (!window.confirm("식단을 삭제하시겠습니까?")) return;

        const collectionName = "mealPlans";

        const docRef = doc(db, collectionName, mealPlan.id);
        await deleteDoc(docRef);

        navigate("../");
    };

    // 영양성분의 양을 매개변수로 입력하면 사용자가 지정한 음식 중량에 맞춰 변환
    const setAmountPerSize = (food, nutrient) => {
        if (nutrient === undefined || nutrient === "-" || sizes.length == 0) return "-";

        const size = sizes.find((size) => size.id == food.id).size;

        return Math.round(Number(nutrient) * size / 100 * 100) / 100;
    };

    useEffect(() => {
        console.log("foods:", mealPlan.foods);
        // 중량 정보 별도 저장
        setSizes([...mealPlan.foods.map((food) => {
            const data = { id: food.id, size: food.size };
            return data;
        })]);
    }, []);

    useEffect(() => {
        console.log("rendered");
    });

    useEffect(() => {
        console.log(sizes);
    }, [sizes]);

    return (
        <div>
            <div>{mealPlanName}</div>
            <Link
                to="../update"
                state={{ mealPlan: mealPlan }}>
                <button>수정</button>
            </Link>
            <button onClick={handleClick}>삭제</button>
            <FoodListContainer>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
                    </FoodTitle>
                    <div>
                        중량(g)
                    </div>
                    <NutrientsContainer>
                        <Nutrients>에너지(kcal)</Nutrients>
                        <Nutrients>탄수화물(g)</Nutrients>
                        <Nutrients>단백질(g)</Nutrients>
                        <Nutrients>지방(g)</Nutrients>
                    </NutrientsContainer>
                </FoodContainer>
                {mealPlan.foods !== undefined
                    && mealPlan.foods.length !== 0
                    && originalFoodDatas !== undefined
                    ? mealPlan.foods.map((food) => {
                        const foodData = originalFoodDatas
                            .find((originalFood) => originalFood.id === food.id);
                        foodData.serving_size = food.size;
                        return (
                            <FoodContainer key={foodData.id}>
                                <FoodTitle>
                                    <Name>
                                        <Link to="/food/detail" state={{ food: foodData }}>
                                            {foodData.name}
                                        </Link>
                                    </Name>
                                    <Maker>{foodData.description} | {foodData.maker}</Maker>
                                </FoodTitle>
                                <div>{foodData.serving_size}</div>
                                <NutrientsContainer>
                                    <Nutrients name="calorie">
                                        {setAmountPerSize(foodData, foodData.calorie)}
                                    </Nutrients>
                                    <Nutrients name="carbohydrate">
                                        {setAmountPerSize(foodData, foodData.carbohydrate)}
                                    </Nutrients>
                                    <Nutrients name="protein">
                                        {setAmountPerSize(foodData, foodData.protein)}
                                    </Nutrients>
                                    <Nutrients name="fat">
                                        {setAmountPerSize(foodData, foodData.fat)}
                                    </Nutrients>
                                </NutrientsContainer>
                            </FoodContainer>
                        )
                    })
                    : <span>no datas</span>
                }
            </FoodListContainer>
        </div>
    )
}

export default MealPlanDetail;