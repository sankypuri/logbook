import React, { useState } from "react"
import axios from "axios"

function PlantUpdateForm({ plant, onUpdate, onCancel }) {
  const [updatedPlant, setUpdatedPlant] = useState(plant)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUpdatedPlant({ ...updatedPlant, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    axios
      .put(`/plant-update/${updatedPlant._id}`, updatedPlant)
      .then(() => {
        onUpdate(updatedPlant)
      })
      .catch((error) => {
        console.error("Error updating data:", error)
      })
  }

  return (
    <div className="form-overlay container">
      <div className="form-heading">
        <h2>Update Plant</h2>
        <a onClick={onCancel} data-tip="cancel" data-for="cancel" className="cancel">
          <i class="bi bi-x-lg"></i>
        </a>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="plantName" className="text-muted mb-1">
            <small>PlantName Name</small>
          </label>
          <input type="text" name="plantName" className="form-control" value={updatedPlant.plantName} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="text-muted mb-1">
            <small>Description</small>
          </label>
          <input onChange={handleInputChange} id="description" name="description" className="form-control" type="text" value={updatedPlant.description} />
        </div>

        <div className="form-group">
          <label htmlFor="parentSiteName" className="text-muted mb-1">
            <small>Site</small>
          </label>
          <input onChange={handleInputChange} id="parentSiteName" name="parentSiteName" className="form-control" type="text" value={updatedPlant.parentSiteName} disabled />
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

export default PlantUpdateForm
