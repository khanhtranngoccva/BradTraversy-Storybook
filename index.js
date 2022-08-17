const {app} = require("./server");

app.use("/", require("./routes/main.js"));
app.use("/auth", require("./routes/auth.js"));
app.use("/stories", require("./routes/stories"));