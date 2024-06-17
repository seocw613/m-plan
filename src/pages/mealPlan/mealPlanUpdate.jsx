import { doc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";

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

function MealPlanUpdate() {
    const navigate = useNavigate();

    const location = useLocation();
    // const mealPlan = location.state.mealPlan;
    const [mealPlan, setMealPlan] = useState(location.state.mealPlan);

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;

    // 식단 이름, 불필요한 렌더링 줄이기 위해서 useRef 사용
    const mealPlanNameRef = useRef(mealPlan.name);

    // 중량 정보
    const [sizes, setSizes] = useState(JSON.parse(JSON.stringify(mealPlan.foods)));

    // 식단 이름 변경
    const handleMealPlanNameChange = (event) => {
        const value = event.target.value;

        if (value.length > 20) {
            alert("식단 이름은 20글자를 초과할 수 없습니다.");
            mealPlanNameRef.current.value = value.slice(0, 20);
        };
    };

    // 중량 수정, "-" 입력 안되게 함
    const handleSizeChange = (event) => {
        let value = event.target.value;
        const foodId = event.target.id;
        const regex = /^[0-9]+$/;

        if (!regex.test(value)) value = "";
        if (value > 10000) value = 10000;

        setSizes(sizes.map((sizeData) => {
            if (sizeData.id === foodId) sizeData.size = Number(value);
            return sizeData;
        }));
    };

    // input에서 변경된 중량 반환
    const getSize = (food) => {
        // 최초 렌더링 시 sizes 안에 값이 없어 공백 사용
        return sizes.find((size) => size.id === food.id)?.size || "";
    };

    // 영양성분의 양을 매개변수로 입력하면 사용자가 지정한 음식 중량에 맞춰 변환
    const setAmountPerSize = (food, nutrient) => {
        if (nutrient === undefined || nutrient === "-" || sizes.length === 0) return "-";

        const size = sizes.find((size) => size.id === food.id).size;

        return Math.round(Number(nutrient) * size / 100 * 100) / 100;
    };

    // 식품 단일 삭제 클릭
    const handleFoodDeleteClick = (deleteFood) => {
        const leftFoods = mealPlan.foods.filter((foodData) => deleteFood.id !== foodData.id);
        setMealPlan({ ...mealPlan, foods: leftFoods });
    };

    // 식품 일괄 삭제 클릭
    const handleFoodsDeleteClick = () => {
        const checkbox_list = document.querySelectorAll(".deleteCheckBox");

        // 삭제할 식품 목록
        const deleteFoods = [];
        for (const checkbox of checkbox_list) {
            if (checkbox.checked) deleteFoods.push(checkbox.value);
        };

        // 남은 식품 목록
        const leftFoods = mealPlan.foods.filter((food) => !deleteFoods.includes(food.id));

        setMealPlan({ ...mealPlan, foods: leftFoods });
    };

    // 식단 저장 후 해당 식단 페이지로 이동
    const handleSaveClick = async () => {
        // collection 이름
        const collection = "mealPlans";

        // 식단명 임시 저장
        const mealPlanName = mealPlanNameRef.current.value;

        // 식품 목록 임시 저장
        const mealPlanFoods = mealPlan.foods.map((food) => {
            const sizeData = sizes.find((size) => size.id === food.id);
            // 중량란이 공백이라면 수정 전의 값을 저장
            if (sizeData.size === "") sizeData.size = food.size;
            food = sizeData;
            return food;
        });

        const mealPlanData = { ...mealPlan, name: mealPlanName, foods: mealPlanFoods };

        await setDoc(doc(db, collection, mealPlan.id), mealPlanData);

        navigate("../detail", { state: { mealPlan: mealPlanData } });
    };

    useEffect(() => {
        console.log("mealPlan:", mealPlan);
    }, []);

    return (
        <div>
            <input
                onChange={handleMealPlanNameChange}
                ref={mealPlanNameRef}
                defaultValue={mealPlan.name} />
            <button onClick={handleFoodsDeleteClick}>일괄 삭제</button>
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
                { mealPlan.foods !== undefined && originalFoodDatas !== undefined
                    ? mealPlan.foods.filter((food) => {
                        const foodData = originalFoodDatas.find((originalFood) => originalFood.id === food.id);
                        console.log("foodData:", foodData);
                        // return (<div>{foodData.name}</div>)
                    })
                    // mealPlan.foods.map((food) => {
                    //     if (originalFoodDatas === undefined) return null;
                    //     for (const foodData of originalFoodDatas) {
                    //         if (!(foodData.id === food.id)) return null;
                    //         foodData.serving_size = food.size;
                    //         return (
                    //             <FoodContainer key={foodData.id}>
                    //                 <input className="deleteCheckBox" type="checkbox" value={foodData.id} />
                    //                 <FoodTitle>
                    //                     <Name>
                    //                         <Link to="/food/detail" state={{ food: foodData }}>
                    //                             {foodData.name}
                    //                         </Link>
                    //                     </Name>
                    //                     <Maker>{foodData.description} | {foodData.maker}</Maker>
                    //                 </FoodTitle>
                    //                 <input
                    //                     id={foodData.id}
                    //                     onChange={handleSizeChange}
                    //                     value={getSize(foodData)}
                    //                     placeholder={foodData.serving_size} />
                    //                 <NutrientsContainer>
                    //                     <Nutrients name="calorie">
                    //                         {setAmountPerSize(foodData, foodData.calorie)}
                    //                     </Nutrients>
                    //                     <Nutrients name="carbohydrate">
                    //                         {setAmountPerSize(foodData, foodData.carbohydrate)}
                    //                     </Nutrients>
                    //                     <Nutrients name="protein">
                    //                         {setAmountPerSize(foodData, foodData.protein)}
                    //                     </Nutrients>
                    //                     <Nutrients name="fat">
                    //                         {setAmountPerSize(foodData, foodData.fat)}
                    //                     </Nutrients>
                    //                 </NutrientsContainer>
                    //                 <button onClick={() => handleFoodDeleteClick(foodData)}>삭제</button>
                    //             </FoodContainer>
                    //         )
                    //     }
                    //     return null;
                    // })
                    : <span>no datas</span>
                }
            </FoodListContainer>
            <button onClick={handleSaveClick}>저장</button>
        </div>
    )
}

export default MealPlanUpdate;