const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongodb = require("mongodb");
const {ObjectId} = mongodb;
const userCollection = require("../models/users.js");

const passport = require("passport");
const {app} = require("../server");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            image: profile.photos?.[0]?.value,
            createdAt: new Date(),
        }
        let user = await (await userCollection).findOne({googleId: profile.id});
        if (!user) {
            user = await (await userCollection).insertOne(newUser);
        }
        done(null, user);
    } catch (e) {
        console.error(e);
    }
}));

// Think of session like a dictionary. To restore the logged in status, the user submits a
// token to check against the session dictionary. If an object is tied to the token, then the request is authorized,
// and the deserialize function runs to check the database for the user information that you can utilize.

// This function runs if the user is newly logged in, and
passport.serializeUser((user, done) => {
    console.log("Newly logged in");
    done(null, user._id);
});

// This function runs if the cookie access token can be used to get an ID from the session
// (that remembers the user logging in), and does not run if  .
passport.deserializeUser(async (id, done) => {
    console.log(id);
    let userCol = await userCollection;
    let user, error = null;
    try {
        user = userCol.findOne({_id: new ObjectId(id)});
    } catch (e) {
        error = e;
    }
    done(error, user);
});