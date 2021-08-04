import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "./context/Context";

function protectedRoute(Component) {
  return function ProtectedRouteComponent() {
    const { user } = useContext(Context);
    if (!user) return <Redirect to="/register" />;
    return <Component />;
  }
}

export default protectedRoute;
