import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useLinkClickHandler, useParams } from "react-router-dom";
//import { FormGrid } from "@formio/react";
import Axios from "axios";
import StateContext from "../StateContext";
import WorkFlowList from "./WorkFlowList";
import { Link } from "react-router-dom";

function ViewAllWorkFlows() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [workflowData, setWorkflowData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { workflowCount: "", followerCount: "", followingCount: "" },
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          { token: appState.user.token },
          { cancelToken: ourRequest.token }
        );
        setWorkflowData(response.data);
      } catch (e) {
        console.log("There was a problem at Workflow.js " + e);
      }
      console.log(workflowData);
    }
    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  return (
    <div className="container" title="WorkFlow Screen">
      <p>Task Builder / WorkFlow</p>
      <div
        className="row justify-content-between"
        style={{ marginLeft: 20, marginRight: 20 }}
      >
        <div className="col-4">
          <h4 className="underlinetext">
            WorkFlows ({workflowData.counts.workflowCount})
          </h4>
        </div>
        <div className="col- ml-auto">
          <Link className="button" to="/create-workflow">
            Create New WorkFlow
          </Link>
        </div>
      </div>

      {/*<div className="profile-nav nav nav-tabs pt-2 mb-4">
      <a href="#" className="active nav-item nav-link">
        My Steps: {profileData.counts.postCount}
      </a>
      {/*<a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
  </a>
      </div>*/}

      <WorkFlowList />
    </div>
  );
}

export default ViewAllWorkFlows;
