import ChangePasswordAdmin from "../components/admin/ChangePassword";
import { CreateCategory } from "../components/admin/Category/CreateCategory";
import { CreateProducts } from "../components/admin/Product/CreateProducts";
import Dashboard from "../components/admin/Dashboard";
import Login from "../components/user/auth/Login";
import { Order } from "../components/admin/Order/Order";
import { OrderDetail } from "../components/admin/Order/OrderDetail";
import  Page404  from "../components/errors/Page404";
import ProfileAdmin from "../components/admin/Profile";
import Register from "../components/user/auth/Register";
import { UpdateCategory } from "../components/admin/Category/UpdateCategory";
import { UpdateProduct } from "../components/admin/Product/UpdateProduct";
import { ViewCategory } from "../components/admin/Category/ViewCategory";
import { ViewProducts } from "../components/admin/Product/ViewProducts";

const routes = [
  { path: "/admin/login", exact: true, name: "Login", component: Login },
  { path: "/admin/register", exact: true, name: "Register", component: Register },
  { path: "/admin", exact: true, name: "Admin" },
  {
    path: "/admin/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  
  {
    path: "/admin/view-category",
    exact: true,
    name: "View-Category",
    component: ViewCategory,
  },
  {
    path: "/admin/add-category",
    exact: true,
    name: "Category",
    component: CreateCategory,
  },
  {
    path: "/admin/edit-category/:id",
    exact: true,
    name: "View-Detail-Category",
    component: UpdateCategory,
  },
  {
    path: "/admin/add-product",
    exact: true,
    name: "Add-Products",
    component: CreateProducts,
  },
  {
    path: "/admin/view-product",
    exact: true,
    name: "View-Products",
    component: ViewProducts,
  },
  {
    path: "/admin/edit-product/:id",
    exact: true,
    name: "Edit-Products",
    component: UpdateProduct,
  },
  {
    path: "/admin/orders",
    exact: true,
    name: "Order",
    component: Order,
  },
  {
    path: "/admin/order/:id",
    exact: true,
    name: "OrderDetail",
    component: OrderDetail,
  },
  { path: "/admin/info", exact: true, name: "Profile", component: ProfileAdmin },
  { path: "/admin/change-password", exact: true, name: "ChangePassword", component: ChangePasswordAdmin },
  {
    path: "/admin/**",
    exact: true,
    name: "Page404",
    component: Page404,
  },
];

export default routes;
