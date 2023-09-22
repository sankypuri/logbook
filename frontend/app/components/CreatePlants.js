import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Page from "./Page"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
// const ObjectId = require("mongodb").ObjectId

function CreatePlants(props) {
  const [plantName, setPlantName] = useState()
  const [description, setDescription] = useState()
  const [parentSiteName, setParentSiteName] = useState()
  const [parentSiteId, setParentSiteId] = useState()
  const [siteList, setSiteList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchSites() {
      try {
        const response = await Axios.get(`/get-sites`, {
          cancelToken: ourRequest.token,
        })
        setSiteList(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem : " + e)
      }
    }
    fetchSites()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  const handleSiteSelection = (event) => {
    const selectedSiteId = event.target.value
    const selectedSiteData = siteList.find((site) => site._id === selectedSiteId)

    if (selectedSiteData) {
      setParentSiteId(selectedSiteData._id)
      setParentSiteName(selectedSiteData.siteName)
    } else {
      setParentSiteId("")
      setParentSiteName("")
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/create-plant", {
        plantName,
        description,
        type: "plant",
        parentSiteName,
        parentSiteId,
      })

      appDispatch({
        type: "flashMessage",
        value: response,
      })
      navigate("/configuration/plant")
      console.log("New plant was created.")
    } catch (e) {
      console.log("There was a problem while creating plant: " + e)
    }
  }

  return (
    <Page title="Create Site" wide={true}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <label htmlFor="plant-name" className="text-muted mb-1">
                <small>Plant</small>
              </label>
              <input onChange={(e) => setPlantName(e.target.value)} autoFocus name="plant" id="plant-name" className="body-content tall-textarea form-control" type="text" placeholder="" autoComplete="off" />
            </div>

            <div className="col-3">
              <label htmlFor="site-list" className="text-muted mb-1">
                <small>Select a site:</small>
              </label>
              <select name="site" id="site-list" onChange={handleSiteSelection} className="form-control">
                {siteList.map((site) => (
                  <option key={site._id} value={site._id} className="">
                    {site.siteName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <label htmlFor="plant-description" className="text-muted mb-1 d-block">
                <small>Description</small>
              </label>
              <input onChange={(e) => setDescription(e.target.value)} name="description" id="plant-description" className="body-content tall-textarea form-control" type="text"></input>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mb-2">
          Save New Plant
        </button>
      </form>
    </Page>
  )
}

export default CreatePlants
