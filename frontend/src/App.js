import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import TopBar from "./components/topbar/TopBar";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

import { Context } from "./context/Context";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const { user } = useContext(Context);
  return (
    <Router>
      <TopBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <ProtectedRoute path="/register" component={Register} user={user} flag={"reg"} />
        <ProtectedRoute path="/login" component={Login} user={user} flag={"log"}/>
        <ProtectedRoute path="/write" component={Write} user={user} flag={"write"}/>
        <ProtectedRoute path="/settings" component={Settings} user={user} flag={"set"}/>
        {/*<Route path="/register">{user ? <Home /> : <Register />}</Route>*/}
        {/*<Route path="/login">{user ? <Home /> : <Login />}</Route>*/}
        {/*<Route path="/write">{user ? <Write /> : <Register />}</Route>
        <Route path="/settings">{user ? <Settings /> : <Register />}</Route>*/}
        <Route path="/post/:postId">
          <Single />
        </Route>
      </Switch>
      {/* <Home /> */}
      {/* <Single /> */}
      {/* <Write /> */}
      {/* <Settings /> */}
      {/* <Login /> */}
      {/* <Register /> */}
    </Router>
  );
}

export default App;
