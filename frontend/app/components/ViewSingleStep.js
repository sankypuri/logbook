import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { Form } from "@formio/react";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function ViewSingleStep(props) {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchStep() {
      try {
        const response = await Axios.get(`/step/${id}`, {
          cancelToken: ourRequest.token,
        });
        setStep(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log("There was a problem or the request was cancelled. " + e);
      }
    }
    fetchStep();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isLoading && !step) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(step.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == step.author.username;
    }
    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm(
      "Do you really want to delete this step?"
    );
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/step/${id}`, {
          data: { token: appState.user.token },
        });
        if (response.data == "Success") {
          // 1. display a flash message
          appDispatch({
            type: "flashMessage",
            value: "Step was successfully deleted.",
          });

          // 2. redirect back to the current user's profile
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log("There was a problem.");
      }
    }
  }

  return (
    <div className="container" title="WorkFlow Screen">
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-10 col-lg-9 col-xl-8">
              <div className="card" style={{ border: 15 }}>
                <div class="container"></div>

                <div class="container" style={{ background: "burlywood" }}>
                  <div class="row">
                    <div class="col-sm"></div>
                    <div class="col-sm">
                      {" "}
                      <h2>{step.title}</h2>
                    </div>
                    <div class="col-sm" style={{ textAlign: "right" }}>
                      <p className="text-muted small mb-4">
                        <Link to={`/profile/${step.author.username}`}>
                          <img
                            className="avatar-tiny"
                            src={step.author.avatar}
                          />
                        </Link>
                        Created by{" "}
                        <Link to={`/profile/${step.author.username}`}>
                          {step.author.username}
                        </Link>{" "}
                        on {dateFormatted}
                        {""}
                        {isOwner() && (
                          <span className="pt-2">
                            <Link
                              to={`/step/${step._id}/edit`}
                              data-tip="Edit"
                              data-for="edit"
                              className="text-primary mr-2"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <ReactTooltip
                              id="edit"
                              className="custom-tooltip"
                            />{" "}
                            <a
                              onClick={deleteHandler}
                              data-tip="Delete"
                              data-for="delete"
                              className="delete-post-button text-danger"
                            >
                              <i className="fas fa-trash"></i>
                            </a>
                            <ReactTooltip
                              id="delete"
                              className="custom-tooltip"
                            />
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-body p-5">
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-8">
                      <div className="body-content">
                        {/* <ReactMarkdown
                          children={step.body}
                          allowedElements={[
                            "p",
                            "br",
                            "strong",
                            "em",
                            "h1",
                            "h2",
                            "h3",
                            "h4",
                            "h5",
                            "h6",
                            "ul",
                            "ol",
                            "li",
                          ]}
                        /> */}
                      </div>
                      <div>
                        <Form
                          form={{
                            components: [step.schema],
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSingleStep;
