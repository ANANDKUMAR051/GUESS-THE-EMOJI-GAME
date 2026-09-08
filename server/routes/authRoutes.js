const router = require("express").Router();
const controller = require("../controllers/authController");
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/me", controller.me);
module.exports = router;
