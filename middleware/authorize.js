const { Policy, RolePolicy } = require("../models")


exports.authorize = (...requiredPolicies) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            const rolePolicies = await RolePolicy.findAll({
                where: { roleId: user.roleId },
                include: [
                    {
                        model: Policy,
                        as: "Policy",
                        attributes: ['name']
                    }
                ]
            });

            // extract policy 
            const userPolicies = rolePolicies.map(rp => rp.Policy?.name);

            const hasPolicy = requiredPolicies.some(policy => 
                userPolicies.includes(policy)
            );

            if (!hasPolicy) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}