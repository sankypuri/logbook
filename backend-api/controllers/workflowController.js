const WorkFlow = require("../models/WorkFlow");

exports.apiCreate = function (req, res) {
  let workflow = new WorkFlow(req.body, req.apiUser._id);
  workflow
    .create()
    .then(function (newId) {
      res.json(newId);
    })
    .catch(function (errors) {
      res.json(errors);
    });
  //console.log(res);
};

exports.apiUpdate = function (req, res) {
  let workflow = new WorkFlow(req.body, req.apiUser._id, req.params.id);
  workflow
    .update()
    .then((status) => {
      // the post was successfully updated in the database
      // or user did have permission, but there were validation errors
      if (status == "success") {
        res.json("success");
      } else {
        res.json("failure");
      }
    })
    .catch((e) => {
      // a post with the requested id doesn't exist
      // or if the current visitor is not the owner of the requested post
      res.json("no permissions");
    });
};
// to delete single workflow uncommente by sanket
exports.apiDelete = function (req, res) {
  WorkFlow.delete(req.params.id, req.apiUser._id)
    .then(() => {
      res.json("Success");
    })
    .catch((e) => {
      res.json("You do not have permission to perform that action.");
    });
};

exports.search = function (req, res) {
  WorkFlow.search(req.workflow.searchTerm)
    .then((workflows) => {
      res.json(workflows);
    })
    .catch((e) => {
      res.json([]);
    });
};

exports.reactApiViewSingle = async function (req, res) {
  try {
    let workflow = await WorkFlow.findSingleById(req.params.id, 0);
    res.json(workflow);
  } catch (e) {
    res.json(false);
  }
};
