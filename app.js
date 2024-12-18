const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const path = require('path')
const {db1, db2} = require('./config/db.js')

 
/* app.use(cors({
  origin: "https://compu-gamer.netlify.app", // Permite solicitudes desde tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true, // Si estás utilizando cookies o headers personalizados
})) */

app.use(
  cors({
    origin: '*', // Permite todos los orígenes
  })
);


//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors())

//Rutas
const rutasProductos = require("./rutas/productos.js");
const rutasUsuarios = require("./rutas/usuarios.js");
const routerMercadoPago = require("./rutas/marcadoPago.js");

const authJwt = require("./helpers/jwt.js");
/* const errorHandler = require("./helpers/error-handler.js"); */
const routerOrdenes = require("./rutas/ordenes.js");
const webhookRouter = require('./rutas/webhook.js')



app.use(`${process.env.API_URL}/productos`, rutasProductos);
app.use(`${process.env.API_URL}/usuarios`, rutasUsuarios);
app.use(`${process.env.API_URL}/orden`, routerOrdenes);
app.use('/public', express.static(path.join(__dirname, '/imagenes')));
app.use(`${process.env.API_URL}/create_preference`, routerMercadoPago);
app.use(`${process.env.API_URL}/webhook`, webhookRouter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use(authJwt);
/* app.use(errorHandler); */

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log("Server is running on http://localhost:3001");
})
  