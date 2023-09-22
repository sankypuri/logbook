import React, { useEffect, useContext } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import DigitalSignature from "./DigitalSignature";

function Home() {
  const appState = useContext(StateContext);

  return (
    <Page title="Your Feed">
      <h2 className="text-center">
        Hello <strong>{appState.user.username}</strong>, your feed is empty.
      </h2>
      <p className="lead text-muted text-center">
        Your feed displays the latest logbooks created.
      </p>
      <DigitalSignature />
    </Page>
  );
}

export default Home;
