import React, { useEffect, useState } from "react"
import axios from "axios"
import UpdateForm from "./UpdateForm"
import ReactTooltip from "react-tooltip"
import { useParams, Link, useNavigate } from "react-router-dom"

function MasterList() {
  const [masterData, setMasterData] = useState([])
  const [selectedMaster, setSelectedMaster] = useState(null)

  useEffect(() => {
    console.log("Master List Use Effect has been run.")
    axios
      .get("/master-table")
      .then((response) => {
        setMasterData(response.data)
      })
      .catch((error) => {
        console.error("Error while fetching master data: ", error)
      })
  }, [])

  const handleUpdate = (master) => {
    setSelectedMaster(master)
  }

  const handleCancelUpdate = () => {
    setSelectedMaster(null)
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recond?")
    if (confirmDelete) {
      axios
        .delete(`delete-master-record/${id}`)
        .then(() => {
          console.log("The record has been deleted successfully, now loading new records.")
          setMasterData(masterData.filter((master) => master.id !== id))
          console.log("Data after deleting: " + masterData)
        })
        .catch((error) => {
          console.error("Error deleting data: ", error)
        })
    }
  }

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID </th>
            <th scope="col">Category </th>
            <th scope="col">Start Time </th>
            <th scope="col">End Time </th>
            <th scope="col">Value </th>
            <th scope="col">Status </th>
            <th scope="col">Subcategory </th>
            <th scope="col">Edit </th>
            <th scope="col">Delete </th>
          </tr>
        </thead>
        <tbody>
          {masterData.map((master) => (
            <tr key={master._id}>
              <td>{master.ID}</td>
              <td>{master.Category}</td>
              <td>{master.startTime}</td>
              <td>{master.endTime}</td>
              <td>{master.Value}</td>
              <td>{master.Status}</td>
              <td>{master.Subcategory}</td>
              <td>
                <Link onClick={() => handleUpdate(master)} data-tip="Edit" data-for="edit" className="bi bi-pencil"></Link>
                <ReactTooltip id="edit" className="custom-tooltip" />{" "}
                {/* <button onClick={() => handleUpdate(master)} className="btn btn-sm btn-success">
                  Update
                </button> */}
                {/* <button onClick={() => handleDelete(master._id)} className="btn btn-sm btn-red">
                  Delete
                </button> */}
              </td>
              <td>
                <a onClick={() => handleDelete(master._id)} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
                  <i className="fas fa-trash"></i>
                </a>
                <ReactTooltip id="delete" className="custom-tooltip" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* To be updated: */}
      {selectedMaster && (
        <UpdateForm
          master={selectedMaster}
          onCancel={handleCancelUpdate}
          onUpdate={(updatedMaster) => {
            // Update the UI with the updated data
            setMasterData((prevMasters) => prevMasters.map((m) => (m._id === updatedMaster._id ? updatedMaster : m)))
            setSelectedMaster(null)
          }}
        />
      )}
    </div>
  )
}

export default MasterList
