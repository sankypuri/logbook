import React from "react";
import { useSelector } from "react-redux";
//import LazyLoad from "react-lazyload"; // use lazyload for components and image
import CreateLogbook from "../components/CreateLogbook"; // load component
import ApproverDetails from "../../components/form-approver"; // load component
import FormUserCompleted from "../../components/form-completed"; // load component
import "./styles.scss";

const Signup = () => {
  const pageStage = useSelector((state) => state.FormStage);
  //const stateAll = useSelector(state => state)
  //console.log(`output: ${JSON.stringify(stateAll, null, 2)}`) // output results to console.log

  return (
    <main>
      <div className="form-wrapper">
        <h1 data-testid="Signup-Title" className="text-center">
          WorkFlow
        </h1>

        <section>
          {/* When adding/removing components, update the progress bar below */}

          <div className="progressbar">
            <div
              className={
                pageStage === 1
                  ? "progress-step progress-step-active"
                  : "progress-step"
              }
              data-title="Basic Information"
            ></div>
            <div
              className={
                pageStage === 2
                  ? "progress-step progress-step-active"
                  : "progress-step"
              }
              data-title="Approver"
            ></div>
            <div
              className={
                pageStage === 3
                  ? "progress-step progress-step-active"
                  : "progress-step"
              }
              data-title="Confirmation"
            ></div>
          </div>

          <div className="page-wrapper">
            {pageStage === 1 && (
              // Signup Page
              //<LazyLoad once>
              <div className="wrap">
                <CreateLogbook
                  pageTitle={"WorkFlow Details"} // form page stage title
                  submitButtonText={"Next"} // submit next button display text
                  previousButton={false} // show/hide previous button
                />
              </div>
              //</LazyLoad>
            )}

            {pageStage === 2 && (
              // Privacy Page
              // <LazyLoad once>
              <div className="wrap">
                <ApproverDetails
                  pageTitle={"Select Aprover:"} // form page stage title
                  submitButtonText={"Next"} // submit next button display text
                  previousButton={true} // show/hide previous button
                />
              </div>
              //</LazyLoad>
            )}

            {pageStage === 3 && (
              // Completion Page
              // <LazyLoad once>
              <div className="wrap">
                <FormUserCompleted
                  pageTitle={"Success!"} // form page stage title
                  successMessage={"WorkFlow creation sucessfully done"} // page success message
                />
              </div>
              //</LazyLoad>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
