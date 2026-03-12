const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true
    })

    User.associate = (models) => {
      User.belongsTo(models.Role, { foreignKey: "roleId" });
    };

    return User;
}
