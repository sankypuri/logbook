import React, { useEffect, useState } from "react"
import Axios from "axios"
import { FormGrid } from "@formio/react"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import SiteUpdateForm from "./SiteUpdateForm"
import ReactTooltip from "react-tooltip"
import NoItems from "./NoItems"
import PlantUpdateForm from "./PlantUpdateForm"

function SiteList(props) {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [plants, setPlants] = useState([])
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [parentSite, setParentSite] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPlants() {
      try {
        const reqURL = id ? `/get-plants/${id}` : "/get-plants"
        // console.log("Req URL: " + reqURL)
        const response = await Axios.get(reqURL, {
          cancelToken: ourRequest.token,
        })
        if (id) {
          const parentData = await Axios.get(`/get-parent-site/${id}`, {
            cancelToken: ourRequest.token,
          })
          setParentSite(parentData.data)
        }
        setPlants(response.data)
        if (response.data.length == 0) setNoData(true)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem : " + e)
      }
    }
    fetchPlants()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading) return <LoadingDotsIcon />

  const handleUpdate = (site) => {
    setSelectedPlant(site)
  }

  const handleCancelUpdate = () => {
    setSelectedPlant(null)
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recond?")
    if (confirmDelete) {
      Axios.delete(`delete-plant-record/${id}`)
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

  const breadCrumbSite = id ? `${parentSite.siteName}` : "Sites"

  return (
    <div className="container">
      <p>
        Configure Masters &gt; <a href="/configuration/sites">{breadCrumbSite}</a> &gt; Plants
      </p>

      {noData && <NoItems childType="plants" parent={parentSite.siteName} parentType={parentSite.type} />}

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Plant Name</th>
            <th scope="col">Description</th>
            <th scope="col">Site</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>

        <tbody>
          {plants.map((plant) => {
            return (
              <tr key={plant._id}>
                <td>{plant.plantName}</td>
                <td>{plant.description}</td>
                <td>{plant.parentSiteName}</td>
                <td>
                  <Link onClick={() => handleUpdate(plant)} data-tip="Update" data-for="edit" className="bi bi-pencil"></Link>
                  <ReactTooltip id="edit" className="custom-tooltip" />{" "}
                </td>
                <td>
                  <a onClick={() => handleDelete(plant._id)} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
                    <i className="fas fa-trash"></i>
                  </a>
                  <ReactTooltip id="delete" className="custom-tooltip" />
                </td>
                <td>
                  <a href={`/configuration/plants/${plant._id}`} data-tip="View areas under this plant" data-for="plant" className="delete-post-button text-primary">
                    <i className="bi bi-house"></i>
                  </a>
                  <ReactTooltip id="plant" className="custom-tooltip" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {selectedPlant && (
        <PlantUpdateForm
          plant={selectedPlant}
          onCancel={handleCancelUpdate}
          onUpdate={(updatedPlant) => {
            // Update the UI with the updated data
            setPlants((prevPlant) => prevPlant.map((s) => (s._id === updatedPlant._id ? updatedPlant : s)))
            setSelectedPlant(null)
          }}
        />
      )}
    </div>
  )
}

export default SiteList
