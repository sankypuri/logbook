import React, { useState } from "react"
import { useParams } from "react-router-dom"

function NoItems(props) {
  return (
    <div class="alert alert-warning" role="alert">
      There are no {props.childType} added in {props.parentType} {props.parent}.
    </div>
  )
}

export default NoItems
