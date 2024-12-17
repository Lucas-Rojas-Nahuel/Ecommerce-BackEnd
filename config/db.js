const mongoose = require('mongoose');

const db2 = mongoose.createConnection(process.env.CONNECTION_STRING_DBMILI);
const db1 = mongoose.createConnection(process.env.CONNECTION_STRING_DBLEO);


db1.once("open", () => console.log("Conexión a DB1 exitosa"));
db2.once("open", () => console.log("Conexión a DB2 exitosa"));

module.exports = {db1, db2}