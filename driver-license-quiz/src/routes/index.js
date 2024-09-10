import LayoutDefault from "../components/layout/LayoutDefault";
import PrivateRoutes from "../components/PrivateRoutes";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Topics from "../pages/Topics";
import Answers from "../pages/Answers";
import Quiz from "../pages/Quiz";
import Result from "../pages/Result";
import Test from "../pages/Test";

export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "logout",
                element: <Logout /> // đặt public do nếu để private thì khi đăng xuất sẽ navigate tới login (xem PrivateRoutes)
            },
            {
                element: <PrivateRoutes />,
                children: [
                    {
                        path: "topics",
                        element: <Topics />
                    },
                    {
                        path: "answers",
                        element: <Answers />
                    },
                    {
                        path: "quiz/:id",
                        element: <Quiz />
                    },
                    {
                        path: "result/:id",
                        element: <Result />
                    },
                    {
                        path: "test",
                        element: <Test />
                    }
                ]
            }
        ]
    },
]