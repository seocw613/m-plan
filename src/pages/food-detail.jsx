import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div``;

function FoodDetail() {
    const location = useLocation();
    const food = location.state.food;

    return (
        <Wrapper>
            식품코드    {food.FOOD_CD}<br/>
            지역명  {food.SAMPLING_REGION_NAME}<br/>
            채취월  {food.SAMPLING_MONTH_NAME}<br/>
            지역코드    {food.SAMPLING_REGION_CD}<br/>
            채취월코드  {food.SAMPLING_MONTH_CD}<br/>
            식품군  {food.GROUP_NAME}<br/>
            식품이름    {food.DESC_KOR}<br/>
            조사년도    {food.RESEARCH_YEAR}<br/>
            제조사명    {food.MAKER_NAME}<br/>
            자료출처    {food.SUB_REF_NAME}<br/>
            총내용량    {food.SERVING_SIZE}<br/>
            총내용량단위    {food.SERVING_UNIT}<br/>
            열량(kcal)(1회제공량당) {food.NUTR_CONT1}<br/>
            탄수화물(g)(1회제공량당)    {food.NUTR_CONT2}<br/>
            단백질(g)(1회제공량당)  {food.NUTR_CONT3}<br/>
            지방(g)(1회제공량당)    {food.NUTR_CONT4}<br/>
            당류(g)(1회제공량당)    {food.NUTR_CONT5}<br/>
            나트륨(mg)(1회제공량당) {food.NUTR_CONT6}<br/>
            콜레스테롤(mg)(1회제공량당) {food.NUTR_CONT7}<br/>
            포화지방산(g)(1회제공량당)  {food.NUTR_CONT8}<br/>
            트랜스지방(g)(1회제공량당)  {food.NUTR_CONT9}<br/>
        </Wrapper>
    )
}

export default FoodDetail;