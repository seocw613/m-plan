import { Outlet, useOutletContext } from "react-router-dom";
import styled from "styled-components";

const Layout = styled.div``;

function MealPlanLayout() {
    // OutletContext
    const context = useOutletContext();
    // 검색된 식품 정보
    const originalFoodDatas = context.originalFoodDatas;

    return (
        <Layout>
            <Outlet context={{ originalFoodDatas }} />
        </Layout>
    )
}

export default MealPlanLayout;