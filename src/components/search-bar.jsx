import styled from "styled-components";

const Wrapper = styled.div``;

const Form = styled.form`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const Input = styled.input`
    width: 400px;
    height: 36px;
    font-size: 18px;
    padding: 6px 36px 6px 12px;
    border: 1px solid gray;
    border-radius: 18px;
`;

const Button = styled.button`
    width: 28px;
    height: 28px;
    margin: 4px;
    transform: translateX(-36px);
    border-radius: 14px;
    border: none;
    background-color: lightblue;
    cursor: pointer;
    svg {
        width: 22px;
        height: 28px;
    }
`;

function SearchBar({ searchRef, handleSetUrl, setDatas }) {
    const handleSearch = () => {
        handleSetUrl();
        setDatas(null);
    };

    return (
        <Wrapper>
            <Form onSubmit={(e) => e.preventDefault()}>
                <Input ref={searchRef} />
                <Button
                    onClick={handleSearch}>
                    <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
                    </svg>
                </Button>
            </Form>
        </Wrapper>
    )
}

export default SearchBar;