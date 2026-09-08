const router = require("express").Router();
const controller = require("../controllers/gameController");
router.post("/save", controller.saveGame);
module.exports = router;
