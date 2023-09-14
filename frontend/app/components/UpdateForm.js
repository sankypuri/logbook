import React, { useState } from "react"
import axios from "axios"

function UpdateForm({ master, onUpdate, onCancel }) {
  const [updatedMaster, setUpdatedMaster] = useState(master)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUpdatedMaster({ ...updatedMaster, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    axios
      .put(`/master-update/${updatedMaster._id}`, updatedMaster)
      .then(() => {
        onUpdate(updatedMaster)
      })
      .catch((error) => {
        console.error("Error updating data:", error)
      })
  }

  return (
    <div className="overlay container">
      <h2>Update Record</h2>
      <form onSubmit={handleSubmit}>
        {/* Create form inputs for each field, prefill with existing data */}
        {/* Example: */}
        <div className="form-group">
          <label htmlFor="ID" className="text-muted mb-1">
            <small>ID</small>
          </label>
          <input type="text" name="ID" className="form-control" value={updatedMaster.ID} onChange={handleInputChange} />
        </div>

        {/* ... Repeat for other fields ... */}
        <div className="form-group">
          <label htmlFor="master-category" className="text-muted mb-1">
            <small>Master Category</small>
          </label>
          <input onChange={handleInputChange} id="master-category" name="Category" className="form-control" type="text" value={updatedMaster.Category} />
        </div>

        <div className="form-group">
          <label htmlFor="master-category" className="text-muted mb-1">
            <small>Master Subategory</small>
          </label>
          <input onChange={handleInputChange} id="master-subcategory" name="Subcategory" className="form-control" type="text" value={updatedMaster.Subcategory} />
        </div>

        <div className="form-group">
          <label htmlFor="start-time" className="text-muted mb-1">
            <small>Start Time</small>
          </label>
          <input onChange={handleInputChange} id="start-time" name="startTime" className="form-control" type="datetime-local" value={updatedMaster.startTime} />

          <label htmlFor="end-time" className="text-muted mb-1">
            <small>End Time</small>
          </label>
          <input onChange={handleInputChange} id="end-time" name="endTime" className="form-control" type="datetime-local" value={updatedMaster.endTime} />
        </div>

        <button type="submit" className="btn btn-sm btn-success">
          Update
        </button>
        <button type="button" onClick={onCancel} className="btn btn-sm btn-red">
          Cancel
        </button>
      </form>
    </div>
  )
}

export default UpdateForm
