import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./context/Context";

const { user } = useContext(Context);
export const ProtectedRoute = ({ component: Register, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!user) {
        return <Register {...props} />;
      }
      return (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      );
    }}
  />
);
