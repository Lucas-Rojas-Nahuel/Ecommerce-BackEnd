const {expressjwt} = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless ({
    path: [
      {url: `${api}/productos` , methods: ['GET', 'OPTIONS'] },
      `${api}/usuarios/login`,
      `${api}/usuarios/register`,
    ]
  })
}

async function isRevoked(req, token) {
  if(!token.payload.esAdmin) {
    return true;
  }
  return false;
}

module.exports = authJwt;