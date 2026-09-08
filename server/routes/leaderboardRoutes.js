const router = require("express").Router();
const controller = require("../controllers/leaderboardController");
router.get("/", controller.getLeaderboard);
module.exports = router;
