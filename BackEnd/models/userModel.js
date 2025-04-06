const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


// Define the User model
const User = sequelize.define("users", {
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

const blackList = sequelize.define("blackList", {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }
})

User.hasMany(blackList, { foreignKey: "userId", onDelete: "CASCADE" });
blackList.belongsTo(User, { foreignKey: "userId" });


module.exports = {User,blackList};