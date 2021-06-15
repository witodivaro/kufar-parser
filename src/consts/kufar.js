const URL = "https://www.kufar.by/";

const SELECTORS = {
  PRODUCT: 'a[href^="https://www.kufar.by/item/"]',
  PRODUCT_PHOTO: "img",
  PRODUCT_NAME: "h3",
  PRODUCT_PRICE: ".kf-FeeL-f1d17",
  PRODUCT_DATE: "div + div span",
};

module.exports = { SELECTORS, URL };
