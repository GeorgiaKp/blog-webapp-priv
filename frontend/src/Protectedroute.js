import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "./context/Context";

function ProtectedRoute(Component, flag) {
  return function ProtectedRouteComponent() {
    const { user } = useContext(Context);
    if (user && (flag === "reg" || flag === "log")) return <Redirect to="/" />;
    if (!user && (flag === "set" || flag === "write")) return <Redirect to="/register" />;
    return <Component />;
  }
}

export default ProtectedRoute;
