const { User, Role } = require('../models');
const bcrypt = require('bcrypt');

// add user to database
exports.addUser = async (email, password) => {

    if (!email) throw new Error("EmailRequired");

    if(!password) throw new Error("PasswordRequired");

    const user = await User.findOne({where: { email }});

    if(user) throw new Error("UserExists");

    // hash password 
    const hashPassword = await bcrypt.hash(password, 12);

    // default role 
    const defaultRoleName = process.env.DEFAULT_USER_ROLE;

    const defaultRole = await Role.findOne({ where: { name: defaultRoleName }})

    if(!defaultRole) throw new Error("RoleRequired");

    const newUser = await User.create({
        email,
        password: hashPassword,
        roleId: defaultRole.id
    });

    return newUser;

}


// edit user details

// edit user
exports.deleteUser = async (userId) => {
    
    const user = await User.findByPk(userId);

    if(!user) throw new Error("UserNotFound");

    // delete user 
    await user.destroy();

    return { message : "User deleted successfully"};

}