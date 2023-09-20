import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function MasterForm() {
  const [category, setCategory] = useState()
  const [subcategory, setSubcategory] = useState()
  const [masterId, setMasterId] = useState()
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      var data = {
        masterId,
        category,
        subcategory,
        startTime,
        endTime,
      }
      const response = await Axios.post("/masterEntry", data)
      if (response.status == 200) console.log("Form Submitted Successfully.")

      appDispatch({
        type: "flashMessage",
        value: response,
      })
      navigate("/master")
    } catch (e) {
      console.error("Error submitting form: ", e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="master-category" className="text-muted mb-1">
          <small>Master Category</small>
        </label>
        <input onChange={(e) => setCategory(e.target.value)} id="master-category" name="category" className="form-control" type="text" placeholder="Enter master category" autoComplete="off" />
      </div>
      <div className="form-group">
        <label htmlFor="master-subcategory" className="text-muted mb-1">
          <small>Master Subcategory</small>
        </label>
        <input onChange={(e) => setSubcategory(e.target.value)} id="master-subcategory" name="subcategory" className="form-control" type="text" placeholder="Enter subcategory" autoComplete="off" />
      </div>
      <div className="form-group">
        <label htmlFor="master-id" className="text-muted mb-1">
          <small>Master ID</small>
        </label>
        <input onChange={(e) => setMasterId(e.target.value)} id="master-id" name="masterId" className="form-control" type="text" placeholder="Enter unique master ID" autoComplete="off" />
      </div>

      <div className="form-group">
        <label htmlFor="start-time" className="text-muted mb-1">
          <small>Start Time</small>
        </label>
        <input onChange={(e) => setStartTime(e.target.value)} id="start-time" name="startTime" className="form-control" type="datetime-local" placeholder="Start time" autoComplete="off" />

        <label htmlFor="end-time" className="text-muted mb-1">
          <small>End Time</small>
        </label>
        <input onChange={(e) => setEndTime(e.target.value)} id="end-time" name="endTime" className="form-control" type="datetime-local" placeholder="End time" autoComplete="off" />
      </div>

      <button type="submit" className="py-2 mt-4 btn btn-sm btn-success btn-block">
        Add to the Master
      </button>
    </form>
  )
}

export default MasterForm
