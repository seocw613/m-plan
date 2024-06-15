import { Link, useLocation, useOutletContext } from "react-router-dom";
import styled from "styled-components";

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

function MealPlanDetail() {
    const location = useLocation();
    const mealPlan = location.state.mealPlan;

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;
    console.log(originalFoodDatas);

    // 단위 추가
    const isNone = (nutrient) => {
        if (nutrient === undefined || nutrient === "-") return "-";
        return nutrient;
    };

    // 1회 제공량 수정, "-" 입력 안되게 함
    const handleChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]+$/;

        if (!regex.test(value)) {
            event.target.value = "";
            return;
        }
        if (value > 10000) {
            event.target.value = 10000;
            return;
        }
    };

    return (
        <div>
            {mealPlan.name}
            <FoodListContainer>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
                    </FoodTitle>
                    <div>
                        1회 제공량(g)
                    </div>
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
                {
                    mealPlan.foods.length > 0
                        ? mealPlan.foods.map((food) => {
                            if (originalFoodDatas === undefined) return;
                            for (const foodData of originalFoodDatas) {
                                console.log(!(foodData.id == food.id));
                                // if (!(foodData.id == food.id)) continue;
                                if (foodData.id == food.id) {
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
                                        <input
                                            onChange={handleChange}
                                            defaultValue={foodData.serving_size}
                                            placeholder={foodData.serving_size} />
                                        <NutrientsContainer>
                                            <NutrientsBox>
                                                <Nutrients name="calorie">{isNone(foodData.calorie)}</Nutrients>
                                                <Nutrients name="carbohydrate">{isNone(foodData.carbohydrate)}</Nutrients>
                                                <Nutrients name="protein">{isNone(foodData.protein)}</Nutrients>
                                                <Nutrients name="fat">{isNone(foodData.fat)}</Nutrients>
                                            </NutrientsBox>
                                        </NutrientsContainer>
                                    </FoodContainer>
                                )}
                            }
                        })
                        : <span>no datas</span>
                }
            </FoodListContainer>
        </div>
    )
}

export default MealPlanDetail;