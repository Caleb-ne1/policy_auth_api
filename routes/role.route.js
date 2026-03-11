const express = require("express");
const roleController = require("../controllers/roleController")
const router = express.Router();

router.post("/create", roleController.createRole);
router.put("/edit", roleController.updateRole);
router.delete("/delete", roleController.deleteRole);
router.get("/get-roles", roleController.getAllRoles);

module.exports = router;