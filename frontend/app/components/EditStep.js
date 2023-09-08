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

function EditStep(props) {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [schema, setSchema] = useState();

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    tag: {
      value: "",
      hasErrors: false,
      message: "",
    },
    schema: { value: {}, hasErrors: false, message: "" },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.tag.value = action.value.tag;
        draft.schema.value = action.value.schema;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case "tagChange":
        draft.tag.hasErrors = false;
        draft.tag.value = action.value;
        return;
      /*case "schemaChange":
        draft.schema.hasErrors = false;
        draft.schema.value = action.value;
        return;*/
      case "submitRequest":
        if (
          !draft.title.hasErrors &&
          !draft.body.hasErrors &&
          !draft.tag.hasErrors
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
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide description content.";
        }
        return;
      case "tagRules":
        if (!action.value.trim()) {
          draft.tag.hasErrors = true;
          draft.tag.message = "You must provide a Tag.";
        }
        return;
      /*case "schemaRules":
        if (!action.value.trim()) {
          draft.tag.hasErrors = true;
          draft.tag.message = "You must provide a schema.";
        }
        return;*/
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "tagRules", value: state.tag.value });
    /*dispatch({ type: "schemaRules", value: state.schema.value });*/
    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchStep() {
      try {
        const response = await Axios.get(`/step/${state.id}`, {
          cancelToken: ourRequest.token,
        });

        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to edit that step.",
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
    fetchStep();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();
      async function fetchStep() {
        try {
          const response = await Axios.post(
            `/step/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              tag: state.tag.value,
              schema: schema,
              token: appState.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Step was updated." });
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchStep();
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
  const comp = state.schema.value;
  const newVariable = {
    ...comp,
    components: comp.components.map((component) => ({
      ...component,
      id: component.id,
    })),
  };
  // newVariable.components[0].id = "dd";
  //console.log(comp);
  //console.log(newVariable.components[0].id);

  return (
    <Page title="Edit Step" wide={true}>
      <Link className="small font-weight-bold" to={`/step/${state.id}`}>
        &laquo; Back to step permalink
      </Link>

      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <label htmlFor="step-title" className="text-muted mb-1">
                <small>Title</small>
              </label>
              <input
                onBlur={(e) =>
                  dispatch({ type: "titleRules", value: e.target.value })
                }
                onChange={(e) =>
                  dispatch({ type: "titleChange", value: e.target.value })
                }
                value={state.title.value}
                autoFocus
                name="title"
                id="step-title"
                className="body-content tall-textarea form-control "
                type="text"
                placeholder=""
                autoComplete="off"
              />
              {state.title.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.title.message}
                </div>
              )}
            </div>

            <div className="col">
              <label htmlFor="step-body" className="text-muted mb-1 d-block">
                <small>Description</small>
              </label>
              <input
                onBlur={(e) =>
                  dispatch({ type: "bodyRules", value: e.target.value })
                }
                onChange={(e) =>
                  dispatch({ type: "bodyChange", value: e.target.value })
                }
                name="body"
                id="step-body"
                className="body-content tall-textarea form-control"
                type="text"
                value={state.body.value}
              />
              {state.body.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.body.message}
                </div>
              )}
            </div>
            <div className="col">
              <label htmlFor="step-tag" className="text-muted mb-1 d-block">
                <small>Tag</small>
              </label>
              <input
                onBlur={(e) =>
                  dispatch({ type: "tagRules", value: e.target.value })
                }
                onChange={(e) =>
                  dispatch({ type: "tagChange", value: e.target.value })
                }
                name="tag"
                id="step-tag"
                className="body-content tall-textarea form-control"
                type="text"
                value={state.tag.value}
              />
              {state.tag.hasErrors && (
                <div className="alert alert-danger small liveValidateMessage">
                  {state.tag.message}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-group">
          <FormBuilder
            form={schema || newVariable}
            //onUpdateComponent={(component) => console.log(component)}
            onChange={(schema) => setSchema(schema)}
          />
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
}

export default EditStep;
