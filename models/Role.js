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
    return Role;
}