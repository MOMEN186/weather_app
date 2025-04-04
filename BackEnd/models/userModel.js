const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


// Define the User model
const User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensures the email is valid
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;