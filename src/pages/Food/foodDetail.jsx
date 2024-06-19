import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

const FoodDetailLayout = styled.div``;

const MealPlanSelectContainer = styled.dialog`
    margin: auto;
`;

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
    // 이전 페이지 저장
    const from = location.state.from;

    // 식단 목록
    const [mealPlanDatas, setMealPlanDatas] = useState();

    // 사용자 지정 음식 중량
    const [size, setSize] = useState(100);

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

        return tmpMealPlanDatas;
    };

    // 식단에 식품 저장
    const handleSaveClick = () => {
        const foodSize = size !== "" ? Number(size) : food.serving_size;
        const data = { id: food.id, size: food.size };

        const collectionName = "mealPlans";

        getMealPlanDatas();

        const selectModal = document.getElementById("selectModal");
        selectModal.showModal();
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
        if (isCancel) return { isCancel: isCancel };

        const mealPlanId = uuidv4();

        const mealPlan = {
            id: mealPlanId,
            name: mealPlanName,
            foods: [],
        };

        const collectionName = "mealPlans";
        const docRef = doc(db, collectionName, mealPlan.id);
        await setDoc(docRef, mealPlan);

        return { isCancel: isCancel, mealPlanId: mealPlanId };
    };

    const handleClose = async (event) => {
        let mealPlanId = event.target.returnValue;
        if (mealPlanId === "close") return;
        let isCancel = false;
        if (mealPlanId === "new") {
            await createMealPlan().then((response) => {
                isCancel = response.isCancel;
                console.log("isCancel?", isCancel);
                if (!isCancel) mealPlanId = response.mealPlanId;
            });
        };
        if (isCancel) return isCancel;

        let mealPlan = {};
        await getMealPlanDatas().then((response) => {
            console.log("response:", response);
            mealPlan = response.find((mealPlanData) => mealPlanData.id === mealPlanId);
        });

        const collectionName = "mealPlans";

        const foodSize = size !== "" ? size : food.serving_size;

        const data = { id: food.id, size: foodSize };

        mealPlan.foods.push(data);
        const docRef = doc(db, collectionName, mealPlan.id);
        await setDoc(docRef, mealPlan);

        alert("등록되었습니다");
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
    }, [context]);

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
            <button onClick={handleSaveClick}>담기</button>
            <MealPlanSelectContainer id="selectModal" onClose={handleClose}>
                <form method="dialog">
                    <button value="close">x</button>
                    담을 식단 선택
                    <button value="new">새 식단</button>
                    {mealPlanDatas &&
                        mealPlanDatas.map((mealPlanData) => (
                            <button value={mealPlanData.id}>{mealPlanData.name}</button>
                        ))
                    }
                </form>
            </MealPlanSelectContainer>
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