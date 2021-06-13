const { URL } = require("../consts/kufar");

const generateKufarListingsUrl = (productName) =>
  URL + "listings?query=" + encodeURIComponent(productName);

module.exports = { generateKufarListingsUrl };
