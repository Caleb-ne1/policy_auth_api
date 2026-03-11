const userService = require("../services/userService");


// register use
const registerUser = async (req, res) => {
    
    try {
        const {email, password} = req.body;

        const user = await userService.addUser(email, password);

        res.status(201).json({ message: 'User created successfully', user })

    } catch (err) {

        if (err.message === "EmailRequired") {
            return res.status(400).json({ error: 'Email required'});
        } 

        if (err.message === "PasswordRequired") {
            return res.status(400).json({error: 'Password required'});
        }

        if (err.message === 'UserExists') {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        return res.status(500).json({ error: err.message });
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

        res.status(200).json(result);

    } catch (err) {
        if (err.message === 'UserNotFound') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: err.message });
    }
}
module.exports = { registerUser, deleteUser }