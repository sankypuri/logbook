import React, { useEffect, useState } from "react"
import Axios from "axios"
import { FormGrid } from "@formio/react"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import SiteUpdateForm from "./SiteUpdateForm"
import ReactTooltip from "react-tooltip"
import CreateSites from "./CreateSites"

function SiteList(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState(null)
  const [createSite, setCreateSite] = useState(false)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchSites() {
      try {
        const response = await Axios.get(`/get-sites`, {
          cancelToken: ourRequest.token,
        })
        setSites(response.data)
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

  if (isLoading) return <LoadingDotsIcon />

  const handleUpdate = (site) => {
    setSelectedSite(site)
  }

  const handleCancelUpdate = () => {
    setSelectedSite(null)
  }

  const handleCancelCreate = () => {
    setCreateSite(false)
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recond?")
    if (confirmDelete) {
      Axios.delete(`delete-site-record/${id}`)
        .then(() => {
          console.log("The record has been deleted successfully, now loading new records.")
          setSites(sites.filter((site) => site.id !== id))
          SiteList()
          console.log("Data after deleting: " + sites)
        })
        .catch((error) => {
          console.error("Error deleting data: ", error)
        })
    }
  }

  const handleCreate = (createdSite) => {
    setSites({ ...sites, createdSite })
    createSite(false)
    console.log(JSON.stringify(createdSite))
  }
  return (
    <div className="container">
      <div className="form-heading">
        <p>Configure Masters &gt; Sites</p>
        <button onClick={() => setCreateSite(true)} type="button" class="btn btn-primary btn-sm">
          <i class="bi bi-plus-lg"></i> Create New Site
        </button>
        {/* <Link onClick={() => setCreateSite(true)} className="bi bi-plus-circle" data-tip="Create" data-for="create"></Link> */}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Site Name</th>
            <th scope="col">Description</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>

        <tbody>
          {sites.map((site) => {
            return (
              <tr key={site._id}>
                <td>{site.siteName}</td>
                <td>{site.description}</td>
                <td>
                  <Link onClick={() => handleUpdate(site)} data-tip="Update" data-for="edit" className="bi bi-pencil"></Link>
                  <ReactTooltip id="edit" className="custom-tooltip" />{" "}
                </td>
                <td>
                  <a onClick={() => handleDelete(site._id)} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
                    <i className="fas fa-trash"></i>
                  </a>
                  <ReactTooltip id="delete" className="custom-tooltip" />
                </td>
                <td>
                  <a href={`/configuration/plants/${site._id}`} data-tip="View plants under this site" data-for="plant" className="delete-post-button text-primary">
                    <i className="bi bi-house"></i>
                  </a>
                  <ReactTooltip id="plant" className="custom-tooltip" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {selectedSite && (
        <SiteUpdateForm
          site={selectedSite}
          onCancel={handleCancelUpdate}
          onUpdate={(updatedSite) => {
            // Update the UI with the updated data
            setSites((prevSite) => prevSite.map((s) => (s._id === updatedSite._id ? updatedSite : s)))
            setSelectedSite(null)
          }}
        />
      )}

      {createSite && <CreateSites onCancel={handleCancelCreate} onCreate={handleCreate} />}
    </div>
  )
}

export default SiteList
