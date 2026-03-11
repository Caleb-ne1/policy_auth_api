const roleService = require("../services/roleService");

// create role
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newRole = await roleService.addRole(name, description);

        res.status(201).json({ message: "role added successfully", newRole})

    } catch (err) {
        if (err.message === "RoleExists") {
            return res.status(400).json({ error: "Role already exists"});
        }

        res.status(500).json({ error: err.message || "Something went wrong"})
    }
}


// update role
const updateRole = async (req, res) => {
    try {
        const roleId = req.query.id;
        const updates = req.body;

        if (!updates.name) {
            return res.status(400).json({ error: "Name required"})
        }

        const updatedRole = await roleService.editRole(roleId, updates);

        res.status(200).json({ message: "Role updated successfully", updatedRole});

    } catch (err) {
        if(err.message === "RoleNotFound") {
            return res.status(404).json({ error: "Role not found"});
        }

        if(err.message === "RoleExists") {
            return res.status(400).json({ error: "Role already exists"});
        }

        res.status(500).json({ error: err.message });

    }
}

// get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.listAllRoles();

        res.status(200).json({ roles: roles});

    } catch (err) {
        if(err.message) {
            return res.status(400).json({error: err.message})
        }
        res.status(500).json({ error: "Unknown error occured"});
    }
}
// delete role
const deleteRole = async (req, res) => {
    try {
        const roleId = req.query.id;

        const result = await roleService.deleteRole(roleId);

        res.status(200).json({ message: result });

    } catch (err) {

        if(err.message === "RoleIdRequired") {
            res.status(400).json({ error: "Role ID required"});
        }

        if(err.message === "RoleNotFound") {
            res.status(404).json({ error: "Role not found"})
        }

        if(err.message) {
            res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: "Unknown error occured"})
        
    }
}

module.exports = { createRole, updateRole, deleteRole, getAllRoles }