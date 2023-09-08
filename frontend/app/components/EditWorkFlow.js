import React, { useEffect, useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Form } from "@formio/react";
import { FormBuilder } from "@formio/react";
import { FormEdit } from "@formio/react";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditWorkFlow(props) {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [schema, setSchema] = useState();
  const [approver1, setApprover1] = useState();
  const [approver2, setApprover2] = useState();

  const originalState = {
    workflow: {
      value: "",
      hasErrors: false,
      message: "",
    },
    description: {
      value: "",
      hasErrors: false,
      message: "",
    },
    category: {
      value: "",
      hasErrors: false,
      message: "",
    },
    approver1: {
      value: "",
      hasErrors: false,
      message: "",
    },
    approver2: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };
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
  const handleDropdown1Change = (e) => {
    setApprover1(e.target.value);
  };

  const handleDropdown2Change = (e) => {
    setApprover2(e.target.value);
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.workflow.value = action.value.workflow;
        draft.description.value = action.value.description;
        draft.category.value = action.value.category;
        draft.approver1.value = action.value.approver1;
        draft.approver2.value = action.value.approver2;
        draft.isFetching = false;
        return;
      case "workflowChange":
        draft.workflow.hasErrors = false;
        draft.workflow.value = action.value;
        return;
      case "descriptionChange":
        draft.description.hasErrors = false;
        draft.description.value = action.description;
        return;
      case "categoryChange":
        draft.category.hasErrors = false;
        draft.category.value = action.category;
        return;
      case "approver1Change":
        draft.approver1.hasErrors = false;
        draft.approver1.value = action.approver1;
        return;
      case "approver2Change":
        draft.approver2.hasErrors = false;
        draft.approver2.value = action.approver2;
        return;
      case "submitRequest":
        if (
          !draft.workflow.hasErrors &&
          !draft.description.hasErrors &&
          !draft.category.hasErrors &&
          !draft.approver1.hasErrors &&
          !draft.approver2.hasErrors
        ) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "workflowRules":
        if (!action.value.trim()) {
          draft.workflow.hasErrors = true;
          draft.workflow.message = "You must provide a workflow name.";
        }
        return;
      case "descriptionRules":
        if (!action.value.trim()) {
          draft.description.hasErrors = true;
          draft.description.message = "You must provide description content.";
        }
        return;
      case "categoryRules":
        if (!action.value.trim()) {
          draft.category.hasErrors = true;
          draft.category.message = "You must provide a category.";
        }
        return;
      case "approver1Rules":
        if (!action.value.trim()) {
          draft.approver1.hasErrors = true;
          draft.approver1.message = "You must provide a approver1.";
        }
        return;
      case "approver2Rules":
        if (!action.value.trim()) {
          draft.approver2.hasErrors = true;
          draft.approver2.message = "You must provide a approver2.";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "workflowChange", value: state.workflow.value });
    dispatch({ type: "descriptionChange", value: state.description.value });
    dispatch({ type: "categoryChange", value: state.category.value });
    dispatch({ type: "approver1Change", value: state.approver1.value });
    dispatch({ type: "approver2Change", value: state.approver2.value });
    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchWorkflow() {
      try {
        const response = await Axios.get(`/workflow/${state.id}`, {
          cancelToken: ourRequest.token,
        });

        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to edit that workflow.",
            });
            // redirect to homepage
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
      }
    }
    fetchWorkflow();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();
      async function fetchWorkflow() {
        try {
          const response = await Axios.post(
            `/workflow/${state.id}/edit`,
            {
              workflow: state.workflow.value,
              description: state.description.value,
              category: state.category.value,
              approver1: state.approver1.value,
              approver2: state.approver2.value,
              token: appState.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Workflow was updated." });
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchWorkflow();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  // assigning the value of our stored schema to a newVariable to perform id change
  // const comp = state.workflow.value;
  // const newVariable = {
  //   ...comp,
  //   components: comp.components.map((component) => ({
  //     ...component,
  //     id: component.id,
  //   })),
  // };
  // newVariable.components[0].id = "dd";
  //console.log(comp);
  //console.log(newVariable.components[0].id);

  return (
    <Page title="Edit Step" wide={true}>
      <Link
        className="small font-weight-bold"
        to={`/profile/username/task-builder/workflow`}
      >
        &laquo; Back to workflow permalink
      </Link>

      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <div className="col">
            <div className="row">
              <label htmlFor="step-title" className="text-muted mb-1">
                <small>WorkFlow</small>
              </label>
              <input
                onBlur={(e) =>
                  dispatch({ type: "workflowRules", value: e.target.value })
                }
                onChange={(e) =>
                  dispatch({ type: "workflowChange", value: e.target.value })
                }
                value={state.workflow.value}
                autoFocus
                name="workflow"
                id="wf-name"
                className="body-content tall-textarea form-control "
                type="text"
                placeholder=""
                autoComplete="off"
              />
              {state.workflow.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.workflow.message}
                </div>
              )}
            </div>

            <div className="row">
              <label htmlFor="step-body" className="text-muted mb-1 d-block">
                <small>Description</small>
              </label>
              <input
                onBlur={(e) =>
                  dispatch({ type: "descriptionRules", value: e.target.value })
                }
                onChange={(e) =>
                  dispatch({ type: "descriptionChange", value: e.target.value })
                }
                name="description"
                id="wf-description"
                className="body-content tall-textarea form-control"
                type="text"
                value={state.description.value}
              />
              {state.description.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.body.message}
                </div>
              )}
            </div>
            <div className="row">
              <label htmlFor="step-tag" className="text-muted mb-1 d-block">
                <small>Category</small>
              </label>
              <input
                onBlur={(e) =>
                  dispatch({ type: "categoryRules", value: e.target.value })
                }
                onChange={(e) =>
                  dispatch({ type: "categoryChange", value: e.target.value })
                }
                name="category"
                id="wf-category"
                className="body-content tall-textarea form-control"
                type="text"
                value={state.category.value}
              />
              {state.category.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.category.message}
                </div>
              )}
            </div>
            <div className="text-muted mb-3"></div>
            <div className="row">
              <label htmlFor="post-tag" className="text-muted mb-1">
                <small>Approver1</small>
              </label>
              <select
                id="Aprover1"
                onChange={handleDropdown1Change}
                value={state.approver1.value}
              >
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
              <label htmlFor="post-tag" className="text-muted mb-1">
                <small>Approver2</small>
              </label>
              <select
                id="Aprover2"
                onChange={handleDropdown2Change}
                value={state.approver2.value}
              >
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
}

export default EditWorkFlow;
