const express = require("express");
const {checkAuth} = require("../middleware/auth");
const mongodb = require("mongodb");

const path = require("path");
const storiesCollection = require("../models/stories");
const usersCollection = require("../models/users");

const router = express.Router();

async function getStoryInfo(storyObject) {
    const {authorId} = storyObject;
    const authorUser = await (await usersCollection).findOne({_id: new mongodb.ObjectId(authorId)});
    return {
        ...storyObject,
        author: authorUser,
    }
}

router.get("/", checkAuth, async (req, res) => {
    const stories = await (await storiesCollection).find({status: "public"}).toArray();
    const curUser = await req.user;
    const storiesWithUsers = await Promise.all(stories.map(story => getStoryInfo(story)));
    res.render(path.join(__dirname, "..", "views", "stories", "stories.ejs"), {
        layout: path.join(__dirname, "..", "views", "layout", "main.ejs"),
        stories: storiesWithUsers,
        curUser,
    });
});

router.get("/add", checkAuth, (req, res) => {
    res.render(path.join("..", "views", "stories", "add.ejs"), {
        layout: path.join("..", "views", "layout", "main.ejs"),
    });
});

router.post("/add", checkAuth, async (req, res) => {
    try {
        const user = await req.user;
        const authorId = new mongodb.ObjectId(user._id);
        const {title, body, status} = req.body;
        const createdAt = new Date();
        const story = {title, body, status, createdAt, authorId};
        await (await storiesCollection).insertOne(story);
        res.redirect("/dashboard");
    } catch (e) {
        console.error(e.errInfo.details.schemaRulesNotSatisfied);
    }
});

router.get("/:id", checkAuth, async (req, res) => {
    try {
        const curStoryId = req.params.id;
        const curUser = await req.user;
        let curStory = await (await storiesCollection).findOne({_id: new mongodb.ObjectId(curStoryId)});
        curStory = await getStoryInfo(curStory);
        // Mismatches.
        if (!curStory) res.status(404).redirect("/dashboard");
        else if (curStory.authorId.toString() !== curUser._id.toString() && curStory.status === "private") {
            res.status(403).redirect("/dashboard");
        }
        res.render(path.join(__dirname, "..", "views", "stories", "edit.ejs"), {
            layout: path.join(__dirname, "..", "views", "layout", "main.ejs"),
            story: curStory,
        });
    } catch (e) {
        console.error(e);
    }
});

router.get("/view/:id", checkAuth, async (req, res) => {
    try {
        const curStoryId = req.params.id;
        const curUser = await req.user;
        const curStory = await (await storiesCollection).findOne({_id: new mongodb.ObjectId(curStoryId)});
        // Mismatches.
        if (!curStory) res.status(404).redirect("/dashboard");
        else if (curStory.authorId.toString() !== curUser._id.toString()) {
            res.status(403).redirect("/dashboard");
        }
        res.render(path.join(__dirname, "..", "views", "stories", "edit.ejs"), {
            layout: path.join(__dirname, "..", "views", "layout", "main.ejs"),
            story: curStory,
        });
    } catch (e) {
        console.error(e);
    }
});

router.put("/edit/:id", checkAuth, async (req, res) => {
    try {
        const curStoryId = new mongodb.ObjectId(req.params.id);
        const curUser = await req.user;
        const curStory = await (await storiesCollection).findOne({_id: curStoryId});
        // Mismatches.
        if (!curStory) res.status(404).redirect("/dashboard");
        else if (curStory.authorId.toString() !== curUser._id.toString()) {
            res.status(403).redirect("/dashboard");
        }
        const {title, body, status} = req.body;
        await (await storiesCollection).updateOne({_id: curStoryId}, {
            $set: {title, body, status},
        });
        res.redirect("/dashboard");
    } catch (e) {
        console.error(e);
    }
});

router.delete("/delete/:id", checkAuth, async (req, res) => {
    try {
        const curStoryId = new mongodb.ObjectId(req.params.id);
        const curUser = await req.user;
        const curStory = await (await storiesCollection).findOne({_id: curStoryId});
        if (!curStory) res.status(404).redirect("/dashboard");
        else if (curStory.authorId.toString() !== curUser._id.toString()) {
            res.status(403).redirect("/dashboard");
        }
        await (await storiesCollection).deleteOne({_id: curStoryId});
        res.redirect("/dashboard");
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;