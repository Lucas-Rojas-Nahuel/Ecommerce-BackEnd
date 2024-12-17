const { Router } = require("express");
const producto = require("../modelos/producto");
const usuario = require("../modelos/usuario");
const ordenProducto = require("../modelos/orden-producto");
const connection1 = require("../config/db").db1;
const connection2 = require("../config/db").db2;
const Orden = require("../modelos/orden")(connection1);
const Producto = require("../modelos/producto")(connection2);
const OrdenProducto = require("../modelos/orden-producto")(connection1);

const routerOrdenes = Router();

async function vaciar() {
  const resultado = await Orden.deleteMany({});
  console.log(resultado);
}

/* vaciar() */

routerOrdenes.get("/", async (req, res) => {
  try {
    const listaOrdenes = await Orden.find().populate("usuario");
    if (!listaOrdenes.length) throw new Error("No hay listas de ordenes");
    /* if (!listaOrdenes.length) {
      res.status(500).json({ success: false });
    } */
    res.send(listaOrdenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

routerOrdenes.get("/:id", async (req, res) => {
  const orden = await Orden.find({ usuario: req.params.id })
    .populate("usuario")
    .populate("productosEnOrden");
  if (!orden) {
    res.status(500).json({ success: false });
  }
  res.send(orden);
});

routerOrdenes.post("/", async (req, res) => {
  const productosEnOrdenIds = await Promise.all(
    req.body.productosEnOrden.map(async (OrdenProduct) => {
      const newOrdenProducto = new OrdenProducto({
        cantidad: OrdenProduct.cantidad,
        producto: OrdenProduct.producto,
      });
      const savedOrdenProducto = await newOrdenProducto.save();

      return savedOrdenProducto._id;
    }),
  );

  const preciosTotales = await Promise.all(
    productosEnOrdenIds.map(async (ordenProductoId) => {
      try {
        const ordenProducto = await OrdenProducto.findById(ordenProductoId);

        if (!ordenProducto) throw new Error("OrdenProducto no encontrado");

        //Consultar manual del producto  relacionado desde db2
        const producto = await Producto.findById(ordenProducto.producto);

        if (!producto) throw new Error("Producto no encontrado");

        return producto.precio * ordenProducto.cantidad;
      } catch (error) {
        console.error(
          "Error al calcular el precio de la orden-producto:",
          error,
        );
        return 0;
      }
    }),
  );

  const importeTotal = preciosTotales.reduce((a, b) => a + b, 0);

  const nuevaOrden = new Orden({
    usuario: req.body.usuario,
    productosEnOrden: productosEnOrdenIds,
    direccion: req.body.direccion,
    ciudad: req.body.ciudad,
    localidad: req.body.localidad,
    codigoPostal: req.body.codigoPostal,
    telefono: req.body.telefono,
    importe: importeTotal,
  });
  const savedOrden = await nuevaOrden.save();

  if (!savedOrden) return res.status(400).send("La orden no pudo ser creada!");

  res.send(savedOrden);
});

routerOrdenes.put("/:id", async (req, res) => {
  const orden = await Orden.findByIdAndUpdate(
    req.params.id,
    {
      usuario: req.body.usuario,
      productosEnOrden: req.body.productosEnOrden,
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      localidad: req.body.localidad,
      codigoPostal: req.body.codigoPostal,
      telefono: req.body.telefono,
      importe: req.body.importe,
    },
    { new: true },
  );

  if (!orden) return res.status(400).send("La orden no se pudo actualizar!");

  res.send(orden);
});

routerOrdenes.delete("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    // Buscar y eliminar la orden
    const orden = await Orden.findOneAndDelete(req.params.id);
    console.log(orden);
    if (orden) {
      //eliminar todos los productos asociados a la orden
      if (orden.productosEnOrden && orden.productosEnOrden.length > 0) {
        await Promise.all(
          orden.productosEnOrden.map(async (ordenProducto) => {
            await OrdenProducto.findByIdAndDelete(ordenProducto);
          }),
        );
      }
      return res
        .status(200)
        .json({ success: true, message: "La orden fue borrada!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
  /* Orden.findOneAndDelete(req.params.id)
    .then(async (orden) => {
      
      if (orden) {
        console.log(await orden.productosEnOrden.map(async (ordenProducto) => {
          await OrdenProducto.findByIdAndRemove(ordenProducto);
        }))
        await orden.productosEnOrden.map(async (ordenProducto) => {
          await OrdenProducto.findByIdAndRemove(ordenProducto);
        });
        return res
          .status(200)
          .json({ success: true, message: "La orden fue borrada!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Orden no encontrada!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });  */
});

module.exports = routerOrdenes;
