const policyService = require("../services/policyService");


// create policy
const createPolicy = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newPolicy = await policyService.createPolicy(name, description);

        res.status(201).json({message: "Policy created successfully", policy: newPolicy});

    } catch (err) {
        if(err.message === "NameRequired") {
            return res.status(400).json({error: "Policy name required"});
        }

        if(err.message === "PolicyFound") {
            return res.status(400).json({error: "Policy already exists"});
        }

        if(err.message) {
            return res.status(400).json({error: err.message})
        }

        res.status(500).json({error: "Unknown error occured"});
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
            return res.status(400).json({error: err.message});
        }

        if(err.message) {
            return res.status(400).json({error: err.message});
        }

        res.status(500).json({error: "Unkown error occured"});
    }
}

module.exports = { createPolicy, editPolicy }