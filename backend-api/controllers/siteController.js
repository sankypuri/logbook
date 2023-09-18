// import Master from "../models/Master.js"
const siteCollection = require("../db").db().collection("sites")
const Site = require("../models/Site.js")

exports.apiCreateSite = function (req, res) {
  let entry = new Site(req.body)
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
    let masterData = await Site.getData()

    res.json(masterData)
    console.log("In geData() function: " + masterData)
  } catch (err) {
    res.status(500).json({ error: err.message })
    // console.log(err.message)
    res.status(500).send("Error in getData()" + err.message)
  }
}

exports.deleteRecord = function (req, res) {
  Site.delete(req.params.id)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be deleted.")
    })
}

exports.updateRecord = function (req, res) {
  console.log("In updateRecord()")
  Site.update(req.params.id, req.body)
    .then(() => {
      res.json("Success")
    })
    .catch((e) => {
      res.json("The record cannot be updated. " + e)
    })
}
