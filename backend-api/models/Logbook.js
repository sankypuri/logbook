//const postsCollection = require("../db").db().collection("posts");
const logbookCollection = require("../db").db().collection("logbook");
//const followsCollection = require("../db").db().collection("follows");
const ObjectID = require("mongodb").ObjectID;
const User = require("./User");
const sanitizeHTML = require("sanitize-html");

//postsCollection.createIndex({ title: "text", body: "text" });
logbookCollection.createIndex({ logbook: "text", description: "text" });

let Logbook = function (data, userid, requestedLogbookId) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.requestedLogbookId = requestedLogbookId;
};

Logbook.prototype.cleanUp = function () {
  if (typeof this.data.logbook != "string") {
    this.data.logbook = "";
  }
  if (typeof this.data.description != "string") {
    this.data.description = "";
  }

  // get rid of any bogus properties
  this.data = {
    logbook: sanitizeHTML(this.data.logbook.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    description: sanitizeHTML(this.data.description.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    createdDate: new Date(),
    author: ObjectID(this.userid),
    //description: this.data.description,
    asociatedWorkflow: this.data.asociatedWf,
    asociatedStep: this.data.asociatedStp,
  };
};

Logbook.prototype.validate = function () {
  if (this.data.logbook == "") {
    this.errors.push("You must provide a Logbook.");
  }
  if (this.data.description == "") {
    this.errors.push("You must provide post content.");
  }
};

Logbook.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // save post into database

      logbookCollection
        .insertOne(this.data)
        .then((info) => {
          resolve(info.insertedId);
        })
        .catch((e) => {
          this.errors.push("Please try again later.");

          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

Logbook.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let logbook = await Logbook.findSingleById(
        this.requestedLogbookId,
        this.userid
      );
      if (logbook.isVisitorOwner) {
        // actually update the db
        let status = await this.actuallyUpdate();
        resolve(status);
      } else {
        reject();
      }
    } catch (e) {
      reject();
    }
  });
};

Logbook.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    // this.cleanUp();
    // this.validate();
    if (!this.errors.length) {
      await logbookCollection.findOneAndUpdate(
        { _id: new ObjectID(this.requestedLogbookId) },
        {
          $set: {
            logbook: this.data.logbook,
            description: this.data.description,
            asociatedWf: this.data.asociatedWf,
            asociatedStp: this.data.asociatedStp,
          },
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

Logbook.reusableLogbookQuery = function (
  uniqueOperations,
  visitorId,
  finalOperations = []
) {
  return new Promise(async function (resolve, reject) {
    let aggOperations = uniqueOperations
      .concat([
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDocument",
          },
        },
        {
          $project: {
            logbook: 1,
            description: 1,
            asociatedWorkflow: 1,
            authorId: "$author",
            author: { $arrayElemAt: ["$authorDocument", 0] },
            asociatedStep: 1,
          },
        },
      ])
      .concat(finalOperations);

    let logbooks = await logbookCollection.aggregate(aggOperations).toArray();

    // clean up author property in each post object
    logbooks = logbooks.map(function (logbook) {
      logbook.isVisitorOwner = logbook.authorId.equals(visitorId);
      logbook.authorId = undefined;

      logbook.author = {
        username: logbook.author.username,
        avatar: new User(logbook.author, true).avatar,
      };

      return logbook;
    });

    resolve(logbooks);
  });
};

Logbook.findSingleById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      reject();
      return;
    }

    let logbooks = await Logbook.reusableLogbookQuery(
      [{ $match: { _id: new ObjectID(id) } }],
      visitorId
    );

    if (logbooks.length) {
      resolve(logbooks[0]);
    } else {
      reject();
    }
  });
};

Logbook.findByAuthorId = function (authorId) {
  return Logbook.reusableLogbookQuery([
    { $match: { author: authorId } },
    { $sort: { createdDate: -1 } },
  ]);
};

Logbook.delete = function (logbookIdToDelete, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let logbook = await Logbook.findSingleById(
        logbookIdToDelete,
        currentUserId
      );
      if (logbook.isVisitorOwner) {
        await logbookCollection.deleteOne({
          _id: new ObjectID(logbookIdToDelete),
        });
        resolve();
      } else {
        reject();
      }
    } catch (e) {
      reject();
    }
  });
};
Logbook.search = function (searchTerm) {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm == "string") {
      let logbooks = await Logbook.reusableLogbookQuery(
        [{ $match: { $text: { $search: searchTerm } } }],
        undefined,
        [{ $sort: { score: { $meta: "textScore" } } }]
      );
      resolve(logbooks);
    } else {
      reject();
    }
  });
};
Logbook.countLogbookByAuthor = function (id) {
  return new Promise(async (resolve, reject) => {
    let logbookCount = await logbookCollection.countDocuments({ author: id });
    resolve(logbookCount);
  });
};

// Logbook.getFeed = async function (id) {
// //create an array of the user ids that the current user follows
//   let followedUsers = await followsCollection
//     .find({ authorId: new ObjectID(id) })
//     .toArray();
//   followedUsers = followedUsers.map(function (followDoc) {
//     return followDoc.followedId;
//   });

//   // look for posts where the author is in the above array of followed users
//   return Post.reusablePostQuery([
//     { $match: { author: { $in: followedUsers } } },
//     { $sort: { createdDate: -1 } },
//   ]);
// };

module.exports = Logbook;
