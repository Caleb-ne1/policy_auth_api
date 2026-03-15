const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// add user to database
exports.addUser = async (email, password) => {

    if (!email) throw new Error("EmailRequired");

    if(!password) throw new Error("PasswordRequired");

    const user = await User.findOne({where: { email }, attributes: { exclude: ["password"]}});

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

    const { password: _, ...safeUser} = newUser.toJSON();

    return safeUser;

}

// edit user role
exports.editUserRole = async (userId, newRoleId) => {
    if(!userId || !newRoleId ) {
        throw new Error("Required");
    } 
    // find the user
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("UserNotFound");
    }

    //  check if the role exists
    const role = await Role.findByPk(newRoleId);
    if (!role) {
        throw new Error("RoleNotFound");
    }


    user.roleId = newRoleId;
    await user.save();


    return {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        updatedAt: user.updatedAt
    };
};


// login user details
exports.login = async (email, password) => {

    if(!email) throw new Error("Email required");
    if(!password) throw new Error("Password required");

    // check is user exists
    const user = await User.findOne({ where: { email }});

    if(!user) throw new Error("UserNotFound");

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) throw new Error("InvalidPassword");

    // generate token
    const token =  jwt.sign({
        userId: user.id,
        roleId: user.roleId
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

    return token;

}

// delete user
exports.deleteUser = async (userId) => {
    
    const user = await User.findByPk(userId);

    if(!user) throw new Error("UserNotFound");

    // delete user 
    await user.destroy();

    return { message : "User deleted successfully"};

}

// profile 
exports.fetchProfile = async (userId) => {
    
   if(!userId) throw new Error("UserIdRequired");

    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"]},
      include: [
        {
          model: Role,
          as: "Role",
          attributes: ["id", "name", "description"],
        },
      ],
    });
    if(!user) throw new Error("NotFound");

    return user;
}