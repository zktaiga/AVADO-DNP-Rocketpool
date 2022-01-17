import React from 'react';
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import "./css/style.sass";

function App() {
    return (
        <div className="App">
            {/* <AutoBahn/> */}
            <BrowserRouter>
                <Switch>
                    <Route
                        path="/"
                        exact={true}
                        render={props => (<Dashboard {...props} />)}
                    />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
