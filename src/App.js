import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import './App.scss';
import RulesList from "./components/Rules-list/Rules-list";
import Rule from './components/Rule/Rule';

function App() {
  return (
      <div className="App">
      <header className="App-header">
          Rules Editor
      </header>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/rules"></Redirect>
          </Route>
          <Route path="/rules" exact component={RulesList}></Route>
          <Route path="/rules/new" exact component={Rule}></Route>
          <Route path="/rules/:id" exact component={Rule}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
