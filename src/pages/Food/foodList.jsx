import { useContext, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import Pagination from "../../components/Pagination.jsx";
import { UserContext } from "../../contexts/UserContext.js";
import MealPlanModal from "../../components/MealPlan/MealPlanModal.js";
import MessageBox from "../../components/Common/MessageBox.js";
import { MessageContext } from "../../contexts/MessageContext.js";

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

    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 현재 사용자 정보
    const { checkSignIn } = useContext(UserContext);

    // 값이 없는 경우 "-"로 표기
    const isNone = (nutrient) => {
        if (nutrient === undefined || nutrient === null) return "-";
        return nutrient;
    };

    // 식단에 식품 추가
    const handleAddFoodToMealPlan = async (event) => {
        // 로그인 여부 확인
        if (!checkSignIn()) return addMessage("로그인 후 이용해주세요.");
        // 식품 id
        const foodId = event.target.value;
        // 모달창 띄우기
        const selectModal = document.getElementById(`selectModal${foodId}`);
        selectModal.showModal();
    };

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
                </FoodContainer>
                {foodDatas &&
                    foodDatas.slice(startOrder, lastOrder).map((food) => (
                        <FoodContainer key={food.id}>
                            <FoodTitle>
                                <Name>
                                    <Link to={`./${food.id}`} state={{ from: "/food/" }}>
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
                            <button onClick={handleAddFoodToMealPlan} value={food.id}>{food.id}담기</button>
                            <MealPlanModal foodId={food.id} serving_size={food.serving_size} />
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