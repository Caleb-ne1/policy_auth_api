const express = require("express");
const roleController = require("../controllers/roleController")
const policyController = require("../controllers/policyController")
const router = express.Router();

router.post("/create", roleController.createRole);
router.put("/edit", roleController.updateRole);
router.delete("/delete", roleController.deleteRole);
router.get("/get-roles", roleController.getAllRoles);

// assign single policy
router.post("/:roleId/policies", policyController.assignPolicyToRole);
router.get("/:roleId/policies", policyController.getRolePolicies);

module.exports = router;