import { useEffect, useState } from "react";
import styled from "styled-components";

const PaginationWrapper = styled.div`
    height: 35px;
    /* border: 1px solid blue; */
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
`;

const PageButtonWrapper = styled.div`
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
    }
    &.active {
        color: darkgreen;
        font-weight: 600;
        cursor: default;
    }
    &.btn_jump {
        border-radius: 50%;
        border: 1px solid rgba(155, 155, 155, 0.8);
        width: 35px;
        svg {
            width: 16px;
            height: 33px;
        }
    }
    &.empty {
        background: none;
        border: none;
        box-shadow: none;
        cursor: default;
    }
`;

function Pagination({ datas, limit, page, setPage }) {
    //총 페이지 수
    const [totalPage, setTotalPage] = useState(1);
    //페이지네이션에서 표시할 페이지 수
    let paginationLimit = 10;
    //페이지네이션 시작, 마지막 페이지 번호
    let startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const [endPage, setEndPage] = useState(paginationLimit);

    useEffect(() => {
        setTotalPage(Math.ceil(datas?.length / limit));
        setPage(1);
    }, [datas]);

    useEffect(() => {
        const tmpEndPage = startPage + paginationLimit - 1;
        tmpEndPage > totalPage
            ? setEndPage(totalPage)
            : setEndPage(tmpEndPage)
    }, [totalPage, page]);

    const handlePageChange = (e) => {
        setPage(e.target.value);
    }

    const handlePagePrev = () => {
        setPage(startPage - 1);
    }

    const handlePageNext = () => {
        setPage(startPage + 10);
    }

    return (
        <PaginationWrapper key={1}>
            {page > 10
                ? <PageButton
                    className="btn_jump"
                    onClick={handlePagePrev}>
                    {"<"}
                </PageButton>
                : <PageButton
                    className="empty" />
            }
            <PageButtonWrapper>
                {
                    Array(endPage - startPage + 1).fill().map((e, index) => (
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
                }
            </PageButtonWrapper>
            {endPage < totalPage ?
                <PageButton
                    className="btn_jump"
                    onClick={handlePageNext}>
                    <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                    </svg>
                </PageButton>
                : <PageButton
                    className="empty" />
            }
        </PaginationWrapper>
    );
}

export default Pagination;