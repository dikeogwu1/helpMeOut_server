const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const { register, login, getCurrentUser } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", authentication, getCurrentUser);

module.exports = router;
