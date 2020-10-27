import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import MainScreen from "./screens/main";
import EditScreen from './screens/Edit'

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={MainScreen} exact/>
        {/* <Route path="/Edit/:id" component={EditScreen}/> */}
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
