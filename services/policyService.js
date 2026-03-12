const { Policy, Role, RolePolicy } = require("../models");

// create policy
exports.createPolicy = async (name, description) => {
  if (!name) throw new Error("NameRequired");

  // check if policy already exists
  const policy = await Policy.findOne({ where: { name } });

  if (policy) throw new Error("PolicyFound");

  // save policy
  const newPolicy = await Policy.create({
    name,
    description,
  });

  return newPolicy;
};

// edit policy
exports.editPolicy = async (policyId, updates) => {
  if (!policyId) throw new Error("IdRequired");

  const policy = await Policy.findOne({ where: { id: policyId } });

  if (!policy) throw new Error("PolicyNotFound");

  if (updates.name && updates.name !== policy.name) {
    const existingPolicy = await Policy.findOne({
      where: { name: updates.name },
    });
    if (existingPolicy) throw new Error("PolicyExists");
  }

  await Policy.update(updates, {
    where: { id: policyId },
  });

  return { message: "Policy updated successfully" };
};

// assign policy to a role
exports.assignPolicyToRole = async (roleId, policyId) => {
  // verify fiels roleId and policyId if its empty
  if (!roleId || !policyId) throw new Error("roleId/policyId required");

  // verify if role exists
  const role = await Role.findByPk(roleId);

  if (!role) throw new Error("RoleNotFound");

  // verify if policy exists
  const policy = await Policy.findByPk(policyId);

  if (!Policy) throw new Error("PolicyNotFound");

  // find is policy is already assigned
  const existingAssignment = await RolePolicy.findOne({
    where: { roleId, policyId },
  });

  if (existingAssignment) throw new Error("PolicyAlreadyAssigned");

  // create assignment
  const assignment = await RolePolicy.create({
    roleId,
    policyId,
  });

  return assignment;
};


// List all policies for role
exports.getRolePolicies = async (roleId) => {

    if(!roleId) throw new Error("RoleIdRequired");
    
    const role = await Role.findByPk(roleId, {
        include: [
            {
                model: Policy,
                through: { attributes: [] },
                attributes: ["id", "name", "description", "createdAt", "updatedAt"],
            },
        ],
    });

    if (!role) {
        throw new Error("RoleNotFound");
    }

    return {
        success: true,
        data: role.Policies || [],
    };
};