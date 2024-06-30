import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";

export function useMealPlan() {
    // 현재 사용자의 식단 목록
    const [mealPlanDatas, setMealPlanDatas] = useState([]);

    // 현재 사용자의 식단 목록 가져오기
    const getMealPlanDatas = async (user) => {
        // 로그인되지 않았다면 식단 목록 삭제
        if (!user) {
            setMealPlanDatas([]);
            return;
        };
        // 컬렉션 이름
        const collectionName = "mealPlans";
        // 식단 id 목록
        const mealPlanIds = user.mealPlanIds;
        // 작성된 식단이 없는 경우 종료
        if (mealPlanIds.length === 0) return;
        // 현재 사용자의 식단 목록 가져오기
        const q = query(collection(db, collectionName), where("id", "in", mealPlanIds));
        const querySnapshot = await getDocs(q);
        const tmpMealPlanDatas = querySnapshot.docs.map((doc) => doc.data());
        setMealPlanDatas(tmpMealPlanDatas);
    };

    // 새 식단 생성
    const createMealPlan = async (user, setSessionUser) => {
        // 식단 이름
        let mealPlanName = "";

        // 프롬프트 안내 문구
        let promptText = "새 식단의 이름을 입력해주세요\n최소 1, 최대 20글자";
        let isContinue = true;
        // 식단 이름 받기
        while (isContinue) {
            mealPlanName = prompt(promptText);
            // 프롬프트 창에서 취소를 누른 경우
            if (mealPlanName === null) throw { code: "canceled" };
            isContinue = false;
            // 식당명 길이가 부적절
            if (mealPlanName.length < 1 || mealPlanName.length > 20) isContinue = true;
            // 사용 불가한 이름 제출
            if (["식단 선택", "새 식단"].includes(mealPlanName)) {
                alert("해당 이름은 사용할 수 없습니다.");
                isContinue = true;
            };
            // 소유 중인 식단과 이름이 같음
            if (mealPlanDatas.some((mealPlanData) => mealPlanData.name === mealPlanName)) {
                alert("이미 등록된 식단 이름입니다.");
                isContinue = true;
            };
        };

        // DB에 새로운 식단 저장
        // UUID 생성
        const mealPlanId = uuidv4();
        // 데이터 생성
        const mealPlan = {
            id: mealPlanId,
            name: mealPlanName,
            foods: [],
        };
        // DB에 등록
        const mealPlanCollectionName = "mealPlans";
        await setDoc(doc(db, mealPlanCollectionName, mealPlan.id), mealPlan);
        // 사용자 DB에 식단 ID 추가
        const userCollectionName = "users";
        const userData = { ...user, mealPlanIds: [...user.mealPlanIds, mealPlanId] };
        await setDoc(doc(db, userCollectionName, user.UID), userData);
        // 현재 사용자 정보에 저장
        setSessionUser(userData);

        return mealPlanId;
    };

    // 식단에 식품 추가
    const addFoodToMealPlan = async (mealPlan, foodId, serving_size) => {
        foodId = String(foodId);
        // 추가하려는 식단에 선택한 식품의 데이터 중복 여부 확인
        if (mealPlan.foods.some((foodData) => foodData.id === foodId)) {
            return `${mealPlan.name}에 이미 있는 식품입니다.`;
        };
        // 식단에 있는 식품 개수 제한
        const foodsLimit = 20;
        if (mealPlan.foods.length >= foodsLimit) {
            return `하나의 식단에는 최대 ${foodsLimit}개의 식품만 등록 가능합니다.`;
        };
        // 데이터 저장
        const data = { id: foodId, size: serving_size };
        mealPlan.foods.push(data);
        // DB에 등록
        const collectionName = "mealPlans";
        await setDoc(doc(db, collectionName, mealPlan.id), mealPlan);

        return "추가되었습니다.";
    };

    return { mealPlanDatas, setMealPlanDatas, getMealPlanDatas, createMealPlan, addFoodToMealPlan };
};