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
function LogbookList(props) {
  const { username } = useParams();
  const { id } = useParams();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [workflowlist, setWorkFlow] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchWorkFlow() {
      try {
        const response = await Axios.get(`/profile/${username}/logbook`, {
          cancelToken: ourRequest.token,
        });
        setWorkFlow(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem : " + e);
      }
    }
    fetchWorkFlow();
    return () => {
      ourRequest.cancel();
    };
  }, []);
  async function deleteHandler(logbookID) {
    const areYouSure = window.confirm(
      "Do you really want to delete this logbook?"
    );
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/logbook/${logbookID}`, {
          data: { token: appState.user.token },
        });
        if (response.data == "Success") {
          // 1. display a flash message
          appDispatch({
            type: "flashMessage",
            value: "Workflow was successfully deleted.",
          });

          // 2. redirect back to the current user's workflow list
          //navigate(`/profile/username/task-builder/workflow`);
          window.location.reload(false);
        }
      } catch (e) {
        console.log("There was a problem.");
      }
    }
  }
  if (isLoading) return <LoadingDotsIcon />;

  return (
    <table className="table table-striped">
      <thead className="tablehead">
        <tr>
          <th scope="col">Logbook Name</th>
          <th scope="col">Description</th>
          <th scope="col">AssociatedWorkflow</th>
          <th scope="col">AssociatedStep</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>

      <tbody>
        {workflowlist.map((logbook) => {
          return (
            <tr key={logbook._id}>
              <td>{logbook.logbook}</td>
              <td>{logbook.description}</td>
              <td>{logbook.asociatedWorkflow}</td>
              <td>{logbook.asociatedStep}</td>
              <td>
                <Link
                  to={`/logbook/${logbook._id}/edit`}
                  data-tip="Edit"
                  data-for="edit"
                  className="bi bi-pencil"
                ></Link>
                <ReactTooltip id="edit" className="custom-tooltip" />{" "}
              </td>
              <td>
                <a
                  onClick={() => deleteHandler(logbook._id)}
                  data-tip="Delete"
                  data-for="delete"
                  className="delete-post-button text-danger"
                >
                  <i className="fas fa-trash"></i>
                </a>
                <ReactTooltip id="delete" className="custom-tooltip" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default LogbookList;
