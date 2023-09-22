import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreateSites(props) {
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
      navigate("/configuration/sites")
      console.log("New site was created.")
    } catch (e) {
      console.log("There was a problem while creating site: " + e)
    }
  }

  return (
    <Page title="Create Site" wide={true}>
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
      </form>
    </Page>
  )
}

export default CreateSites
