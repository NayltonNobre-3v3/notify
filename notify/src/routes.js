import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import MainScreen from "./screens/main";


function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={MainScreen} exact/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
