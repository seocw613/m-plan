import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
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

    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;
    // 식단 목록
    const mealPlanDatas = context.mealPlanDatas;
    // 식단 정보
    const [mealPlan, setMealPlan] = useState();

    // 식단 이름, 불필요한 렌더링 줄이기 위해서 useRef 사용
    const mealPlanNameRef = useRef();

    // 중량 정보
    const [sizes, setSizes] = useState();

    // 세그먼트 파라미터
    const params = useParams();
    // 식단 id
    const mealPlanId = params.mealPlanId;

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
        return sizes?.find((size) => size.id === food.id)?.size || "";
    };

    // 영양성분의 양을 매개변수로 입력하면 사용자가 지정한 음식 중량에 맞춰 변환
    const setAmountPerSize = (food, nutrient) => {
        if (nutrient === undefined || nutrient === "-" || sizes?.length === 0) return "-";

        const size = sizes?.find((size) => size.id === food.id).size;

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
        const collectionName = "mealPlans";

        // 식단 이름 임시 저장
        const mealPlanName = mealPlanNameRef.current.value;

        // 기존 식단 목록 가져와서 식단 이름이 기존의 식단과 겹치면 반환
        let tmpMealPlanDatas = [];

        const querySanpshot = await getDocs(collection(db, collectionName));
        querySanpshot.forEach((doc) => {
            tmpMealPlanDatas.push(doc.data());
        });

        const isExist = tmpMealPlanDatas.some((mealPlanData) => (
            mealPlanData.name === mealPlanName
            && mealPlanData.id !== mealPlan.id
        ));
        if (isExist) {
            alert("이미 등록된 식단 이름입니다.");
            mealPlanNameRef.current.focus();
            return;
        };

        // 식품 목록 임시 저장
        const mealPlanFoods = mealPlan.foods.map((food) => {
            const sizeData = sizes.find((size) => size.id === food.id);
            // 중량란이 공백이라면 수정 전의 값을 저장
            if (sizeData.size === "") sizeData.size = food.size;
            food = sizeData;
            return food;
        });

        const mealPlanData = { ...mealPlan, name: mealPlanName, foods: mealPlanFoods };

        await setDoc(doc(db, collectionName, mealPlan.id), mealPlanData);

        navigate(`../${mealPlanId}`);
    };

    // 취소, 뒤로가기
    const handleCancelClick = () => {
        navigate(`../${mealPlanId}`);
    };

    useEffect(() => {
        setMealPlan(mealPlanDatas.find((mealPlanData) => mealPlanData.id === mealPlanId));
    }, [context]);

    useEffect(() => {
        if (mealPlan === undefined) return;
        console.log("mealPlan:", mealPlan);
        // 중량 정보 별도 저장
        setSizes(JSON.parse(JSON.stringify(mealPlan.foods)));
        mealPlanNameRef.current.value = mealPlan.name;
    }, [mealPlan]);

    return (
        <div>
            {mealPlan &&
                <input
                    onChange={handleMealPlanNameChange}
                    ref={mealPlanNameRef}
                    defaultValue={mealPlan.name} />
            }
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
                {mealPlan
                    && mealPlan.foods !== undefined
                    && mealPlan.foods.length !== 0
                    && originalFoodDatas !== undefined
                    ? mealPlan.foods.map((food) => {
                        const foodData = originalFoodDatas
                            .find((originalFood) => originalFood.id === food.id);
                        foodData.serving_size = food.size;
                        return (
                            <FoodContainer key={foodData.id}>
                                <input className="deleteCheckBox" type="checkbox" value={foodData.id} />
                                <FoodTitle>
                                    <Name>
                                        {foodData.name}
                                    </Name>
                                    <Maker>{foodData.description} | {foodData.maker}</Maker>
                                </FoodTitle>
                                <input
                                    id={foodData.id}
                                    onChange={handleSizeChange}
                                    value={getSize(foodData)}
                                    placeholder={foodData.serving_size} />
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
                                <button onClick={() => handleFoodDeleteClick(foodData)}>삭제</button>
                            </FoodContainer>
                        )
                    })
                    : <span>no datas</span>
                }
            </FoodListContainer>
            <button onClick={handleSaveClick}>저장</button>
            <button onClick={handleCancelClick}>취소</button>
        </div>
    )
}

export default MealPlanUpdate;