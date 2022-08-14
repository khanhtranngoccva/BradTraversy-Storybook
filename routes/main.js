const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");
const {checkAuth, checkGuest} = require("../middleware/auth");

/**
 * @desc Login layout
 * */
router.get("/", checkGuest, (req, res) => {
    res.render(path.join(__dirname, "..", "views", "login.ejs"), {
        data: "Login",
        layout: path.join(__dirname, "..", "views", "layout", "login.ejs"),
    });
});

router.get("/dashboard", checkAuth, (req, res) => {
    res.render(path.join(__dirname, "..", "views", "dashboard.ejs"), {
        layout: path.join(__dirname, "..", "views", "layout", "main.ejs"),
    });
});

module.exports = router;