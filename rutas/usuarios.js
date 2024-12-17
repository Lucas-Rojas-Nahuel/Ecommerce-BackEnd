const { Router } = require("express");
const connection1 =  require('../config/db').db1;
const  Usuario  = require("../modelos/usuario")(connection1);
const routerUsuarios = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

routerUsuarios.get("/", async (req, res) => {
  
  const listaUsuarios = await Usuario.find();

  if (!listaUsuarios) {
    res.status(500).json({ success: false });
  }
  res.send(listaUsuarios);
});

routerUsuarios.get("/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (!usuario) {
    res
      .status(500)
      .json({ message: "El usuario con la ID proporcionada no existe!" });
  }
  res.status(200).send(usuario);
});

routerUsuarios.post("/", async (req, res) => {
  let usuario = new Usuario({
    nombre: req.body.nombre,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    esAdmin: req.body.esAdmin,
  });
  usuario = await usuario.save();

  if (!usuario) return res.status(400).send("El usuario no pudo ser creado!");

  res.send(usuario);
});

routerUsuarios.post("/login", async (req, res) => {
  const usuario = await Usuario.findOne({ email: req.body.email });
  
  const secret = process.env.secret;
  if (!usuario) {
    return res.status(400).send("Usuario no encontrado!");
  }
  console.log(usuario);

  if (usuario && bcrypt.compareSync(req.body.password, usuario.password)) {
    const token = jwt.sign(
      {
        usuarioId: usuario.id,
        role: usuario.esAdmin,
      },
      secret,
      { expiresIn: "1d" },
    );

    res.status(200).send({ usuario: usuario, token: token });
  } else {
    res.status(400).send("Contrasena incorrecta!");
  }
});

routerUsuarios.post("/register", async (req, res) => {
  let usuario = new Usuario({
    nombre: req.body.nombre,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  usuario = await usuario.save();

  if (!usuario) return res.status(400).send("El usuario no pudo ser creado!");

  res.send(usuario);
});

routerUsuarios.delete("/:id", (req, res) => {
  Usuario.findOneAndDelete(req.params.id)
    .then((usuario) => {
      if (usuario) {
        return res
          .status(200)
          .json({ success: true, message: "El usuario fue borrado!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = routerUsuarios;
