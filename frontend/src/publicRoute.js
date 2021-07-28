import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "./context/Context";

function publicRoute(Component) {
  return function PublicRouteComponent() {
    const { user } = useContext(Context);
    if (user) return <Redirect to="/" />;
    return <Component />;
  }
}

export default publicRoute;
