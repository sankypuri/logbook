import React, { useEffect, useState } from "react"
import Axios from "axios"
import { FormGrid } from "@formio/react"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfileSteps(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [steps, setSteps] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchSteps() {
      try {
        const response = await Axios.get(`/profile/${username}/steps`, {
          cancelToken: ourRequest.token,
        })
        setSteps(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem : " + e)
      }
    }
    fetchSteps()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Site Name</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>

      <tbody>
        {steps.map((step) => {
          const date = new Date(step.createdDate)
          const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

          return (
            <tr>
              <td>{step.title}</td>
              <td>{dateFormatted}</td>
              <td>{step.tag}</td>
              <td>
                <Link key={step._id} to={`/step/${step._id}`}>
                  <i className="bi bi-box-arrow-up-right"></i>
                </Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ProfileSteps
