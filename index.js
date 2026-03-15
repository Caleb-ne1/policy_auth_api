require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express()
// cors
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// import models
const db = require("./models");
const { RolePolicy, Role, Policy } = require("./models");

RolePolicy.belongsTo(Policy, { foreignKey: "policyId", as: "Policy" });
RolePolicy.belongsTo(Role, { foreignKey: "roleId", as: "Role" });

Role.hasMany(RolePolicy, { foreignKey: "roleId" });
Policy.hasMany(RolePolicy, { foreignKey: "policyId" });

//middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Policy api running");
})

// routes
const userRoute = require("./routes/user.route");
app.use("/api/user", userRoute);

const roleRoute = require("./routes/role.route");
app.use("/api/roles", roleRoute);

const policyRoute = require("./routes/policy.route");
app.use("/api/policy", policyRoute);

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