const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  esAdmin: { type: String,enum:['user', 'admin'], default: 'user'},
});

module.exports = (connection) => connection.model('Usuario', userSchema)
/* exports.Usuario = mongoose.model("Usuario", userSchema); */