import React, { useContext, Component } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "./context/Context";

function ProtectedRoute(ComposedComponent) {
  const { user } = useContext(Context);
  class Authentication extends Component {
    redirectUser() {
      if (user && (this.flag === "reg" || this.flag === "log")) {
        this.props.history.push('/');
      }
    }
    redirectVisitor() {
      if (!user && (this.flag === "set" || this.flag === "write")) {
        this.props.history.push('/');
      }
    }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }
}

export default ProtectedRoute;
