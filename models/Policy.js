const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Policy = sequelize.define("Policy", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false       
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: "Policies"
    })

    Policy.associate = (models) => {
        Policy.belongsToMany(models.Role, {
            through: models.RolePolicy, 
            foreignKey: "policyId",
            otherKey: "roleId"           
        });
    };
    return Policy;
}