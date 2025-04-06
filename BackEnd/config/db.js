const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a Sequelize instance for the MySQL server (without specifying a database)
const sequelizeWithoutDB = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:3306`);


(async () => {
    try {
        // Ensure the database exists
        await sequelizeWithoutDB.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        console.log(`Database '${process.env.DB_NAME}' ensured.`);
    }   catch (error) {
        console.error("Error setting up the database:", error);
    }
})();

 // Initialize Sequelize for the specific database
 const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

// Sync the database schema
sequelize.sync({ alter: true })// Use `alter: true` to update the schema if it already exists
        .then(() => {
            console.log("Database synchronized successfully.");
        })
        .catch((error) => {
            console.error("Error synchronizing the database:", error);
        });

// Export a function to get the initialized Sequelize instance
module.exports =sequelize;