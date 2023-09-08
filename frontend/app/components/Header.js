import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../StateContext";
import Navbar from "./NavBar";

function Header(props) {
  const appState = useContext(StateContext);

  return (
    <header className="header-bar bg-kalypso-red">
      <div className="d-flex flex-column flex-md-row align-items-center p-3">
        {appState.loggedIn ? <Navbar /> : <></>}
        <h4 className="my-0 ml-4 font-weight-normal">
          <Link to="/" className="text-white font-secondary">
            {/*Kalypso Logbook*/}
            <img
              className="kalypso-logo"
              src="/public/img/RA-Kalypso-Logo-Light-Small.png"
            />
          </Link>
        </h4>
        {appState.loggedIn ? <HeaderLoggedIn /> : <></>}
      </div>
    </header>
  );
}

export default Header;
