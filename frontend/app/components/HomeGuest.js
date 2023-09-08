import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function HomeGuest(props) {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", { username, password });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
      } else {
        console.log("Incorrect username / password.");
      }
    } catch (e) {
      console.log("There was a problem. " + e);
    }
  }

  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-5 py-3 py-md-5 border-left-0 border-top-0 border-bottom-0 border border-dark">
          <h1 className="display-3 ">eLogbook</h1>
          <p className="lead text-muted">Digital Logbook platform</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <div>
            <Tabs>
              <Tab label="User Login">
                <div>
                  <form onSubmit={handleSubmit} className="ml-auto">
                    <div className="align-items-center form-group">
                      <div className="mb-4">
                        <input
                          onChange={(e) => setUsername(e.target.value)}
                          name="username"
                          className="form-control form-control-md input-light w-50"
                          type="text"
                          placeholder="Username"
                          autoComplete="off"
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          name="password"
                          className="form-control form-control-md input-light w-50"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                      <div className="mr-auto">
                        <button className="btn btn-success btn-md kalypso-btn-primary">
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Tab>
              <Tab label="Admin Login">
                <div>
                  <form onSubmit={handleSubmit} className="ml-auto">
                    <div className="align-items-center">
                      <div className="mb-4">
                        <input
                          onChange={(e) => setUsername(e.target.value)}
                          name="adminusername"
                          className="form-control form-control-md input-light w-50"
                          type="text"
                          placeholder="Admin Username"
                          autoComplete="off"
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          name="adminpassword"
                          className="form-control form-control-md input-light w-50"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                      <div className="mr-auto">
                        <button className="btn btn-success btn-md kalypso-btn-admin">
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </Page>
  );
}

class Tabs extends React.Component {
  state = {
    activeTab: this.props.children[0].props.label,
  };
  changeTab = (tab) => {
    this.setState({ activeTab: tab });
  };
  render() {
    let content;
    let buttons = [];
    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          buttons.push(child.props.label);
          if (child.props.label === this.state.activeTab)
            content = child.props.children;
        })}

        <TabButtons
          activeTab={this.state.activeTab}
          buttons={buttons}
          changeTab={this.changeTab}
        />
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}

const TabButtons = ({ buttons, changeTab, activeTab }) => {
  return (
    <div className="tab-buttons">
      {buttons.map((button) => {
        return (
          <button
            className={button === activeTab ? "active" : ""}
            onClick={() => changeTab(button)}
          >
            {button}
          </button>
        );
      })}
    </div>
  );
};

const Tab = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default HomeGuest;
