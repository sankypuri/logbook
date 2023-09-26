import React, { useEffect, useState, useContext } from "react";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";

function DigitalSignature() {
  //const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [buttonText, setbuttonText] = useState("eSign");
  const [buttonDisable, setbuttonDisable] = useState(false);
  const [loginError, setLoginError] = useState("");

  //setUsername(appState.user.username);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await Axios.post("/login", { username, password });

      if (response.data && appState.user.username == response.data.username) {
        //appDispatch({ type: "login", data: response.data });
        $("#loginModal").modal("hide");
        setbuttonText(response.data.username);
        setbuttonDisable(true);
        console.log("Login Sucessful");
        setLoginError("Login Successful");
      } else {
        console.log("Incorrect username / password.");
        setLoginError("Incorrect username / password.");
      }
    } catch (e) {
      console.log("There was a problem. " + e);
    }
  }
  return (
    <>
      {buttonDisable ? (
        <>
          <div className="font-italic">Digitally signed by:</div>
          <h4 className="font-weight-bold">{buttonText}</h4>
        </>
      ) : (
        <button
          type="button"
          data-toggle="modal"
          data-target="#loginModal"
          //disabled={buttonDisable}
          className="text-wrap text-primary"
          title="Click to eSign"
        >
          {buttonText}
        </button>
      )}

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="loginModalLabel">
                Please Login to Authenticate the Signature
              </h6>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="ml-auto">
                <div className="align-items-center form-group">
                  <div className="mb-4">
                    <input
                      //onChange={(e) => setUsername(e.target.value)}
                      value={appState.user.username}
                      name="username"
                      className="form-control form-control-md input-light w-50"
                      type="text"
                      placeholder="Username"
                      autoComplete="off"
                      disabled="true"
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      onChange={(e) => {
                        setUsername(appState.user.username),
                          setPassword(e.target.value);
                      }}
                      name="password"
                      className="form-control form-control-md input-light w-50"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="mr-auto">
                    <p className="text-danger">{loginError}</p>
                    <button
                      className="btn btn-success btn-md kalypso-btn-primary"
                      //disabled={
                      //  appState.user.username == username ? false : true
                      //}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DigitalSignature;
