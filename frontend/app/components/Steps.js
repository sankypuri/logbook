import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import { useParams } from "react-router-dom";
//import { FormGrid } from "@formio/react";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfileSteps from "./ProfileSteps";
import { Link } from "react-router-dom";

function Steps() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { stepCount: "", followerCount: "", followingCount: "" },
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
        setProfileData(response.data);
      } catch (e) {
        console.log("There was a problem at Steps.js " + e);
      }
    }
    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  return (
    <Page title="Steps Screen" wide={true}>
      <p>Task Builder / Steps</p>
      <div className="row justify-content-between">
        <div className="col-4">
          <h4>Steps ({profileData.counts.stepCount})</h4>
        </div>
        <div className="col- ml-auto">
          <Link className="btn btn-sm btn-success mr-2" to="/create-step">
            {" "}
            Create New Step
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

      <ProfileSteps />
    </Page>
  );
}

export default Steps;
