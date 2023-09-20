const plantCollection = require("../db").db().collection("plants")
const Plant = require("../models/Plant.js")

exports.apiCreatePlant = function (req, res) {
  let entry = new Plant(req.body)
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
    let plantData = await Plant.getData()

    res.json(plantData)
    // console.log("In geData() function: " + siteData)
  } catch (err) {
    res.status(500).json({ error: err.message })
    // console.log(err.message)
    res.status(500).send("Error in getData()" + err.message)
  }
}

exports.deleteRecord = function (req, res) {
  Plant.delete(req.params.id)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be deleted.")
    })
}

exports.updateRecord = function (req, res) {
  console.log("In updateRecord()")
  Plant.update(req.params.id, req.body)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be updated. " + e)
    })
}
