import React, { useState } from "react"
import axios from "axios"

function SiteUpdateForm({ site, onUpdate, onCancel }) {
  const [updatedSite, setUpdatedSite] = useState(site)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUpdatedSite({ ...updatedSite, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    axios
      .put(`/site-update/${updatedSite._id}`, updatedSite)
      .then(() => {
        onUpdate(updatedSite)
      })
      .catch((error) => {
        console.error("Error updating data:", error)
      })
  }

  return (
    <div className="form-overlay container">
      <div className="form-heading">
        <h2>Update Site</h2>
        <a onClick={onCancel} data-tip="cancel" data-for="cancel" className="cancel">
          <i class="bi bi-x-lg"></i>
        </a>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="siteName" className="text-muted mb-1">
            <small>Site Name</small>
          </label>
          <input type="text" name="siteName" className="form-control" value={updatedSite.siteName} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="text-muted mb-1">
            <small>Description</small>
          </label>
          <input onChange={handleInputChange} id="description" name="description" className="form-control" type="text" value={updatedSite.description} />
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

export default SiteUpdateForm
