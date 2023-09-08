const stepsCollection = require("../db").db().collection("steps");
//const followsCollection = require("../db").db().collection("follows");
const ObjectID = require("mongodb").ObjectID;
const User = require("./User");
const sanitizeHTML = require("sanitize-html");

stepsCollection.createIndex({ title: "text", body: "text" });

let Step = function (data, userid, requestedStepId) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.requestedStepId = requestedStepId;
};

Step.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") {
    this.data.title = "";
  }
  if (typeof this.data.body != "string") {
    this.data.body = "";
  }

  // get rid of any bogus properties
  this.data = {
    title: sanitizeHTML(this.data.title.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    body: sanitizeHTML(this.data.body.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    createdDate: new Date(),
    author: ObjectID(this.userid),
    tag: this.data.tag,
    schema: this.data.schema,
  };
};

Step.prototype.validate = function () {
  if (this.data.title == "") {
    this.errors.push("You must provide a title.");
  }
  if (this.data.body == "") {
    this.errors.push("You must provide Step content.");
  }
};

Step.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // save steps into database
      stepsCollection
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

Step.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let step = await Step.findSingleById(this.requestedStepId, this.userid);
      if (step.isVisitorOwner) {
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

Step.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      await stepsCollection.findOneAndUpdate(
        { _id: new ObjectID(this.requestedStepId) },
        {
          $set: {
            title: this.data.title,
            body: this.data.body,
            tag: this.data.tag,
            schema: this.data.schema,
          },
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

Step.reusableStepQuery = function (
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
            title: 1,
            body: 1,
            createdDate: 1,
            authorId: "$author",
            author: { $arrayElemAt: ["$authorDocument", 0] },
            tag: 1,
            schema: 1,
          },
        },
      ])
      .concat(finalOperations);

    let steps = await stepsCollection.aggregate(aggOperations).toArray();

    // clean up author property in each Step object
    steps = steps.map(function (step) {
      step.isVisitorOwner = step.authorId.equals(visitorId);
      step.authorId = undefined;

      step.author = {
        username: step.author.username,
        avatar: new User(step.author, true).avatar,
      };

      return step;
    });

    resolve(steps);
  });
};

Step.findSingleById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      reject();
      return;
    }

    let steps = await Step.reusableStepQuery(
      [{ $match: { _id: new ObjectID(id) } }],
      visitorId
    );

    if (steps.length) {
      resolve(steps[0]);
    } else {
      reject();
    }
  });
};

Step.findByAuthorId = function (authorId) {
  return Step.reusableStepQuery([
    { $match: { author: authorId } },
    { $sort: { createdDate: -1 } },
  ]);
};

Step.delete = function (stepIdToDelete, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let step = await Step.findSingleById(stepIdToDelete, currentUserId);
      if (step.isVisitorOwner) {
        await stepsCollection.deleteOne({ _id: new ObjectID(stepIdToDelete) });
        resolve();
      } else {
        reject();
      }
    } catch (e) {
      reject();
    }
  });
};

Step.search = function (searchTerm) {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm == "string") {
      let steps = await Step.reusableStepQuery(
        [{ $match: { $text: { $search: searchTerm } } }],
        undefined,
        [{ $sort: { score: { $meta: "textScore" } } }]
      );
      resolve(steps);
    } else {
      reject();
    }
  });
};

Step.countStepsByAuthor = function (id) {
  return new Promise(async (resolve, reject) => {
    let stepCount = await stepsCollection.countDocuments({ author: id });
    resolve(stepCount);
  });
};

Step.getFeed = async function (id) {
  // create an array of the user ids that the current user follows
  let followedUsers = await followsCollection
    .find({ authorId: new ObjectID(id) })
    .toArray();
  followedUsers = followedUsers.map(function (followDoc) {
    return followDoc.followedId;
  });

  // look for Steps where the author is in the above array of followed users
  return Step.reusableStepQuery([
    { $match: { author: { $in: followedUsers } } },
    { $sort: { createdDate: -1 } },
  ]);
};

module.exports = Step;
