import "../../assets/admin/css/styles.css";
import "../../assets/admin/js/scripts";

import { Route, Switch } from "react-router-dom";

import Navbar from "../../layouts/frontend/Navbar";
import PublicRouteList from "../../routes/PublicRouteList";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    axios.get(`/api/cart`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setCart(res.data.data);
          console.log(res.data.data);
          
        } else if (res.data.status === 401) {
          history.push("/");
          
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [history]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className={`sb-nav-fixed ${sidebarOpen ? "" : "sb-sidenav-toggled"}`}>
      <Navbar handleSidebarToggle={handleSidebarToggle} lengthCart={cart.length} />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar />
        </div>
        <div id="layoutSidenav_content">
          <main>
            <Switch>
              {PublicRouteList.map((routeData, idx) => {
                return (
                  routeData.component && (
                    <Route
                      key={idx}
                      path={routeData.path}
                      exact={routeData.exact}
                      name={routeData.name}
                      render={(props) => <routeData.component {...props} />}
                    />
                  )
                );
              })}
            </Switch>
          </main>
        </div>
      </div>
    </div>
  );
};
