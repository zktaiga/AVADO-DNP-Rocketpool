import React from 'react';
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import AutobahnContext from "./components/AutobahnContext";
import StoreContext from "./components/StoreContext";
import "./css/style.sass";
import "./App.css";

function App() {
    return (
        <div className="App">
            <AutobahnContext>
                <StoreContext>
                    <BrowserRouter>
                        <Switch>
                            <Route
                                path="/"
                                exact={true}
                                render={props => (<Dashboard {...props} />)}
                            />
                        </Switch>
                    </BrowserRouter>
                </StoreContext>
            </AutobahnContext>
        </div>
    );
}

export default App;
