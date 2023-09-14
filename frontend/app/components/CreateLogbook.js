import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { FormEdit } from "@formio/react";
import { FormBuilder } from "@formio/react";
import bootstrap3 from "@formio/bootstrap3";
import { Formio } from "formiojs";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

//import "../main.css";
//import "../assets/css/workflow.css";

function CreateLogbook(props) {
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();
  const [workflowNamelist, setWorkFlowName] = useState([]);
  const [setStepNamelist, setStepName] = useState([]);
  //dropdown change catch
  const [logbook, setLogbook] = useState();
  const [description, setDescription] = useState();
  const [asociatedWf, setAsociatedWorkflow] = useState();
  const [asociatedStp, setAsociatedSteps] = useState();

  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleDropdown1Change = (e) => {
    setAsociatedWorkflow(e.target.value);
  };

  const handleDropdown2Change = (e) => {
    setAsociatedSteps(e.target.value);
  };

  //Formio.use(bootstrap3);
  //Formio.Templates.framework = "bootstrap3";
  const options = [
    {
      label: "Step1",
      value: "Step1",
    },
    {
      label: "Step2",
      value: "Step2",
    },
    {
      label: "Step3",
      value: "Step3",
    },
    {
      label: "Step4",
      value: "Step4",
    },
  ];
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-logbook", {
        token: appState.user.token,
        logbook,
        description,
        asociatedWf,
        asociatedStp,
      });
      // Redirect to new post url
      appDispatch({
        type: "flashMessage",
        value: "Congrats, you created a new logbook.",
      });
      // navigate(`/profile/${username}/task-builder/logbook`);
      console.log("New logbook was created.");
    } catch (e) {
      console.log("There was a problem in CreateLogbook.js.");
    }
    //alert("Clicked");
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    const ourRequest1 = Axios.CancelToken.source();
    fetchWorkFlow(ourRequest);
    fetchSteps(ourRequest1);
    return () => {
      ourRequest.cancel();
      ourRequest1.cancel();
    };
  }, []);
  async function fetchWorkFlow(ourRequest) {
    try {
      const response = await Axios.get(`/profile/test/workflow`, {
        cancelToken: ourRequest.token,
      });
      setWorkFlowName(response.data);
      setIsLoading(false);
      //workflowlist = response.data;
      console.log(response.data);
    } catch (e) {
      console.log("There was a problem : " + e);
    }
  }
  async function fetchSteps(ourRequest1) {
    try {
      const response = await Axios.post(
        `/profile/test/steps`,
        { token: appState.user.token },
        { cancelToken: ourRequest1.token }
      );
      setStepName(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("There was a problem at Steps.js " + e);
    }
  }
  return (
    <div className="container" title="WorkFlow Screen">
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ border: 15 }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create Logbook
                  </h2>

                  <form>
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example1cg">
                        logbook Name
                      </label>
                      <input
                        onChange={(e) => setLogbook(e.target.value)}
                        autoFocus
                        name="workflow"
                        id="wf-name"
                        className="body-content tall-textarea form-control"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example3cg">
                        Description
                      </label>
                      <input
                        onChange={(e) => setDescription(e.target.value)}
                        name="description"
                        id="wf-description"
                        className="body-content tall-textarea form-control"
                        type="text"
                      ></input>
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example4cdg">
                        Associated Workflow
                      </label>{" "}
                      <select
                        id="Aprover1"
                        onChange={handleDropdown1Change}
                        selectedValue={props.selectedValue}
                      >
                        {workflowNamelist.map((option) => (
                          <option value={option.workflow}>
                            {option.workflow}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example4cdg">
                        Associated Task Creation Step
                      </label>{" "}
                      <select
                        id="Aprover2"
                        onChange={handleDropdown2Change}
                        selectedValue={props.selectedValue}
                      >
                        {options.map((option) => (
                          <option value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        onClick={handleSubmit}
                      >
                        Save New Logbook
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLogbook;
