import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import Pagination from "../../components/Pagination.jsx";
import { db } from "../../firebase.jsx";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
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
        padding: 20px 12px;
        background-color: lightblue;
        border-top: 1px solid blue;
        text-align: center;
    }
`;

const FoodTitle = styled.span`
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

    // 식단 목록
    const [mealPlanDatas, setMealPlanDatas] = useState();
    // 선택한 식단 식별번호
    const mealPlanIdRef = useRef("");

    // 식단 목록 가져오기
    const getMealPlanDatas = async () => {
        // firebase collection 이름
        const collectionName = "mealPlans";

        // 보여줄 식단 id 목록
        const mealPlanDataIds = ["test", "test1"];

        // 임시 식단 목록
        const tmpMealPlanDatas = [];

        // for (const mealPlanDataId of mealPlanDataIds) {
        //     // firstore에서 식단 가져오기
        //     const docRef = doc(db, collection, mealPlanDataId);
        //     const docSnap = await getDoc(docRef);
        //     tmpMealPlanDatas.push(docSnap.data());
        // }
        const querySanpshot = await getDocs(collection(db, collectionName));
        querySanpshot.forEach((doc) => {
            tmpMealPlanDatas.push(doc.data());
        });

        setMealPlanDatas(tmpMealPlanDatas);
    };

    // 새 식단 생성
    const createMealPlan = async () => {
        // 식단 이름
        let mealPlanName = "";

        // 프롬프트 안내 문구
        let promptText = "새 식단의 이름을 입력해주세요\n최소 1, 최대 20글자";
        let isContinue = true;
        let isCancel = false;
        // 식단 이름 받기
        while (isContinue) {
            mealPlanName = prompt(promptText);
            if (mealPlanName === null) {
                isCancel = true;
                break;
            };
            isContinue = false;
            if (mealPlanName.length < 1 || mealPlanName.length > 20) isContinue = true;
            if (mealPlanName === "새 식단") {
                alert("해당 이름은 사용할 수 없습니다.");
                isContinue = true;
            };
            for (const mealPlanData of mealPlanDatas) {
                if (mealPlanData.name === mealPlanName) {
                    alert("이미 등록된 식단 이름입니다.");
                    isContinue = true;
                };
            };
        };
        if (isCancel) return isCancel;

        const mealPlanId = uuidv4();
        
        const mealPlan = {
            id: mealPlanId,
            name: mealPlanName,
            foods: [],
        };

        const collectionName = "mealPlans";
        const docRef = doc(db, collectionName, mealPlan.id);
        await setDoc(docRef, mealPlan);
        return isCancel;
    };

    // 새 식단을 선택한 경우 새 식단 생성
    const handleChange = async (event) => {
        if (event.target.value !== "new") return;

        createMealPlan();

        getMealPlanDatas();

        mealPlanIdRef.current.value = "none";
    };

    // 값이 없는 경우 "-"로 표기
    const isNone = (nutrient) => {
        if (nutrient === undefined || nutrient === null) return "-";
        return nutrient;
    };

    // 식단에 식품 추가
    const handleAddFoodToMeal = async (event) => {
        // collection 이름
        const collection = "mealPlans";

        const mealPlanId = mealPlanIdRef.current.value;

        // 식단을 선택하지 않았으면 반환
        if (mealPlanId === "none") {
            document.getElementById("mealPlan").focus();
            alert("식단을 선택해주세요");
            return;
        };

        // 내 식단 목록에서 선택한 식단 저장
        const docRef = doc(db, collection, mealPlanId);
        const docSnap = await getDoc(docRef);
        const mealPlan = docSnap.data();

        // 추가되는 식품 정보 저장
        const foodData = JSON.parse(event.target.value);
        const serving_size = foodData.serving_size;

        const food = { id: String(foodData.id), size: serving_size };

        // 해당 식단에 선택한 식품과 중복되는 데이터가 있다면 반환
        if (mealPlan.foods.some((foodData) => foodData.id === food.id)) {
            alert("이미 식단에 등록된 식품입니다.");
            return;
        };

        mealPlan.foods.push(food);

        await setDoc(doc(db, collection, mealPlan.id), mealPlan);
        alert("등록되었습니다");
    };

    useEffect(() => {
        getMealPlanDatas();
    }, []);

    useEffect(() => {
        console.log("mealPlanDatas:", mealPlanDatas);
    }, [mealPlanDatas]);

    return (
        <FoodListLayout>
            <FoodListContainer>
                <FoodContainer className="title">
                    <FoodTitle>
                        <Name>식품명</Name>
                    </FoodTitle>
                    <NutrientsContainer>
                        <Nutrients>에너지(kcal)</Nutrients>
                        <Nutrients>탄수화물(g)</Nutrients>
                        <Nutrients>단백질(g)</Nutrients>
                        <Nutrients>지방(g)</Nutrients>
                    </NutrientsContainer>
                    <select
                        id="mealPlan"
                        name="mealPlan"
                        ref={mealPlanIdRef}
                        onChange={handleChange}>
                        <option value="none">식단 선택</option>
                        <option value="new">새 식단</option>
                        {mealPlanDatas &&
                            mealPlanDatas.map((mealPlan) => (
                                <option key={mealPlan.id} value={mealPlan.id}>{mealPlan.name}</option>
                            ))
                        }
                    </select>
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
                                <Nutrients name="calorie">
                                    {isNone(food.calorie)}
                                </Nutrients>
                                <Nutrients name="carbohydrate">
                                    {isNone(food.carbohydrate)}
                                </Nutrients>
                                <Nutrients name="protein">
                                    {isNone(food.protein)}
                                </Nutrients>
                                <Nutrients name="fat">
                                    {isNone(food.fat)}
                                </Nutrients>
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