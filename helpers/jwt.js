const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless ({
    path: [
      {url: "/api/v1/productos" , methods: ['GET', 'OPTIONS'] },
      "/api/v1/usuarios/login",
      "/api/v1/usuarios/register",
    ]
  })
}

async function isRevoked(req, payload, done) {
  if(!payload.esAdmin) {
      done(null, true)
  }

  done();
}

module.exports = authJwt;