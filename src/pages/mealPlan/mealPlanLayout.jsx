import { collection, getDocs } from "firebase/firestore";
import { Outlet, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const Layout = styled.div``;

function MealPlanLayout() {
    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;
    // 식단 목록
    const [mealPlanDatas, setMealPlanDatas] = useState([]);

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

    useEffect(() => {
        getMealPlanDatas();
    }, []);

    return (
        <Layout>
            <Outlet context={{ originalFoodDatas, mealPlanDatas, getMealPlanDatas }} />
        </Layout>
    )
}

export default MealPlanLayout;