const express = require('express');
const router = express.Router();
const Orden = require('../modelos/orden'); // Asegúrate de ajustar las rutas según la estructura de tu proyecto
const OrdenProducto = require('../modelos/orden-producto'); // Asegúrate de ajustar las rutas según la estructura de tu proyecto

router.post('/', async (req, res) => {
  try {
    const payment = req.body;

    // Verificar el estado del pago
    if (payment.status === 'approved') {
      // Procesar pago aprobado
      console.log(`Pago aprobado para la orden: ${payment.external_reference}`);
    } else if (payment.status === 'failure') {
      // Procesar pago fallido y eliminar orden
      const ordenId = payment.external_reference;
      const orden = await Orden.findByIdAndDelete(ordenId);
      
      if (orden) {
        // Eliminar todos los productos asociados a la orden
        if (orden.productosEnOrden && orden.productosEnOrden.length > 0) {
          await Promise.all(
            orden.productosEnOrden.map(async (ordenProducto) => {
              await OrdenProducto.findByIdAndDelete(ordenProducto);
            }),
          );
        }
        console.log(`Pago fallido, orden cancelada: ${ordenId}`);
      } else {
        console.log(`Orden no encontrada: ${ordenId}`);
      }
    } else if (payment.status === 'pending') {
      // Procesar pago pendiente
      console.log(`Pago pendiente para la orden: ${payment.external_reference}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en el webhook:', error.message);
    res.status(500).send('Error en el webhook');
  }
});

module.exports = router;
