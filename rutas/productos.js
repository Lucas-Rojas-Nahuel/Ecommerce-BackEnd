const { Router } = require("express");
const {db2} = require('../config/db');
const  Producto  = require("../modelos/producto")(db2);
const routerProductos = Router();
const mongoose = require("mongoose");
const upload = require("../config/storage");


routerProductos.get("/", async (req, res) => {
  
  const listaProductos = await Producto.find();

  if (!listaProductos) {
    res.status(500).json({ success: false });
  }
  res.send(listaProductos);
});

routerProductos.get("/:id", async (req, res) => {
  const producto = await Producto.findById(req.params.id);

  if (!producto) {
    res.status(500).json({ success: false });
  }
  res.send(producto);
});

/* routerProductos.post("/", async (req, res) => {

  let producto = new Producto({
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    marca: req.body.marca,
    precio: req.body.precio,
    stock: req.body.stock,
    imagen: req.body.imagen,
  });

  producto = await producto.save();

  if (!producto) return res.status(500).send("El producto no pudo ser creado!");

  res.send(producto);
}); */

routerProductos.post("/", upload.array("imagen", 5), async (req, res) => {
  if (!req.files) {
    return res.status(400).send({ Error: "No se ha subido ningún archivo." });
  }
  const files = req.files;
  let imagenesUrls = [];
  if (files) {
    imagenesUrls = files.map((file) => {
      const filename = file.filename; // Obtenemos el filename de cada archivo
      return `https://compugamer.up.railway.app/public/${filename}`;
    });

    let producto = new Producto({
      nombre: req.body.nombre,
      categoria: req.body.categoria,
      marca: req.body.marca,
      precio: req.body.precio,
      stock: req.body.stock,
      descripcion: req.body.descripcion,
      imagen: imagenesUrls,
    });

    await producto.validate();
    await producto.save();

    if (!producto)
      return res.status(500).send("El producto no pudo ser creado!");

    res.send(producto);
  }
});

routerProductos.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("ID de producto invalido!");
  }

  const producto = await Producto.findByIdAndUpdate(
    req.params.id,
    {
      nombre: req.body.nombre,
      categoria: req.body.categoria,
      marca: req.body.marca,
      precio: req.body.precio,
      stock: req.body.stock,
      imagen: req.body.imagen,
    },
    { new: true },
  );

  if (!producto)
    return res.status(500).send("El producto no pudo ser actualizado!");

  res.send(producto);
});

routerProductos.delete("/:id", (req, res) => {
  Producto.findOneAndDelete(req.params.id)
    .then((producto) => {
      if (producto) {
        return res
          .status(200)
          .json({ success: true, message: "El producto fue borrado!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Producto no encontrado!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
}); 

module.exports = routerProductos;