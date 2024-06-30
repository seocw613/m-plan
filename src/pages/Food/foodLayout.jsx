import { Outlet, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "../../components/SearchBar";

const Layout = styled.div``;

function FoodLayout() {
    // OutletContext
    const context = useOutletContext();

    const originalFoodDatas = context.originalFoodDatas;
    const foodDatas = context.foodDatas;
    const setFoodDatas = context.setFoodDatas;
    const page = context.page;
    const setSessionPage = context.setSessionPage;

    return (
        <Layout>
            <SearchBar
                originalFoodDatas={originalFoodDatas}
                foodDatas={foodDatas}
                setFoodDatas={setFoodDatas}
                setSessionPage={setSessionPage} />
            <Outlet context={{ foodDatas, page, setSessionPage }} />
        </Layout>
    )
}

export default FoodLayout;