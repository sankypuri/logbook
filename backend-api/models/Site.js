const siteCollection = require("../db").db().collection("sites")
const ObjectId = require("mongodb").ObjectId
siteCollection.createIndex({ siteName: "text", description: "text" })

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
              siteName: 1,
              description: 1,
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
    if (typeof this.data.siteName != "string") {
      this.data.siteName = ""
    }
    if (typeof this.data.description != "string") {
      this.data.description = ""
    }

    // get rid of any bogus properties
    this.data = {
      siteName: this.data.siteName,
      type: "site",
      description: this.data.description,
    }
  }

  static getData() {
    return Site.reusableSiteQuery([])
  }

  validate() {
    return new Promise(async (resolve, reject) => {
      if (this.data.siteName == "") {
        this.errors.push("You must provide a site name.")
        // reject()
      }

      let entryExist = await siteCollection.findOne({ siteName: this.data.siteName })
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
      // console.log("In create function: " + this.data)
      // console.log(this.errors)
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

      let site = await Site.reusableSiteQuery([{ $match: { _id: new ObjectId(id) } }])
      // console.log(JSON.stringify(site))
      if (site.length) {
        resolve(site[0])
      } else {
        reject()
      }
    })
  }

  static delete(siteIdToDelete) {
    return new Promise(async (resolve, reject) => {
      try {
        await siteCollection.deleteOne({ _id: new ObjectId(siteIdToDelete) })
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

        const updatedSite = await siteCollection.findOneAndUpdate(
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

module.exports = Site
