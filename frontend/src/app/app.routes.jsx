import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import SellerRoute from "./SellerRoute";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";
import Checkout from "../features/products/pages/Checkout";
import Wishlist from "../features/products/pages/Wishlist";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/product/:id",
                element: <ProductDetails />
            },
            {
                path: "/checkout",
                element: <Checkout />
            },
            {
                path: "/wishlist",
                element: <Wishlist />
            }
        ]
    },
    {
        path: "/seller",
        element: <SellerRoute />,
        children: [
            {
                path: "/seller/create-product",
                element: <CreateProduct />
            },
            {
                path: "/seller/dashboard",
                element: <Dashboard />
            },
            {
                path: "/seller/product/:id",
                element: <SellerProductDetails />
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