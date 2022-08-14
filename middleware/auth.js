module.exports = {
    checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log("User logged out.");
            res.redirect("/");
        }
    },
    checkGuest(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("User logged in.")
            res.redirect("/dashboard");
        } else {
            return next();
        }
    }
}