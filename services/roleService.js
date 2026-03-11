const { where } = require("sequelize");
const { Role } = require("../models");


// create role
exports.addRole = async (name, description) => {

    if(!name) throw new Error("Role name required");

    // check if role already exists
    const role = await Role.findOne({ where: { name }});

    if (role) throw new Error("RoleExists");

    const newRole = await Role.create({
        name,
        description
    })

    return newRole
}

// edit role 
exports.editRole = async (roleId, updates) => {
    const role = await Role.findOne({ where: { id: roleId }});

    if(!role) throw new Error("RoleNotFound");


    if(updates.name && updates.name === !role.name) {
        const existingRole = await Role.findOne({ where: { name: updates.name}});
        if(existingRole) throw new Error('RoleExists');
    }

    await Role.update(updates, {
        where: { id: roleId}
    })

    return { message: "Role updated successfully" };

}

// list roles
exports.listAllRoles = async () => {
    const roles = await Role.findAll();

    return roles;

}

// delete role
exports.deleteRole = async (roleId) => {

    if (!roleId) throw new Error("RoleIdRequired");

    // check if role with same id exist 
    const role = await Role.findByPk(roleId);

    if(!role) throw new Error("RoleNotFound");

    await role.destroy();

    return { message : "Role deleted successfully"};

}