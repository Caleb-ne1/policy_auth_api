const userService = require("../services/userService");


// register user
const registerUser = async (req, res) => {
    
    try {
        const {email, password} = req.body;

        const user = await userService.addUser(email, password);

        res.status(201).json({ success: true, message: 'User created successfully', data: user })

    } catch (err) {

        if (err.message === "EmailRequired") {
            return res.status(400).json({ success: false, error: 'Email required'});
        } 

        if (err.message === "PasswordRequired") {
            return res.status(400).json({ success: false, error: 'Password required'});
        }

        if (err.message === 'UserExists') {
            return res.status(400).json({ success: false, error: 'User with this email already exists' });
        }

        if(err.message === "RoleRequired") {
            return res.status(400).json({ success: false, error: "Role required" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
}

// delete user 
const deleteUser = async (req, res) => {
    try {
        const userId  = req.query.id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }


        const result = await userService.deleteUser(userId);

        res.status(200).json({success: true, data: result});

    } catch (err) {
        if (err.message === 'UserNotFound') {
            return res.status(404).json({success: false, error: 'User not found' });
        }


        if (err.message) {
            return res.status(400).json({ success: false, error: err.message })
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { registerUser, deleteUser }