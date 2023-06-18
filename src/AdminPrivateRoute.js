import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";

import MasterLayout from "./layouts/admin/MasterLayout";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function AdminPrivateRoute({ ...rest }) {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/checkingAuthenticated`).then((response) => {
      if (response.status === 200) {
        setAuthenticated(true);
      }
      setLoading(false);
    });

    return () => {
      setAuthenticated(false);
    };
  }, []);

  axios.interceptors.response.use(
    undefined,
    function axiosRetryInterceptor(error) {
      if (error.response.status === "Unauthorized") {
        swal("Unauthorized", error.response.data.message, "warning");
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 403) {
        swal("Forbidden", error.response.data.message, "warning");
        // history.push('/403');
      } else if (error.response.status === 404) {
        history.push("/404");
      }
      return Promise.reject(error);
    }
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center mt-2">
        <h2>Loading</h2>
        <span
          className="spinner-border ml-auto"
          role="status"
          aria-hidden="true"
        ></span>
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={({ props, location }) =>
        authenticated ? (
          <MasterLayout {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}

export default AdminPrivateRoute;
