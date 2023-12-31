import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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

function CreateWorkFlow(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [tag, setTag] = useState();

  const [workflow, setWorkFlow] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [approver1, setApprover1] = useState();
  const [approver2, setApprover2] = useState();
  //const username = useState();

  const [schema, setSchema] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleDropdown1Change = (e) => {
    setApprover1(e.target.value);
  };

  const handleDropdown2Change = (e) => {
    setApprover2(e.target.value);
  };

  //Formio.use(bootstrap3);
  //Formio.Templates.framework = "bootstrap3";
  const options = [
    {
      label: "CXO",
      value: "cxo",
    },
    {
      label: "FunctionHead",
      value: "functionhead",
    },
    {
      label: "SiteHead",
      value: "sitehead",
    },
    {
      label: "UnitHead",
      value: "unithead",
    },
  ];
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-workflow", {
        token: appState.user.token,
        workflow,
        description,
        category,
        approver1,
        approver2,
      });
      // Redirect to new post url
      appDispatch({
        type: "flashMessage",
        value: "Congrats, you created a new post.",
      });
      navigate(`/profile/${username}/task-builder/workflow`);
      console.log("New post was created.");
    } catch (e) {
      console.log("There was a problem.");
    }
    //alert("Clicked");
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
                    Create workflow
                  </h2>

                  <form>
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example1cg">
                        Workflow Name
                      </label>
                      <input
                        onChange={(e) => setWorkFlow(e.target.value)}
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
                      <label className="form-label" for="form3Example4cg">
                        Category
                      </label>
                      <input
                        onChange={(e) => setCategory(e.target.value)}
                        name="category"
                        id="wf-category"
                        className="body-content tall-textarea form-control"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example4cdg">
                        Approver1
                      </label>
                      <select
                        id="Aprover1"
                        onChange={handleDropdown1Change}
                        selectedValue={props.selectedValue}
                      >
                        {options.map((option) => (
                          <option value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form3Example4cdg">
                        Approver1
                      </label>
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
                        Save New Workflow
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

export default CreateWorkFlow;
