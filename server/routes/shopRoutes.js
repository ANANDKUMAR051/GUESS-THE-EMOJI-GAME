const router = require("express").Router();
const controller = require("../controllers/shopController");
router.get("/", controller.items);
router.post("/buy", controller.buy);
module.exports = router;
