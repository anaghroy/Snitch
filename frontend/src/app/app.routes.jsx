import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import SellerRoute from "./SellerRoute";
import CreateProduct from "../features/products/pages/CreateProduct";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <h1>Hello world</h1>,
            }
        ]
    },
    {
        path: "/seller",
        element: <SellerRoute />,
        children: [
            {
                path: "create-product",
                element: <CreateProduct />
            }
        ]
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    }
])