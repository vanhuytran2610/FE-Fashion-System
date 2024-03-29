import "../../assets/admin/css/styles.css";
import "../../assets/admin/js/scripts";

import { Redirect, Route, Switch } from "react-router-dom";

// import Footer from "./Footer";
import Navbar from "./Navbar";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import routes from "../../routes/routes";

const MasterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className={`sb-nav-fixed ${sidebarOpen ? "sb-sidenav-toggled" : ""}`}>
      <Navbar handleSidebarToggle={handleSidebarToggle} />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar sidebarOpen={sidebarOpen} />
        </div>
        <div id="layoutSidenav_content">
          <main>
            <Switch>
              {routes.map((route, idx) => {
                return (
                  route.component && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => <route.component {...props} />}
                    />
                  )
                );
              })}
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
