import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ user, component: Component, flag, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          if (flag === "reg" || flag === "log") {
            return <Component />;
          } else {
            return (
              <Redirect
                to={{ pathname: "/register", state: { from: props.location } }}
              />
            );
          }
        }
        if (user) {
          if (flag === "write" || flag === "set") {
            return <Component />;
          } else {
            return (
              <Redirect
                to={{ pathname: "/", state: { from: props.location } }}
              />
            );
          }
        }
      }}
    />
  );
}

export default ProtectedRoute;
