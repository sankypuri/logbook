import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreateSites({ onCancel, onCreate }) {
  const [siteName, setSiteName] = useState()
  const [description, setDescription] = useState()
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/create-site", {
        siteName,
        description,
        type: "site",
      })

      appDispatch({
        type: "flashMessage",
        value: response,
      })
      // onCreate(response.data[0])
      navigate("/configuration/sites")
      console.log("New site was created." + JSON.stringify(response.data[0]))
    } catch (e) {
      console.log("There was a problem while creating site: " + e)
    }
  }

  return (
    <div className="form-overlay container">
      <Page title="Create Site" wide={false}>
        <div className="form-heading">
          <h2>Create New Site</h2>
          <a onClick={onCancel} data-tip="cancel" data-for="cancel" className="cancel">
            <i class="bi bi-x-lg"></i>
          </a>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="row">
              <div className="col">
                <label htmlFor="step-title" className="text-muted mb-1">
                  <small>Site</small>
                </label>
                <input onChange={(e) => setSiteName(e.target.value)} autoFocus name="site" id="site-name" className="body-content tall-textarea form-control" type="text" placeholder="" autoComplete="off" />
              </div>
              <div className="col">
                <label htmlFor="step-body" className="text-muted mb-1 d-block">
                  <small>Description</small>
                </label>
                <input onChange={(e) => setDescription(e.target.value)} name="description" id="site-description" className="body-content tall-textarea form-control" type="text"></input>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mb-2">
            Save New Site
          </button>
          <button type="button" onClick={onCancel} className="btn btn-sm btn-red">
            Cancel
          </button>
        </form>
      </Page>
    </div>
  )
}

export default CreateSites
