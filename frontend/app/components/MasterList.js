import React, { useEffect, useState } from "react"
import axios from "axios"
import UpdateForm from "./UpdateForm"

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
      <table className="table">
        <thead>
          <tr>
            <th>ID </th>
            <th>Category </th>
            <th>Start Time </th>
            <th>End Time </th>
            <th>Value </th>
            <th>Status </th>
            <th>Subcategory </th>
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
                <button onClick={() => handleUpdate(master)} className="btn btn-sm btn-success">
                  Update
                </button>
                <button onClick={() => handleDelete(master._id)} className="btn btn-sm btn-red">
                  Delete
                </button>
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
