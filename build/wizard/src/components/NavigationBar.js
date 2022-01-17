import React from "react";

const NavigationBar = ({ navBar, setNavBar }) => {

    const [navBarIsActive, setNavBarIsActive] = React.useState(false);

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a
                    onClick={() => {
                        setNavBarIsActive(!navBarIsActive);
                    }}
                    role="button"
                    className={`navbar-burger burger ${navBarIsActive ? "is-active" : ""}`}
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navMenu"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div id="navMenu" className={`navbar-menu ${navBarIsActive ? "is-active" : ""}`}>
                <div className="navbar-start">
                    <a className={`navbar-item ${navBar === "Welcome" ? "is-active has-text-weight-bold" : ""}`} onClick={() => { setNavBar("Welcome") }} >Welcome</a>
                    <a className={`navbar-item ${navBar === "Setup" ? "is-active has-text-weight-bold" : ""}`} onClick={() => { setNavBar("Setup") }} >Setup</a>
                    <a className={`navbar-item ${navBar === "Status" ? "is-active has-text-weight-bold" : ""}`} onClick={() => { setNavBar("Status") }} >Status</a>
                </div>

                <div className="navbar-end">
                    <a className={`navbar-item ${navBar === "Admin" ? "is-active has-text-weight-bold" : ""}`} onClick={() => { setNavBar("Admin") }} >Admin</a>
                </div>
            </div>

        </nav>
    )
};

export default NavigationBar