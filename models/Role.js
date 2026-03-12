const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
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
        timestamps: true
    })

     Role.associate = (models) => {
        Role.hasMany(models.User, { foreignKey: "roleId" });
        
        Role.belongsToMany(models.Policy, {
            through: models.RolePolicy, 
            foreignKey: "roleId",
            otherKey: "policyId"         
        });
    };

    return Role;
}