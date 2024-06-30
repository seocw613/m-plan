import styled from "styled-components";
import EmailSignUp from "../../components/User/EmailSignUp";
import GithubSignIn from "../../components/User/GithubSignIn";
import { Link } from "react-router-dom";

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

function SignUp() {

    return (
        <Layout>
            <Container>
                <Title>회원가입</Title>
                <GithubSignIn action="가입" />
                <hr style={{ width: "100%" }} />
                <SubTitle>이메일로 회원가입</SubTitle>
                <EmailSignUp />
                <Row>
                    <span>계정이 있으신가요?</span>
                    <Link to={"../signIn"}>
                        로그인하기
                    </Link>
                </Row>
            </Container>
        </Layout>
    );
};

export default SignUp;