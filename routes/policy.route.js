const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");

router.post("/create", policyController.createPolicy);
router.put("/edit", policyController.editPolicy);

module.exports = router;