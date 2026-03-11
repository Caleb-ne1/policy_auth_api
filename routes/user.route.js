const express = require("express");
const userController = require("../controllers/userController")
const router = express.Router();


router.post('/create', userController.registerUser);
router.delete('/delete', userController.deleteUser);

module.exports = router