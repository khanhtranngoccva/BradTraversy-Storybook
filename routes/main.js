const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");
const {checkAuth, checkGuest} = require("../middleware/auth");
const storiesCollection = require("../models/stories");
const mongodb = require("mongodb");

/**
 * @desc Login layout
 * */
router.get("/", checkGuest, (req, res) => {
    res.render(path.join(__dirname, "..", "views", "login.ejs"), {
        data: "Login",
        layout: path.join(__dirname, "..", "views", "layout", "login.ejs"),
    });
});

router.get("/dashboard", checkAuth, async (req, res) => {
    const stories = await storiesCollection;
    const userProfile = await req.user;
    try {
        const storiesCreatedByAuthor = await stories.find({authorId: new mongodb.ObjectId(userProfile._id)}).toArray();
        res.render(path.join(__dirname, "..", "views", "dashboard.ejs"), {
            layout: path.join(__dirname, "..", "views", "layout", "main.ejs"),
            userProfile,
            storiesCreatedByAuthor,
        });
    } catch (e) {
        console.error(e);
    }

});

module.exports = router;