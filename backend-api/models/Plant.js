const plantCollection = require("../db").db().collection("plants")
const ObjectId = require("mongodb").ObjectId
// plantCollection.createIndex({ siteName: "text", description: "text" })

class Plant {
  constructor(data) {
    this.data = data
    this.errors = []
  }

  static reusableSiteQuery(uniqueOperations, visitorId, finalOperations = []) {
    return new Promise(async function (resolve, reject) {
      let aggOperations = uniqueOperations
        .concat([
          {
            $project: {
              _id: 1,
              plantName: 1,
              description: 1,
              type: 1,
              parentSiteName: 1,
              parentSiteId: 1,
            },
          },
        ])
        .concat(finalOperations)

      let plants = await plantCollection.aggregate(aggOperations).toArray()
      plants = plants.map(function (plant) {
        return plant
      })

      resolve(plants)
    })
  }

  cleanUp() {
    if (typeof this.data.plantName != "string") {
      this.data.plantName = ""
    }
    if (typeof this.data.description != "string") {
      this.data.description = ""
    }
    if (typeof this.data.parentSiteName != "string") {
      this.data.parentSiteName = ""
    }
    if (typeof this.data.parentSiteId != "string") {
      this.data.parentSiteId = ""
    }

    // get rid of any bogus properties
    this.data = {
      plantName: this.data.plantName,
      type: "plant",
      description: this.data.description,
      parentSiteName: this.data.parentSiteName,
      parentSiteId: new ObjectId(this.data.parentSiteId),
    }
  }

  static getData() {
    return Site.reusableSiteQuery([])
  }

  validate() {
    return new Promise(async (resolve, reject) => {
      if (this.data.plantName == "") {
        this.errors.push("You must provide a plant name.")
        // reject()
      }
      if (this.data.parentSiteName == "") {
        this.errors.push("You must select a site.")
        // reject()
      }

      let entryExist = await plantCollection.findOne({ plantName: this.data.plantName })
      if (entryExist) {
        this.errors.push("This plant already exists.")
        // reject()
      }
      console.log(this.errors)
      resolve()
    })
  }

  create() {
    return new Promise(async (resolve, reject) => {
      this.cleanUp()
      await this.validate()
      // console.log("In create function: " + this.data)
      // console.log(this.errors)
      if (!this.errors.length) {
        console.log(this.errors.length)
        // save post into database
        plantCollection
          .insertOne(this.data)
          .then((info) => {
            resolve(info.insertedId)
          })
          .catch((e) => {
            this.errors.push("Please try again later.")
            reject(this.errors)
          })
      } else {
        reject(this.errors)
      }
    })
  }

  static findSingleById(id) {
    return new Promise(async function (resolve, reject) {
      if (typeof id != "string" || !ObjectId.isValid(id)) {
        reject()
        return
      }

      let master = await Master.reusableMasterQuery([{ $match: { _id: new ObjectId(id) } }])

      if (master.length) {
        resolve(master[0])
      } else {
        reject()
      }
    })
  }

  static delete(siteIdToDelete) {
    return new Promise(async (resolve, reject) => {
      try {
        await plantCollection.deleteOne({ _id: new ObjectId(siteIdToDelete) })
        resolve()
      } catch (e) {
        reject()
      }
    })
  }

  static update(siteIdToUpdate, newData) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("ID to update: " + masterIdToUpdate)
        // console.log("Data To Update: " + newData.ID + ", " + newData.Category + ", " + newData.Subcategory)

        const updatedSite = await plantCollection.findOneAndUpdate(
          { _id: new ObjectId(siteIdToUpdate) },
          {
            $set: {
              siteName: newData.siteName,
              description: newData.description,
            },
          }
        )
        if (!updatedSite) {
          reject()
        }
        resolve(updatedSite)
      } catch (err) {
        reject()
      }
    })
  }

  static getAllSites() {
    return new Promise(async (resolve, reject) => {
      try {
      } catch (err) {
        reject()
      }
    })
  }
}

module.exports = Plant
