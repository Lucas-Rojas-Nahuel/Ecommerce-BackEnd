const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  usuario: { type: String, required: true },
  productosEnOrden: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrdenProductos", required: true }],
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  localidad: { type: String, required: true },
  codigoPostal: { type: Number, required: true },
  telefono: { type: Number },
  importe: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  });

 module.exports = (connection) =>connection.model("Ordens", orderSchema);