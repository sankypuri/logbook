// const plantCollection = require("../db").db().collection("plants")
const Plant = require("../models/Plant.js")
const Site = require("../models/Site.js")

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

exports.getChildrenByParentId = async function (req, res) {
  try {
    let plantData = await Plant.getChildrenByParentId(req.params.id)
    res.json(plantData)
  } catch (err) {
    res.status(500).json({ error: err.message })
    // console.log(err.message)
    res.status(500).send("Error in getData()" + err.message)
  }
}

exports.getParentById = async function (req, res) {
  try {
    // let parentData = await Site.findSingleById(req.params.id)
    let parentData = await Plant.getParentData(req.params.id)
    res.json(parentData)
  } catch (err) {
    res.status(500).json({ error: err.message })
    // console.log(err.message)
    // res.status(500).send("Error in getData()" + err.message)
  }
}

exports.deleteRecord = function (req, res) {
  Plant.delete(req.params.id)
    .then(() => {
      res.json("Deleted successfully.")
    })
    .catch((e) => {
      res.json("The record cannot be deleted.")
    })
}

exports.updateRecord = function (req, res) {
  // console.log("In updateRecord()")
  Plant.update(req.params.id, req.body)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be updated. " + e)
    })
}
