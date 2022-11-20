const Sequelize = require('sequelize');

const db = new Sequelize("sistema_crud", "postgres", "cocobacilos2044", {
    host: "177.44.248.56",
    dialect: "postgres",
    port: 5432
});

db.sync();

module.exports = db;
