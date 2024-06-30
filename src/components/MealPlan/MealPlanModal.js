import styled from "styled-components";
import { MessageContext } from "../../contexts/MessageContext";

const { useContext } = require("react");
const { MealPlanContext } = require("../../contexts/MealPlanContext");
const { UserContext } = require("../../contexts/UserContext");

const Dialog = styled.dialog`
    margin: auto;
`;

function MealPlanModal({ foodId, serving_size }) {
    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 현재 사용자
    const { user, setSessionUser } = useContext(UserContext);
    // 현재 사용자의 식단 목록
    const { mealPlanDatas, getMealPlanDatas, createMealPlan, addFoodToMealPlan } = useContext(MealPlanContext);
    
    // 모달창을 닫을 때 발생하는 이벤트
    const handleClose = async (event) => {
        // 모달창 닫을 때 받은 정보
        let mealPlanId = event.target.returnValue;
        // ESC로 탈출 혹은 취소 선택
        if (["", "close"].includes(mealPlanId)) return;
        let isCancel = false;
        // 새 식단 선택
        if (mealPlanId === "new") {
            await createMealPlan(user, setSessionUser).then((response) => {
                mealPlanId = response.mealPlanId;
            }).catch((error) => {
                console.log("error:", error.code);
                isCancel = true;
            });
        };
        if (isCancel) return;

        // 식단 정보 가져오기
        const mealPlan = mealPlanDatas.find((mealPlanData) => mealPlanData.id === mealPlanId);
        // 식단에 식품 추가
        await addFoodToMealPlan(mealPlan, foodId, serving_size).then((result) => addMessage(result));
        // 식단 목록 업데이트
        getMealPlanDatas(user);
    };

    return (
        <Dialog id={`selectModal${foodId}`} onClose={handleClose}>
            <form method="dialog">
                <button value="close">x</button>
                <br />
                <button value="new">새 식단</button>
                {mealPlanDatas.length > 0
                    ? mealPlanDatas.map((mealPlanData) => (
                        <button key={mealPlanData.id} value={mealPlanData.id}>{mealPlanData.name}</button>
                    ))
                    : null
                }
            </form>
        </Dialog>
    );
};

export default MealPlanModal;