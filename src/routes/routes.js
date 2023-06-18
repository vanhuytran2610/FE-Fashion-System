import { CreateCategory } from "../components/admin/Category/CreateCategory";
import { CreateProducts } from "../components/admin/Product/CreateProducts";
import Dashboard from "../components/admin/Dashboard";
import Profile from "../components/admin/Profile";
import { UpdateCategory } from "../components/admin/Category/UpdateCategory";
import { UpdateProduct } from "../components/admin/Product/UpdateProduct";
import { ViewCategory } from "../components/admin/Category/ViewCategory";
import { ViewProducts } from "../components/admin/Product/ViewProducts";

const routes = [
    {path: '/admin', exact: true, name: 'Admin'},
    {path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard},
    {path: '/admin/profile', exact: true, name: 'Profile', component: Profile},
    {path: '/admin/view-category', exact: true, name: 'View-Category', component: ViewCategory},
    {path: '/admin/add-category', exact: true, name: 'Category', component: CreateCategory},
    {path: '/admin/edit-category/:id', exact: true, name: 'View-Detail-Category', component: UpdateCategory},
    {path: '/admin/add-product', exact: true, name: 'Add-Products', component: CreateProducts},
    {path: '/admin/view-product', exact: true, name: 'View-Products', component: ViewProducts},
    {path: '/admin/edit-product/:id', exact: true, name: 'Edit-Products', component: UpdateProduct},
]

export default routes;