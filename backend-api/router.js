const apiRouter = require("express").Router()
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const followController = require("./controllers/followController")
const stepsController = require("./controllers/stepsController")
const masterController = require("./controllers/masterController")
const siteController = require("./controllers/siteController")
const plantController = require("./controllers/plantController")
const cors = require("cors")
const workFlowController = require("./controllers/workflowController")

const logbookController = require("./controllers/logbookController")

apiRouter.use(cors())

apiRouter.get("/", (req, res) => res.json("Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's continue learning React!"))

// check token to log out front-end if expired
apiRouter.post("/checkToken", userController.checkToken)

apiRouter.post("/getHomeFeed", userController.apiMustBeLoggedIn, userController.apiGetHomeFeed)
apiRouter.post("/register", userController.apiRegister)
apiRouter.post("/login", userController.apiLogin)
// apiRouter.get("/post/:id", postController.reactApiViewSingle);
// apiRouter.post(
//   "/post/:id/edit",
//   userController.apiMustBeLoggedIn,
//   postController.apiUpdate
// );
// apiRouter.delete(
//   "/post/:id",
//   userController.apiMustBeLoggedIn,
//   postController.apiDelete
// );
// apiRouter.post(
//   "/create-post",
//   userController.apiMustBeLoggedIn,
//   postController.apiCreate
// );
apiRouter.post("/search", postController.search)

apiRouter.post("/doesUsernameExist", userController.doesUsernameExist)
apiRouter.post("/doesEmailExist", userController.doesEmailExist)

// profile related routes
apiRouter.post("/profile/:username", userController.ifUserExists, userController.sharedProfileData, userController.profileBasicData)

apiRouter.get("/profile/:username/steps", userController.ifUserExists, userController.apiGetStepsByUsername)
apiRouter.get("/profile/:username/followers", userController.ifUserExists, userController.profileFollowers)
apiRouter.get("/profile/:username/following", userController.ifUserExists, userController.profileFollowing)

// follow routes
apiRouter.post("/addFollow/:username", userController.apiMustBeLoggedIn, followController.apiAddFollow)
apiRouter.post("/removeFollow/:username", userController.apiMustBeLoggedIn, followController.apiRemoveFollow)

// step related routes
// apiRouter.post(
//   "profile/steps/:username",
//   userController.ifUserExists,
//   userController.sharedProfileData,
//   userController.profileBasicData
// );

apiRouter.post("/create-step", userController.apiMustBeLoggedIn, stepsController.apiCreate)
apiRouter.get("/step/:id", stepsController.reactApiViewSingle)
apiRouter.post("/step/:id/edit", userController.apiMustBeLoggedIn, stepsController.apiUpdate)
apiRouter.delete("/step/:id", userController.apiMustBeLoggedIn, stepsController.apiDelete)
apiRouter.post("/create-workflow", userController.apiMustBeLoggedIn, workFlowController.apiCreate)
apiRouter.get("/workflow/:id", workFlowController.reactApiViewSingle)

apiRouter.get("/profile/:username/workflow", userController.ifUserExists, userController.apiGetWorkflowByUsername)
apiRouter.post("/workflow/:id/edit", userController.apiMustBeLoggedIn, workFlowController.apiUpdate)

// Master related routes
apiRouter.post("/masterEntry", masterController.apiCreateMaster)
apiRouter.get("/master-table", masterController.getData)
apiRouter.delete("/delete-master-record/:id", masterController.deleteRecord)
apiRouter.put("/master-update/:id", masterController.updateRecord)

// Master Configuration (sites)
apiRouter.post("/create-site", siteController.apiCreateSite)
apiRouter.get("/get-sites", siteController.getData)
apiRouter.put("/site-update/:id", siteController.updateRecord)
apiRouter.delete("/delete-site-record/:id", siteController.deleteRecord)

// Mastrer configuration (plant)
apiRouter.post("/create-plant", plantController.apiCreatePlant)

module.exports = apiRouter
apiRouter.get("/profile/:username/workflow", userController.ifUserExists, userController.apiGetWorkflowByUsername)
apiRouter.post("/workflow/:id/edit", userController.apiMustBeLoggedIn, workFlowController.apiUpdate)
apiRouter.delete("/workflow/:id", userController.apiMustBeLoggedIn, workFlowController.apiDelete)
apiRouter.post("/create-logbook", userController.apiMustBeLoggedIn, logbookController.apiCreate)
apiRouter.get("/profile/:username/logbook", userController.ifUserExists, userController.apiGetLogbookByUsername)
module.exports = apiRouter
