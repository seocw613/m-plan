import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const FoodDetailLayout = styled.div``;

function FoodDetail() {
    const location = useLocation();
    const food = location.state.food;

    // 단위 반영
    const setUnit = (nutrient, unit) => {
        if (nutrient === undefined || nutrient === "-") return "-";
        return `${nutrient} ${unit}`;
    };

    // 사용자 지정 음식 중량
    const [size, setSize] = useState(food.serving_size || 100);

    // 1회 섭취참고량 값에서 숫자만 추출하여 size에 저장
    const setNumberSize = () => {
        const regex = /[^0-9]/g;
        setSize(String(size).replace(regex, ""));
    };

    useEffect(() => {
        setNumberSize();
    }, []);

    // 1회 제공량 수정, "-" 입력 안되게 함
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

    return (
        <FoodDetailLayout>
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
                        <th>1회 섭취참고량</th>
                        <td>{food.serving_size}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>영양성분</th>
                        <th>100 g당 함량</th>
                        <th><input onChange={handleChange} value={size} /> g당 함량</th>
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
        </FoodDetailLayout>
    )
}

export default FoodDetail;