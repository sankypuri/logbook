const Step = require("../models/Steps");

exports.apiCreate = function (req, res) {
  let step = new Step(req.body, req.apiUser._id);
  step
    .create()
    .then(function (newId) {
      res.json(newId);
    })
    .catch(function (errors) {
      res.json(errors);
    });
};

exports.apiUpdate = function (req, res) {
  let step = new Step(req.body, req.apiUser._id, req.params.id);
  step
    .update()
    .then((status) => {
      // the step was successfully updated in the database
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

exports.apiDelete = function (req, res) {
  Step.delete(req.params.id, req.apiUser._id)
    .then(() => {
      res.json("Success");
    })
    .catch((e) => {
      res.json("You do not have permission to perform that action.");
    });
};

exports.search = function (req, res) {
  Step.search(req.body.searchTerm)
    .then((steps) => {
      res.json(steps);
    })
    .catch((e) => {
      res.json([]);
    });
};

exports.reactApiViewSingle = async function (req, res) {
  try {
    let step = await Step.findSingleById(req.params.id, 0);
    res.json(step);
  } catch (e) {
    res.json(false);
  }
};
