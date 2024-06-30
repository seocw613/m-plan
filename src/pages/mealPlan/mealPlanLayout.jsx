import { collection, getDocs, query, where } from "firebase/firestore";
import { Outlet, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

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