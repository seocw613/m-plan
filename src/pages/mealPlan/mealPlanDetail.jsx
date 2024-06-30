import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";
import { MealPlanContext } from "../../contexts/MealPlanContext";
import { MessageContext } from "../../contexts/MessageContext";
import { UserContext } from "../../contexts/UserContext";

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
    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;
    // 식단 목록
    const { mealPlanDatas } = useContext(MealPlanContext);
    // 식단 정보
    const [mealPlan, setMealPlan] = useState();
    // 식단 이름
    const [mealPlanName, setMealPlanName] = useState();
    // 중량 정보
    const [sizes, setSizes] = useState([]);
    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 현재 사용자 정보, 현재 사용자 업데이트
    const { user, setSessionUser } = useContext(UserContext);

    // 세그먼트 파라미터
    const params = useParams();
    // 식단 id
    const mealPlanId = params.mealPlanId;

    const handleClick = async () => {
        if (!window.confirm("식단을 삭제하시겠습니까?")) return;
        // 식단 DB에서 식단 삭제
        const mealPlanCollectionName = "mealPlans";
        await deleteDoc(doc(db, mealPlanCollectionName, mealPlan.id));
        // 사용자 DB에서 식단 id 삭제
        const mealPlanIds = user.mealPlanIds.filter((id) => id !== mealPlanId);
        const userData = { ...user, mealPlanIds: mealPlanIds };
        const userCollectionName = "users";
        await setDoc(doc(db, userCollectionName, user.UID), userData);
        // 현재 사용자 정보 업데이트
        setSessionUser(userData);
    };

    // 영양성분의 양을 매개변수로 입력하면 사용자가 지정한 음식 중량에 맞춰 변환
    const setAmountPerSize = (food, nutrient) => {
        if (nutrient === undefined || nutrient === "-" || sizes.length == 0) return "-";

        const size = sizes.find((size) => size.id == food.id).size;

        return Math.round(Number(nutrient) * size / 100 * 100) / 100;
    };

    useEffect(() => {
        // 선택한 식단 가져오기
        const tmpMealPlan = mealPlanDatas.find((mealPlanData) => mealPlanData.id === mealPlanId);
        // 선택한 식단이 식단 목록에 없는 경우 메인 페이지로 이동
        // 식단 ID를 URL에 직접 입력하는 경우 등
        if (tmpMealPlan === undefined) {
            // 알림 메시지 추가
            addMessage("잘못된 접근입니다.");
            // 메인 페이지로 이동
            navigate("/");
            return;
        };
        setMealPlan();
    }, [context]);

    useEffect(() => {
        if (mealPlan === undefined) return;
        // 중량 정보 별도 저장
        setSizes([...mealPlan.foods.map((food) => {
            const data = { id: food.id, size: food.size };
            return data;
        })]);
        setMealPlanName(mealPlan.name);
    }, [mealPlan]);

    return (
        <div>
            <div>{mealPlanName}</div>
            <Link to="./update">
                <button>수정</button>
            </Link>
            <button onClick={handleClick}>삭제</button>
            <Link to="../">
                <button>목록으로</button>
            </Link>
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
                        const foodData = {
                            ...originalFoodDatas
                                .find((originalFood) => originalFood.id === food.id)
                        };
                        // 깊은 복사
                        foodData.serving_size = Number(food.size);
                        return (
                            <FoodContainer key={foodData.id}>
                                <FoodTitle>
                                    <Name>
                                        <Link
                                            to={`/food/${foodData.id}`}
                                            state={{ from: `/mealPlan/${mealPlanId}` }}>
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
            <Link to="../">
                <button>목록으로</button>
            </Link>
        </div>
    )
}

export default MealPlanDetail;