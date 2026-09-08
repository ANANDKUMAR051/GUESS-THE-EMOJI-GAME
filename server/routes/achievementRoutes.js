const router = require("express").Router();
const controller = require("../controllers/achievementController");
router.get("/:userId", controller.get);
router.post("/update", controller.update);
module.exports = router;
