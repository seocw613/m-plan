import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import FoodLayout from "./pages/Food/foodLayout.jsx";
import FoodList from "./pages/Food/foodList.jsx";
import FoodDetail from "./pages/Food/foodDetail.jsx";
import MealPlanLayout from "./pages/MealPlan/mealPlanLayout.jsx";
import MealPlanList from "./pages/MealPlan/mealPlanList.jsx";
import MealPlanDetail from "./pages/MealPlan/mealPlanDetail.jsx";
import MealPlanUpdate from "./pages/MealPlan/mealPlanUpdate.jsx";
import SignUp from "./pages/User/signUp.jsx";
import SignIn from "./pages/User/signIn.jsx";

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
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/food",
        element: <FoodLayout />,
        children: [
          {
            path: "/food/",
            element: <FoodList />,
          },
          {
            path: "/food/:foodId",
            element: <FoodDetail />,
          },
        ]
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/signIn",
        element: <SignIn />,
      },
      {
        path: "/mealPlan",
        element: <MealPlanLayout />,
        children: [
          {
            path: "/mealPlan/",
            element: <MealPlanList />,
          },
          {
            path: "/mealPlan/:mealPlanId",
            element: <MealPlanDetail />,
          },
          {
            path: "/mealPlan/:mealPlanId/update",
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
  return (
    <div>
      <GlobalStyle />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
