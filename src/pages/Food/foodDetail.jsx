import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { MealPlanContext } from "../../contexts/MealPlanContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import MealPlanModal from "../../components/MealPlan/MealPlanModal.js";
import { MessageContext } from "../../contexts/MessageContext.js";

const FoodDetailLayout = styled.div``;

function FoodDetail() {
    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const foodDatas = context.foodDatas;
    // 세그먼트 파라미터 값 가져오기
    const params = useParams();
    const foodId = params.foodId;
    const [food, setFood] = useState();

    // location state
    const location = useLocation();
    // 이전 페이지 저장, url 입력으로 들어온 경우 식품 목록으로 이동
    const from = location.state?.from || "/food";

    // 알림 메시지 추가
    const { addMessage } = useContext(MessageContext);
    // 로그인 여부 확인
    const { user, setSessionUser, checkSignIn } = useContext(UserContext);
    // 식단 목록
    const { mealPlanDatas } = useContext(MealPlanContext);

    // 사용자 지정 음식 중량
    const [size, setSize] = useState(100);

    // 식단에 식품 저장
    const handleAddFoodToMealPlan = () => {
        // 로그인 여부 확인
        if (!checkSignIn()) return addMessage("로그인 후 이용해주세요.");
        // 모달창 띄우기
        const selectModal = document.getElementById(`selectModal${foodId}`);
        selectModal.showModal();
    };

    // 단위 적용
    const setUnit = (nutrient, unit) => {
        if (nutrient === undefined || nutrient === "-" || nutrient === null) return "-";
        return `${nutrient} ${unit}`;
    };

    // 1회 섭취참고량 수정, "-" 입력 안되게 함
    const handleChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]+$/;

        if (!regex.test(value)) {
            setSize("");
            return;
        }
        if (value > 10000) {
            setSize(10000);
            return;
        }
        setSize(value);
    };

    // 영양성분의 양을 매개변수로 입력하면 사용자가 지정한 음식 중량에 맞춰 변환
    const setAmountPerSize = (nutrient) => {
        if (nutrient === undefined || nutrient === "-") return "-";
        return Math.round(Number(nutrient) * size / 100 * 100) / 100;
    };

    useEffect(() => {
        // 식품 목록에서 해당 식품 정보 가져오기
        setFood(foodDatas?.find((foodData) => foodData.id === foodId));
    }, [foodDatas]);

    useEffect(() => {
        // 식품 정보를 성공적으로 가져왔다면 중량 반영
        if (food === undefined) return;
        setSize(food.serving_size);
    }, [food]);

    return (
        <FoodDetailLayout>
            <Link to={from}>
                <button>뒤로 가기</button>
            </Link>
            <button onClick={handleAddFoodToMealPlan}>담기</button>
            <MealPlanModal foodId={foodId} serving_size={size !== "" ? size : food.serving_size} />
            {food &&
                <table>
                    <thead>
                        <tr>
                            <th>식품명</th>
                            <td colSpan={5}>{food.name}<span>{food.description}</span></td>
                        </tr>
                        <tr>
                            <th>분류</th>
                            <td>{food.category}</td>
                            <th>제조사</th>
                            <td>{food.maker}</td>
                            <th>1회 섭취참고량(g)</th>
                            <td>{food.serving_size}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>영양성분</th>
                            <th>100 g당 함량</th>
                            <th><input
                                onChange={handleChange}
                                value={size}
                                placeholder={food.serving_size || 100} /> g당 함량</th>
                        </tr>
                        <tr>
                            <td>에너지</td>
                            <td>{setUnit(food.calorie, "kcal")}</td>
                            <td>{setUnit(setAmountPerSize(food.calorie), "kcal")}</td>
                        </tr>
                        <tr>
                            <td>탄수화물</td>
                            <td>{setUnit(food.carbohydrate, "g")}</td>
                            <td>{setUnit(setAmountPerSize(food.carbohydrate), "g")}</td>
                        </tr>
                        <tr>
                            <td>단백질</td>
                            <td>{setUnit(food.protein, "g")}</td>
                            <td>{setUnit(setAmountPerSize(food.protein), "g")}</td>
                        </tr>
                        <tr>
                            <td>지방</td>
                            <td>{setUnit(food.fat, "g")}</td>
                            <td>{setUnit(setAmountPerSize(food.fat), "g")}</td>
                        </tr>
                        <tr>
                            <td>당류</td>
                            <td>{setUnit(food.saccaride, "g")}</td>
                            <td>{setUnit(setAmountPerSize(food.saccaride), "g")}</td>
                        </tr>
                        <tr>
                            <td>나트륨</td>
                            <td>{setUnit(food.sodium, "mg")}</td>
                            <td>{setUnit(setAmountPerSize(food.sodium), "mg")}</td>
                        </tr>
                    </tbody>
                </table>
            }
        </FoodDetailLayout>
    )
}

export default FoodDetail;