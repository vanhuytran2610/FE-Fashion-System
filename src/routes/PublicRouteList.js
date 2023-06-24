import { About } from "../components/user/About";
import { Cart } from "../components/user/Cart";
import { ChangePassword } from "../components/user/ChangePassword";
import { Checkout } from "../components/user/Checkout";
import { Contact } from "../components/user/Contact";
import Home from "../components/user/Home";
import Login from "../components/user/auth/Login";
import { Order } from "../components/user/OrderList";
import Page403 from "../components/errors/Page403";
import Page404 from "../components/errors/Page404";
import { Profile } from "../components/user/Profile";
import Register from "../components/user/auth/Register";
import SearchResultsPage from "../components/user/SearchResultsPage";
import { Thankyou } from "../components/user/Thankyou";
import { ViewProduct } from "../components/user/collections/ViewProduct";
import { ViewProductDetail } from "../components/user/collections/ViewProductDetail";

const PublicRouteList = [
  { path: "/", exact: true, name: "Home", component: Home },
  { path: "/about", exact: true, name: "About", component: About },
  { path: "/contact", exact: true, name: "Contact", component: Contact },
  { path: "/403", exact: true, name: "Page403", component: Page403 },
  { path: "/404", exact: true, name: "Page404", component: Page404 },
  { path: "/login", exact: true, name: "Login", component: Login },
  { path: "/register", exact: true, name: "Register", component: Register },
  { path: "/category/:id", exact: true, name: "ViewProduct", component: ViewProduct },
  { path: "/category/:category/:product", exact: true, name: "ViewProductDetail", component: ViewProductDetail },
  { path: "/cart", exact: true, name: "Cart", component: Cart },
  { path: "/checkout", exact: true, name: "Checkout", component: Checkout },
  { path: "/thankyou", exact: true, name: "Thankyou", component: Thankyou },
  { path: "/order-list", exact: true, name: "OrderList", component: Order },
  { path: "/info", exact: true, name: "Profile", component: Profile },
  { path: "/change-password", exact: true, name: "ChangePassword", component: ChangePassword },
  { path: "/search", exact: true, name: "SearchResultsPage", component: SearchResultsPage },
];

export default PublicRouteList;
