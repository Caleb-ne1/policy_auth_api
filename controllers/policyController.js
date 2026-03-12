const policyService = require("../services/policyService");


// create policy
const createPolicy = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newPolicy = await policyService.createPolicy(name, description);

        res.status(201).json({message: "Policy created successfully", data: newPolicy});

    } catch (err) {
        if(err.message === "NameRequired") {
            return res.status(400).json({success: false, error: "Policy name required"});
        }

        if(err.message === "PolicyFound") {
            return res.status(400).json({success: false, error: "Policy already exists"});
        }

        if(err.message) {
            return res.status(400).json({success: false, error: err.message})
        }

        res.status(500).json({success: false, message: "Internal server error", error: err.message});
    }
}

const editPolicy = async (req, res) => {
    try {
        const policyId = req.query.id;
        const updates = req.body;

        const results = await policyService.editPolicy(policyId, updates);

        res.status(200).json({ results });

    } catch (err) {
        if(err.message === "IdRequired") {
            return res.status(400).json({error: err.message});
        }

        if(err.message === "PolicyNotFound") {
            return res.status(400).json({error: err.message});
        }

        if(err.message === "PolicyExists") {
            return res.status(400).json({success: false, error: err.message});
        }

        if(err.message) {
            return res.status(400).json({success: false, error: err.message});
        }

        res.status(500).json({ success: false, message: "Internal server error", error: err.message});
    }
}

// asign policy to role
const assignPolicyToRole = async (req, res) => {
    try {
        const roleId = req.params.roleId;
        const { policyId } = req.body;

        const results = await policyService.assignPolicyToRole(roleId, policyId);

        res.status(201).json({ 
            success: true, 
            message: "Policy assigned to role successfully", 
            data: results 
        });
    } catch (err) {

        if(err.message === "roleId/policyId required") {
            return res.status(400).json({ 
                success: false, 
                message: "roleId and policyId required"
            });
        }

        if(err.message === "RoleNotFound") {
            return res.status(400).json({ 
                success: false, 
                message: "Role not found"
            });
        }

        if (err.message === "PolicyNotFound") {
            return res.status(400).json({ 
                success: false, 
                message: "Policy not found"});
        }

        if (err.message === "PolicyAlreadyAssigned") {
            return res.status(400).json({ 
                success: false, 
                message: "Policy is already assigned to this role"
            });
        }

        return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        
    }
}


// List all policies for role
const getRolePolicies = async (req, res) => {
    try {
        const roleId = req.params.roleId;

        const results = await policyService.getRolePolicies(roleId);

        res.status(200).json(results);

    } catch (err) {
        if (err.message === "RoleIdRequired") {
            return res.status(400).json({ success: false, message: "Role Id required"});
        }

        if (err.message === "RoleNotFound") {
            return res.status(400).json({ success: false, message: "Role Not Found"});
        }

        return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
    }
}
module.exports = { createPolicy, editPolicy, assignPolicyToRole, getRolePolicies }