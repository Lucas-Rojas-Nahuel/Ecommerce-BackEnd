const { Router } = require("express");
const routerMercadoPago = Router();
require("dotenv").config();

//SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require("mercadopago");
// Agrega credenciales
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken:
`${process.env.TOKEN_MERCADO_PAGO}`,
});


routerMercadoPago.post("/", async (req, res) => {
  try {
    const {ordenId, productsList, idProducts} = req.body;
    
    const body = {
      items: productsList.map((item) => ({
        title: item.nombre,
        quantity: item.quantity,
        unit_price: item.precio,
        currency_id: "ARS",
      })),
      back_urls: {
        success: `https://compu-gamer.netlify.app/success`,
        failure: `https://compu-gamer.netlify.app/failure?ordenId=${ordenId}&idProducts=${idProducts}`,
        pending: `https://compu-gamer.netlify.app/pending`,
      },
      auto_return: "approved",
      external_reference: ordenId
    };

    const preference = new Preference(mercadoPagoClient);
    const result = await preference.create({ body });

    res.json({ id: result.id });
  } catch (error) {
    console.error(
      "Error al crear la preferencia:",
      error.response?.data || error.message,
    );
    res.status(500).json({
      error: error.response?.data || "Error desconocido al crear preferencia",
    });
  }
});

module.exports = routerMercadoPago;
