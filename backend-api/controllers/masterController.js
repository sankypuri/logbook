// import Master from "../models/Master.js"
const masterCollection = require("../db").db().collection("masters")
const Master = require("../models/Master.js")

exports.apiCreateMaster = function (req, res) {
  let entry = new Master(req.body)
  entry
    .create()
    .then(function (newId) {
      res.json(newId)
    })
    .catch(function (errors) {
      res.json(errors)
    })
}

exports.getData = async function (req, res) {
  try {
    let masterData = await Master.getData()

    res.json(masterData)
    // console.log("In geData() function: " + masterData)
  } catch (err) {
    res.status(500).json({ error: err.message })
    // console.log(err.message)
    res.status(500).send("Error in getData()" + err.message)
  }
}

exports.deleteRecord = function (req, res) {
  Master.delete(req.params.id)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be deleted.")
    })
}

exports.updateRecord = function (req, res) {
  console.log("In updateRecord()")
  Master.update(req.params.id, req.body)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be updated. " + e)
    })
}
