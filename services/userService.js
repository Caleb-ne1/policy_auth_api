const { User } = require('../models');
const bcrypt = require('bcrypt');

// add user to database
exports.addUser = async (email, password) => {

    if (!email) throw new Error("EmailRequired");

    if(!password) throw new Error("PasswordRequired");

    const user = await User.findOne({where: { email }});

    if(user) throw new Error("UserExists");

    // hash password 
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
        email,
        password: hashPassword
    });

    return newUser;

}

// edit user
exports.deleteUser = async (userId) => {
    
    const user = await User.findByPk(userId);

    if(!user) throw new Error("UserNotFound");

    // delete user 
    await user.destroy();

    return { message : "User deleted successfully"};

}