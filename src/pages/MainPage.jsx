import { Link } from "react-router-dom";
import styled from "styled-components";

const MainPageLayout = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 50px;
`;

const LinkButton = styled.button`
    width: 400px;
    height: 250px;
    border-radius: 30px;
    border: none;
    background-color: white;
    box-shadow: 0 0 10px gray;
    font-size: 1.5rem;
    transition: ease-in-out 0.2s;
    cursor: pointer;
    &:hover {
        box-shadow: 0 0 12px 2px gray;
    }
`;

function MainPage() {
    return (
        <MainPageLayout>
            <Link to="/food/">
                <LinkButton>
                    식품 검색
                </LinkButton>
            </Link>
            <Link to="/mealPlan/">
                <LinkButton>
                    식단 관리
                </LinkButton>
            </Link>
        </MainPageLayout>
    )
}

export default MainPage;