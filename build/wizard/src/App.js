import React from 'react';
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
                        <Routes>
                            <Route
                                path="/"
                                exact={true}
                                element={<Dashboard/>}
                            />
                        </Routes>
                    </BrowserRouter>
                </StoreContext>
            </AutobahnContext>
        </div>
    );
}

export default App;
