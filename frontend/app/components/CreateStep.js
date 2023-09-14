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

function CreateStep(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [tag, setTag] = useState();
  const [schema, setSchema] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  //Formio.use(bootstrap3);
  //Formio.Templates.framework = "bootstrap3";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-step", {
        title,
        body,
        token: appState.user.token,
        tag,
        schema,
      });
      // Redirect to new step url
      appDispatch({
        type: "flashMessage",
        value: "Congrats, you created a new step.",
      });
      navigate(`/step/${response.data}`);
      console.log("New step was created.");
    } catch (e) {
      console.log("There was a problem. : " + e);
    }
  }

  return (
    <div className="container">
      <div className="mask d-flex align-items-center h-200">
        <div className="container h-200">
          <div className="row d-flex justify-content-center align-items-center h-200">
            <div className="col-12 col-md-10 col-lg-10 col-xl-10">
              <div className="card" style={{ border: 15 }}>
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <div className="row d-flex justify-content-center align-items-center">
                        <h2 className="text-uppercase text-center mb-2">
                          Create steps
                        </h2>
                      </div>

                      <div className="row">
                        <div className="col">
                          <label htmlFor="step-title" className="form-label">
                            Title
                          </label>
                          <input
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                            name="title"
                            id="step-title"
                            className="body-content tall-textarea form-control"
                            type="text"
                            placeholder=""
                            autoComplete="off"
                          />
                        </div>
                        <div className="col">
                          <label htmlFor="step-body" className="form-label">
                            Description
                          </label>
                          <input
                            onChange={(e) => setBody(e.target.value)}
                            name="body"
                            id="step-body"
                            className="body-content tall-textarea form-control"
                            type="text"
                          ></input>
                        </div>
                        <div className="col">
                          <label htmlFor="step-tag" className="form-label">
                            Tag
                          </label>
                          <input
                            onChange={(e) => setTag(e.target.value)}
                            name="tag"
                            id="step-tag"
                            className="body-content tall-textarea form-control"
                            type="text"
                            placeholder=""
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <FormBuilder
                        form={{ display: "form" }}
                        onChange={(schema) => setSchema(schema)}
                        name="schema"
                      />
                      {/*<FormEdit
            form={{ display: "form" }}
            saveText="Create Step"
            onChange={(schema) => setSchema(schema)}
            name="schema"
  />*/}
                    </div>

                    <button className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                      Save New Step
                    </button>
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

export default CreateStep;
