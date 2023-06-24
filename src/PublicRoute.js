import { Layout } from "./layouts/frontend/Layout";
import React from "react";
import {Route} from "react-router-dom";

export function PublicRoute({...rest}) {
    return (
        <Route {...rest} render={ (props) => <Layout {...props} /> } />
    )
}