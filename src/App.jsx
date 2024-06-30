import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import FoodLayout from "./pages/Food/FoodLayout.jsx";
import FoodList from "./pages/Food/FoodList.jsx";
import FoodDetail from "./pages/Food/FoodDetail.jsx";
import MealPlanLayout from "./pages/MealPlan/MealPlanLayout.jsx";
import MealPlanList from "./pages/MealPlan/MealPlanList.jsx";
import MealPlanDetail from "./pages/MealPlan/MealPlanDetail.jsx";
import MealPlanUpdate from "./pages/MealPlan/MealPlanUpdate.jsx";
import SignUp from "./pages/User/SignUp.jsx";
import SignIn from "./pages/User/SignIn.jsx";
import UserLayout from "./pages/User/UserLayout.jsx";
import NaverSignInCallback from "./components/User/NaverSignInCallback.js";
import KakaoSignInCallback from "./components/User/KakaoSignInCallback.js";
import { useMessage } from "./hooks/useMessage.js";
import { useUser } from "./hooks/useUser.js";
import { useMealPlan } from "./hooks/useMealPlan.js";
import { MessageContext } from "./contexts/MessageContext.js";
import { UserContext } from "./contexts/UserContext.js";
import { MealPlanContext } from "./contexts/MealPlanContext.js";

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    color: black;
    text-decoration: none;
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
  
  /* 인풋 자동완성 시 글자색, 배경색 변경되지 않도록 설정 */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: black;
    -webkit-box-shadow: 0 0 0px 1000px white inset;
    box-shadow: 0 0 0px 1000px white inset;
    transition: background-color 5000s ease-in-out 0s;
  }
  input:autofill,
  input:autofill:hover,
  input:autofill:focus,
  input:autofill:active {
    -webkit-text-fill-color: black;
    -webkit-box-shadow: 0 0 0px 1000px white inset;
    box-shadow: 0 0 0px 1000px white inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MainPage />,
      },
      {
        path: "food/",
        element: <FoodLayout />,
        children: [
          {
            path: "",
            element: <FoodList />,
          },
          {
            path: ":foodId",
            element: <FoodDetail />,
          },
        ]
      },
      {
        path: "user/",
        element: <UserLayout />,
        children: [
          {
            path: "signUp",
            element: <SignUp />,
          },
          {
            path: "signIn",
            element: <SignIn />,
          },
          {
            path: "naverSignInCallback",
            element: <NaverSignInCallback />,
          },
          {
            path: "kakaoSignInCallback",
            element: <KakaoSignInCallback />,
          },
        ]
      },
      {
        path: "mealPlan/",
        element: <MealPlanLayout />,
        children: [
          {
            path: "",
            element: <MealPlanList />,
          },
          {
            path: ":mealPlanId",
            element: <MealPlanDetail />,
          },
          {
            path: ":mealPlanId/update",
            element: <MealPlanUpdate />,
          },
        ]
      },
    ]
  },
],
  {
    basename: "/m-plan",
  });

function App() {
  // 메시지 목록, 메시지 띄우기
  const { messages, addMessage } = useMessage();
  // 사용자의 DB 정보, 현재 사용자 정보 저장, 현재 사용자 정보 삭제, 로그인 여부 확인
  const { user, setSessionUser, removeSessionUser, checkSignIn } = useUser();
  // 현재 사용자의 식단 목록, 식단 목록 가져오기, 새 식단 생성, 식단에 식품 추가
  const { mealPlanDatas, getMealPlanDatas, createMealPlan, addFoodToMealPlan } = useMealPlan();

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      <UserContext.Provider value={{ user, setSessionUser, removeSessionUser, checkSignIn }}>
        <MealPlanContext.Provider
          value={{ mealPlanDatas, getMealPlanDatas, createMealPlan, addFoodToMealPlan }}>
          <main>
            <GlobalStyle />
            <RouterProvider router={router} />
          </main>
        </MealPlanContext.Provider>
      </UserContext.Provider>
    </MessageContext.Provider>
  );
}

export default App;
