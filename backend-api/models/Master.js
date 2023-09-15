const masterCollection = require("../db").db().collection("masters")
const ObjectId = require("mongodb").ObjectId
masterCollection.createIndex({ title: "text", body: "text" })

class Master {
  constructor(data) {
    this.data = data
    this.errors = []
  }

  static reusableMasterQuery(uniqueOperations, visitorId, finalOperations = []) {
    return new Promise(async function (resolve, reject) {
      let aggOperations = uniqueOperations
        .concat([
          {
            $project: {
              ID: 1,
              Category: 1,
              Subcategory: 1,
              startTime: "$Start Time",
              endTime: "$End Time",
              Value: 1,
              Status: 1,
            },
          },
        ])
        .concat(finalOperations)

      let masters = await masterCollection.aggregate(aggOperations).toArray()
      masters = masters.map(function (master) {
        return master
      })

      resolve(masters)
    })
  }

  cleanUp() {
    if (typeof this.data.title != "string") {
      this.data.title = ""
    }
    if (typeof this.data.body != "string") {
      this.data.body = ""
    }

    // get rid of any bogus properties
    this.data = {
      ID: this.data.masterId,
      Category: this.data.category,
      "Start Time": this.data.startTime,
      "End Time": this.data.endTime,
      Value: this.data.value,
      Status: this.data.status,
      Subcategory: this.data.subcategory,
    }
  }

  static getData() {
    return Master.reusableMasterQuery([])
  }

  validate() {
    return new Promise(async (resolve, reject) => {
      if (this.data.Category == "") {
        this.errors.push("You must provide a master category.")
        // reject()
      }
      if (this.data.ID == "") {
        this.errors.push("You must provide an ID.")
        // reject()
      }

      let entryExist = await masterCollection.findOne({ ID: this.data.ID })
      if (entryExist) {
        this.errors.push("Entry with this ID already exist.")
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
        masterCollection
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

module.exports = Master
