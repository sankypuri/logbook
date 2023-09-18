const siteCollection = require("../db").db().collection("sites")
const ObjectId = require("mongodb").ObjectId
// siteCollection.createIndex({ title: "text", body: "text" })

class Site {
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
              name: 1,
              type: 1,
            },
          },
        ])
        .concat(finalOperations)

      let sites = await siteCollection.aggregate(aggOperations).toArray()
      sites = sites.map(function (site) {
        return site
      })

      resolve(sites)
    })
  }

  cleanUp() {
    if (typeof this.data.title != "string") {
      this.data.name = ""
    }
    // if (typeof this.data.body != "string") {
    //   this.data.body = ""
    // }

    // get rid of any bogus properties
    this.data = {
      name: this.data.name,
      type: "site",
    }
  }

  static getData() {
    return Site.reusableSiteQuery([])
  }

  validate() {
    return new Promise(async (resolve, reject) => {
      if (this.data.name == "") {
        this.errors.push("You must provide a name category.")
        // reject()
      }

      let entryExist = await siteCollection.findOne({ name: this.data.name })
      if (entryExist) {
        this.errors.push("This site already exists.")
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
      if (!this.errors.length) {
        console.log(this.errors.length)
        // save post into database
        siteCollection
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

  static delete(masterIdToDelete) {
    return new Promise(async (resolve, reject) => {
      try {
        await masterCollection.deleteOne({ _id: new ObjectId(masterIdToDelete) })
        resolve()
      } catch (e) {
        reject()
      }
    })
  }

  static update(masterIdToUpdate, newData) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("ID to update: " + masterIdToUpdate)
        // console.log("Data To Update: " + newData.ID + ", " + newData.Category + ", " + newData.Subcategory)

        const updatedMaster = await masterCollection.findOneAndUpdate(
          { _id: new ObjectId(masterIdToUpdate) },
          {
            $set: {
              ID: newData.ID,
              Category: newData.Category,
              Status: newData.Status,
              Subcategory: newData.Subcategory,
              endTime: newData.endTime,
              startTime: newData.startTime,
              value: newData.value,
            },
          }
        )
        if (!updatedMaster) {
          reject()
        }
        resolve(updatedMaster)
      } catch (err) {
        reject()
      }
    })
  }
}

module.exports = Site
