import { useEffect, useState } from "react";
import { db } from "../../firebase.jsx";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import styled from "styled-components";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

const MealPlanListLayout = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MealPlanContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid rgba(155, 155, 155, 0.5);
    &.title {
        padding: 20px 12px;
        background-color: lightblue;
        border-top: 1px solid blue;
        text-align: center;
    }
`;

const MealPlanTitle = styled.span`
    flex-basis: 500px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 32px;
`;

const Name = styled.span`
    font-size: 18px;

    /* 한/중/일어 단어가 잘리지 않도록 설정 */
    word-break: keep-all;
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

function MealPlanList() {
    // 식단 목록
    const [mealPlanDatas, setMealPlanDatas] = useState([]);

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;

    // 식단 목록 가져오기
    const getMealPlanDatas = async () => {
        // firebase collection 이름
        const collectionName = "mealPlans";

        // 보여줄 식단 id 목록
        const mealPlanIds = ["test", "test1"];

        // 임시 식단 목록
        const tmpMealPlanDatas = [];

        // for (const mealPlanId of mealPlanIds) {
        //     // firstore에서 식단 가져오기
        //     const docRef = doc(db, collection, mealPlanId);
        //     const docSnap = await getDoc(docRef);
        //     tmpMealPlanDatas.push(docSnap.data());
        // }
        const querySanpshot = await getDocs(collection(db, collectionName));
        querySanpshot.forEach((doc) => {
            tmpMealPlanDatas.push(doc.data());
        });

        setMealPlanDatas(tmpMealPlanDatas);
    };

    // 해당 식단에서 특정 영양성분의 합계를 구해준다
    const getNutrientSummary = (mealPlan, nutirient) => {
        const foodDatas = originalFoodDatas.filter((foodData) => {
            for (const food of mealPlan.foods) {
                if (foodData.id == food.id) return foodData;
            };
        });
        
        const summary = foodDatas.reduce((accumulator, foodData) => {
            const food = mealPlan.foods.find((food) => food.id == foodData.id);
            return accumulator + (foodData[nutirient] / 100 * food.size);
        }, 0);

        return Math.round(summary * 10) / 10;
    };

    // 식단 삭제
    const deleteMealPlan = async (mealPlan) => {
        if (!window.confirm("식단을 삭제하시겠습니까?")) return;

        const collectionName = "mealPlans";
        
        const docRef = doc(db, collectionName, mealPlan.id);
        await deleteDoc(docRef);
        
        getMealPlanDatas();
    };

    useEffect(() => {
        getMealPlanDatas();
    }, []);

    return (
        <MealPlanListLayout>
            <MealPlanContainer className="title">
                <MealPlanTitle>
                    <Name>식품명</Name>
                </MealPlanTitle>
                <NutrientsContainer>
                    <Nutrients>에너지(kcal)</Nutrients>
                    <Nutrients>탄수화물(g)</Nutrients>
                    <Nutrients>단백질(g)</Nutrients>
                    <Nutrients>지방(g)</Nutrients>
                </NutrientsContainer>
            </MealPlanContainer>
            {mealPlanDatas &&
                mealPlanDatas.map((mealPlan) => (
                    <MealPlanContainer key={mealPlan.id}>
                        <MealPlanTitle>
                            <Name>
                                <Link to="/mealPlan/detail" state={{ mealPlan: mealPlan }}>
                                    {mealPlan.name}
                                </Link>
                            </Name>
                        </MealPlanTitle>
                        <NutrientsContainer>
                            <Nutrients name="calorie">
                                {getNutrientSummary(mealPlan, "calorie")}
                            </Nutrients>
                            <Nutrients name="carbohydrate">
                                {getNutrientSummary(mealPlan, "carbohydrate")}
                            </Nutrients>
                            <Nutrients name="protein">
                                {getNutrientSummary(mealPlan, "protein")}
                            </Nutrients>
                            <Nutrients name="fat">
                                {getNutrientSummary(mealPlan, "fat")}
                            </Nutrients>
                        </NutrientsContainer>
                        <button onClick={() => deleteMealPlan(mealPlan)}>삭제</button>
                    </MealPlanContainer>
                ))
            }
        </MealPlanListLayout>
    )
}

export default MealPlanList;