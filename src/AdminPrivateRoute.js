import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";

import MasterLayout from "./layouts/admin/MasterLayout";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

function AdminPrivateRoute({ ...rest }) {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!localStorage.getItem("auth_token")) {
    swal("Warning", "Please log in first", "error");
    history.push("/login");
  }

  useEffect(() => {
    axios
      .get(`/api/checkingAuthenticated`)
      .then((response) => {
        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          handleUnauthorized();
        }
        setLoading(false);
      })
      .catch((error) => {
        handleUnauthorized();
        setLoading(false);
      });

    return () => {
      setAuthenticated(false);
    };
  }, []);

  axios.interceptors.response.use(
    undefined,
    function axiosRetryInterceptor(error) {
      if (error.response.status === 401) {
        handleUnauthorized(error.response.data.message);
      } else if (error.response.status === 403) {
        handleForbidden(error.response.data.message);
      }
      return Promise.reject(error);
    }
  );

  const handleUnauthorized = (
    message = "Unauthorized: Please log in first"
  ) => {
    swal("Unauthorized", message, "warning");
    history.push("/login");
  };

  const handleForbidden = (
    message = "Access Forbidden: Only admin has access"
  ) => {
    swal("Forbidden", message, "warning");
    history.push("/login");
  };

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
