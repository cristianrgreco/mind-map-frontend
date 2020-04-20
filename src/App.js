import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

import {Map} from "./Map";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Redirect to={`/${uuidv4()}`}/>
                </Route>
                <Route path="/:id">
                    <Map/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
