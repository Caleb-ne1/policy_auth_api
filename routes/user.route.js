const express = require("express");
const userController = require("../controllers/userController")
const  authenticate = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");

const router = express.Router();


router.post('/create', authenticate, authorize('create_user'), userController.registerUser);
router.delete('/delete', userController.deleteUser);
router.post('/login', userController.login);
router.get('/profile', authenticate, userController.profile);

module.exports = router