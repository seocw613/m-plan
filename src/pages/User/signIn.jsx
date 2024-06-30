import { Link } from "react-router-dom";
import EmailSignIn from "../../components/User/EmailSignIn";
import styled from "styled-components";
import GithubSignIn from "../../components/User/GithubSignIn";

const Layout = styled.div`
    height: 100vh;
    display: flex;
`;

const Container = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 0 20px 0 gray;
    border-radius: 30px;
    padding: 60px 100px;
`;

const Title = styled.h1`
    font-size: 2rem;
`;

const SubTitle = styled.h2`
    font-size: 1.5rem;
`;

const Row = styled.div`
    display: flex;
    gap: 10px;
`;

function SignIn() {

    return (
        <Layout>
            <Container>
                <Title>로그인</Title>
                <GithubSignIn action="로그인" />
                <hr style={{ width: "100%" }} />
                <SubTitle>이메일로 로그인</SubTitle>
                <EmailSignIn />
                <Row>
                    <span>계정이 없으신가요?</span>
                    <Link to={"../signUp"}>
                        가입하기
                    </Link>
                </Row>
            </Container>
        </Layout>
    );
};

export default SignIn;