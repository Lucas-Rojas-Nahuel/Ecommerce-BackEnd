const mongoose = require("mongoose"); 


const orderItemSchema = new mongoose.Schema({
  cantidad: { type: Number, required: true },
  producto: { type: mongoose.Schema.Types.ObjectId , ref: "Products", required: true },
  });

 
module.exports =(connection)=> connection.model("OrdenProductos", orderItemSchema); 