const express = require("express");
const userController = require("../controllers/userController")
const  authenticate = require("../middleware/authMiddleware");

const router = express.Router();


router.post('/create', userController.registerUser);
router.delete('/delete', userController.deleteUser);
router.post('/login', userController.login);
router.get('/profile', authenticate, userController.profile);

module.exports = router