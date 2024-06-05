import { styled, createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import { createHashRouter, RouterProvider } from "react-router-dom";
import FoodDetail from ".//pages/food-detail.jsx";
import FoodList from ".//pages/food-list.jsx";

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  body{
    font-family: "Pretendard-Regular";
    font-weight: 500;
  }
`;

const router = createHashRouter([
  {
    path: "/",
    element: <FoodList />,
  },
  {
    path: "/detail",
    element: <FoodDetail />,
  }
])

const Wrapper = styled.div``;

function App() {
  return (
    <Wrapper>
      <GlobalStyle />
      <RouterProvider router={router} />
    </Wrapper>
  );
}

export default App;
