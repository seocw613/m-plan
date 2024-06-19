import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SearchBarLayout = styled.div``;

const Form = styled.form`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

const SearchContainer = styled.div`
    height: 36px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border: 1px solid gray;
    border-radius: 18px;
`;

const Select = styled.select`
    font-size: 1rem;
    padding: 8px;
    margin-right: 10px;
    border: none;
    &:focus {
        outline: none;
    }
    & option {
        margin: 5px 0;
    }
`;

const Input = styled.input`
    width: 400px;
    font-size: 1.125rem;
    padding: 6px;
    border: none;
    &:focus {
        outline: none;
    }
`;

const Button = styled.button`
    padding: 10px;
    border: none;
    background-color: white;
    cursor: pointer;
    svg {
        width: 22px;
        height: 22px;
        vertical-align: middle;
    }
`;

const Label = styled.label`
    display: flex;
    gap: 5px;
`;

function SearchBar({ originalFoodDatas, foodDatas, setFoodDatas, setSessionPage }) {
    // 검색 키워드 Ref
    const searchRef = useRef("");

    const navigate = useNavigate();

    // 검색 데이터 가져오기
    const getDatas = (searchAt, keywords, isReSearch) => {
        // 재검색 여부에 따라 검색범위 제한
        const list = [];
        if (isReSearch) list.push(...foodDatas);
        else list.push(...originalFoodDatas);

        // 검색어 없이 검색하는 경우 원본 데이터 반환
        if (keywords[0] === '') return setFoodDatas(list);

        const tmpFoodDatas = list.reduce((accumulator, food) => {
            // AND 조건, 검색 키워드 중 하나라도 없으면 리스트에서 제외
            for (const keyword of keywords) {
                if (!food[searchAt].includes(keyword)) return accumulator;
            };
            return [...accumulator, food];
        }, []);

        setFoodDatas(tmpFoodDatas);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // 검색 대상
        const searchAt = e.target.searchAt.value;

        // 검색 키워드
        const keywords = searchRef.current.value.split(" ");
        console.log("keywords:", keywords);

        // 검색항목 내에서 재검색 여부 확인
        const isReSearch = e.target.isReSearch.checked;

        getDatas(searchAt, keywords, isReSearch);
        setSessionPage(1);

        // 상세 페이지에서 검색할 때 목록 페이지로 전환
        navigate("/food/");
    };

    return (
        <SearchBarLayout>
            <Form onSubmit={handleSearch}>
                <SearchContainer>
                    <Select name="searchAt">
                        <option value="name">식품명</option>
                        <option value="category">분류</option>
                        <option value="maker">제조사</option>
                    </Select>
                    <Input ref={searchRef} />
                    <Button>
                        <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
                        </svg>
                    </Button>
                </SearchContainer>
                <Label>
                    <input type="checkbox" name="isReSearch" />
                    현재 검색항목 내에서 재검색
                </Label>
            </Form>
        </SearchBarLayout>
    )
}

export default SearchBar;