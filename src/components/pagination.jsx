import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PaginationLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PaginationContainer = styled.div`
    height: 35px;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
`;

const PageButtonContainer = styled.div`
    display: flex;
    gap: 20px;
`;

const PageButton = styled.button`
    font-size: 15px;
    color: gray;
    border: none;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    &:hover {
        color: black;
    };
    &.active {
        color: darkgreen;
        font-weight: 600;
        cursor: default;
    };
    &.btn_jump {
        border-radius: 50%;
        border: 1px solid rgba(155, 155, 155, 0.8);
        width: 35px;
        svg {
            width: 16px;
            height: 33px;
        };
    };
`;

const PageSearchForm = styled.form`
    margin-top: 10px;
    display: flex;
`;

const PageInput = styled.input`
    width: 60px;
    height: 30px;
    padding: 5px 10px;
    border-radius: 15px;
    border: 1px solid gray;
    font-size: 1rem;
    text-align: center;

    /* 숫자 증가, 감소 버튼 없애기 */
    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    };
    /* Firefox */
    &[type=number] {
        -moz-appearance: textfield;
    };
`;

const TotalPage = styled.span`
    height: 30px;
    line-height: 30px;
    margin: 0 5px;
`;

const PageInputButton = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 14px;
    border: none;
    background-color: lightblue;
    cursor: pointer;
    svg {
        width: 22px;
        height: 28px;
    };
`;

function Pagination({ foodDatas, limit, page, setSessionPage }) {
    // 총 페이지 수
    const [totalPage, setTotalPage] = useState(1);
    // 페이지네이션에서 표시할 페이지 수
    let paginationLimit = 10;
    // 페이지네이션 시작, 마지막 페이지 번호
    let startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const [endPage, setEndPage] = useState(paginationLimit);
    // 검색 페이지 번호 Ref
    const pageSearchRef = useRef(page);

    // 검색된 데이터 수 확인 후 총 페이지 수 저장
    useEffect(() => {
        setTotalPage(Math.ceil(foodDatas?.length / limit));
    }, [foodDatas]);

    // 현재 페이지네이션 마지막 번호가 총 페이지 수를 넘기지 않도록 제한
    useEffect(() => {
        const tmpEndPage = startPage + paginationLimit - 1;
        tmpEndPage > totalPage
            ? setEndPage(totalPage)
            : setEndPage(tmpEndPage);
        pageSearchRef.current.value = page;
    }, [totalPage, page]);

    // 클릭한 페이지로 이동
    const handlePageChange = (event) => {
        setSessionPage(event.target.value)
    };

    // 이전 페이지 리스트로 이동
    const handlePagePrev = () => {
        setSessionPage(startPage - 1);
    };

    // 다음 페이지 리스트로 이동
    const handlePageNext = () => {
        setSessionPage(startPage + 10);
    };

    // 페이지 번호 범위 제한
    const handleChange = (event) => {
        const number = event.target.value;
        const regex = /^[0-9]+$/;

        if (!regex.test(number)) pageSearchRef.current.value = "";
        if (number > totalPage) pageSearchRef.current.value = totalPage;
    }

    // 페이지 번호 입력으로 페이지 변경
    const handleSearch = (event) => {
        event.preventDefault();
        setSessionPage(pageSearchRef.current.value);
    };

    return (
        <PaginationLayout>
            <PaginationContainer>
                {page > paginationLimit
                    ? <PageButton
                        className="btn_jump"
                        onClick={handlePagePrev}>
                        <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                        </svg>
                    </PageButton>
                    : null
                }
                <PageButtonContainer>
                    {
                        endPage >= startPage ?
                            Array(endPage - startPage + 1).fill().map((event, index) => (
                                index + startPage == page
                                    ? <PageButton
                                        key={index + startPage}
                                        className="active"
                                        value={index + startPage}>
                                        {index + startPage}
                                    </PageButton>
                                    :
                                    <PageButton
                                        key={index + startPage}
                                        onClick={handlePageChange}
                                        value={index + startPage}>
                                        {index + startPage}
                                    </PageButton>
                            ))
                            : null
                    }
                </PageButtonContainer>
                {endPage < totalPage ?
                    <PageButton
                        className="btn_jump"
                        onClick={handlePageNext}>
                        <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                        </svg>
                    </PageButton>
                    : null
                }
            </PaginationContainer>
            <PageSearchForm onSubmit={handleSearch}>
                <PageInput
                    ref={pageSearchRef}
                    onChange={handleChange}
                    defaultValue={page} />
                <TotalPage>
                    / {totalPage || null}
                </TotalPage>
                <PageInputButton>
                    <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
                    </svg>
                </PageInputButton>
            </PageSearchForm>
        </PaginationLayout>
    );
}

export default Pagination;