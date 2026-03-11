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
    return Policy;
}