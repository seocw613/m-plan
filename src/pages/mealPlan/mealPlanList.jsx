import { useEffect, useState } from "react";
import { db } from "../../firebase.jsx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const MealPlanListLayout = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MealPlanContainer = styled.div`
    padding: 20px;
    box-shadow: 0 0 5px 0 gray;
    cursor: pointer;
`;

function MealPlanList() {
    // 식단 목록
    const [mealPlans, setMealPlans] = useState([]);

    // 식단 목록에 식품 추가
    const getMealPlanDatas = async () => {
        // firebase collection 이름
        const collection = "mealPlans";

        // 보여줄 식단 id 목록
        const mealPlanIds = ["test", "test1"];

        // 임시 식단 목록
        const tmpMealPlans = [];

        for (const mealPlanId of mealPlanIds) {
            // firstore에서 식단 가져오기
            const docRef = doc(db, collection, mealPlanId);
            const docSnap = await getDoc(docRef);
            tmpMealPlans.push(docSnap.data());
        }

        setMealPlans(tmpMealPlans);
    };

    useEffect(() => {
        getMealPlanDatas();
    }, []);

    return (
        <MealPlanListLayout>
            {
                mealPlans.length > 1
                    ? mealPlans.map((mealPlan) => (
                        <MealPlanContainer key={mealPlan.id} >
                            <Link to="/mealPlan/detail" state={{ mealPlan: mealPlan }}>
                                <div>
                                    {mealPlan.name}
                                </div>
                            </Link>
                        </MealPlanContainer>
                    ))
                    : <span>no datas</span>
            }
        </MealPlanListLayout>
    )
}

export default MealPlanList;