require('dotenv').config();

const express = require("express");


const app = express()
// import models
const db = require("./models");

//middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Policy api running");
})

// routes
const userRoute = require("./routes/user.route");
app.use("/api/user", userRoute);

const roleRoute = require("./routes/role.route");
app.use("/api/role", roleRoute);

const PORT = process.env.PORT || 5000

db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((err) => {
    console.error("Error syncing database:", err);
})