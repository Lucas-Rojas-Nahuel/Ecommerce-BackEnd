const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  marca: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  descripcion: { type: String, required: true },
  imagen: [{ type: String }],
  fechaIngreso: { type: Date, default: Date.now },
});
productSchema.methods.setImgUrl = function setImgUrl(filename) {
  /* this.imagen = ${process.env.APP_HOST}:${process.env.PORT}/public/${filename}; */
};

module.exports = (connection) => connection.model("Products", productSchema);
/*   exports.Producto = mongoose.model("Producto", productSchema); */
