import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FoodDetail from "./pages/Food/foodDetail.jsx";
import FoodList from "./pages/Food/foodList.jsx";
import Layout from "./components/Layout.jsx";
import MealPlanList from "./pages/mealPlan/mealPlanList.jsx";
import MealPlanDetail from "./pages/mealPlan/mealPlanDetail.jsx";
import MainPage from "./pages/MainPage.jsx";
import FoodLayout from "./pages/Food/foodLayout.jsx";
import MealPlanLayout from "./pages/mealPlan/mealPlanLayout.jsx";

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
            path: "detail",
            element: <FoodDetail />,
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
            path: "detail",
            element: <MealPlanDetail />,
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
