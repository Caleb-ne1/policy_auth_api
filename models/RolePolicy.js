module.exports = (sequelize, DataTypes) => {
    const RolePolicy = sequelize.define('RolePolicy', {
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        policyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: "role_policies"
    })

    return RolePolicy;
}