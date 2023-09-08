//const postsCollection = require("../db").db().collection("posts");
const workflowCollection = require("../db").db().collection("workflow");
//const followsCollection = require("../db").db().collection("follows");
const ObjectID = require("mongodb").ObjectID;
const User = require("./User");
const sanitizeHTML = require("sanitize-html");

//postsCollection.createIndex({ title: "text", body: "text" });
workflowCollection.createIndex({ workflow: "text", description: "text" });

let WorkFlow = function (data, userid, requestedWorkFlowId) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.requestedWorkFlowId = requestedWorkFlowId;
};

WorkFlow.prototype.cleanUp = function () {
  if (typeof this.data.workflow != "string") {
    this.data.workflow = "";
  }
  if (typeof this.data.description != "string") {
    this.data.description = "";
  }

  // get rid of any bogus properties
  this.data = {
    workflow: sanitizeHTML(this.data.workflow.trim(), {
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
    category: this.data.category,
    approver1: this.data.approver1,
    approver2: this.data.approver2,
  };
};

WorkFlow.prototype.validate = function () {
  if (this.data.workflow == "") {
    this.errors.push("You must provide a title.");
  }
  if (this.data.description == "") {
    this.errors.push("You must provide post content.");
  }
};

WorkFlow.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // save post into database

      workflowCollection
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

WorkFlow.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let workflow = await WorkFlow.findSingleById(
        this.requestedWorkFlowId,
        this.userid
      );
      if (workflow.isVisitorOwner) {
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

WorkFlow.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      await workflowCollection.findOneAndUpdate(
        { _id: new ObjectID(this.requestedPostId) },
        {
          $set: {
            workflow: this.data.workflow,
            description: this.data.description,
            category: this.data.category,
            approver1: this.data.approver1,
            approver2: this.data.approver2,
          },
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

WorkFlow.reusableWorkFlowQuery = function (
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
            workflow: 1,
            description: 1,
            category: 1,
            authorId: "$author",
            author: { $arrayElemAt: ["$authorDocument", 0] },
            approver1: 1,
            approver2: 1,
          },
        },
      ])
      .concat(finalOperations);

    let workflows = await workflowCollection.aggregate(aggOperations).toArray();

    // clean up author property in each post object
    workflows = workflows.map(function (workflow) {
      workflow.isVisitorOwner = workflow.authorId.equals(visitorId);
      workflow.authorId = undefined;

      workflow.author = {
        username: workflow.author.username,
        avatar: new User(workflow.author, true).avatar,
      };

      return workflow;
    });

    resolve(workflows);
  });
};

WorkFlow.findSingleById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      reject();
      return;
    }

    let workflows = await WorkFlow.reusableWorkFlowQuery(
      [{ $match: { _id: new ObjectID(id) } }],
      visitorId
    );

    if (workflows.length) {
      resolve(workflows[0]);
    } else {
      reject();
    }
  });
};

WorkFlow.findByAuthorId = function (authorId) {
  return WorkFlow.reusableWorkFlowQuery([
    { $match: { author: authorId } },
    { $sort: { createdDate: -1 } },
  ]);
};

WorkFlow.delete = function (workflowIdToDelete, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let workflow = await Post.findSingleById(
        workflowIdToDelete,
        currentUserId
      );
      if (workflow.isVisitorOwner) {
        await workflowCollection.deleteOne({
          _id: new ObjectID(workflowIdToDelete),
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
WorkFlow.search = function (searchTerm) {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm == "string") {
      let workflows = await WorkFlow.reusableWorkFlowQuery(
        [{ $match: { $text: { $search: searchTerm } } }],
        undefined,
        [{ $sort: { score: { $meta: "textScore" } } }]
      );
      resolve(workflows);
    } else {
      reject();
    }
  });
};
WorkFlow.countWorkFlowByAuthor = function (id) {
  return new Promise(async (resolve, reject) => {
    let workflowCount = await workflowCollection.countDocuments({ author: id });
    resolve(workflowCount);
  });
};

// WorkFlow.getFeed = async function (id) {
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

module.exports = WorkFlow;
