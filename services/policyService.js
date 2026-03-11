const { Policy } = require("../models");


// create policy
exports.createPolicy = async (name, description) => {
    if(!name) throw new Error("NameRequired");

    // check if policy already exists
    const policy = await Policy.findOne({where: { name }});

    if(policy) throw new Error("PolicyFound");

    // save policy 
    const newPolicy = await Policy.create({
        name,
        description
    })

    return newPolicy;
}

// edit policy
exports.editPolicy = async (policyId, updates) => {

    if(!policyId) throw new Error("IdRequired");

    const policy = await Policy.findOne({ where: { id: policyId}})

    if (!policy) throw new Error("PolicyNotFound");

    if(updates.name && updates.name !== policy.name) {
        const existingPolicy = await Policy.findOne({ where: { name: updates.name}});
        if(existingPolicy) throw new Error("PolicyExists");
    }

    await Policy.update(updates, {
        where: { id: policyId}
    });

    return { message: "Policy updated successfully"}
}