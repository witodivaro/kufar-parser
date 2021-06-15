const fs = require("fs");

const HtmlParser = require("./src/controllers/htmlParser");
const Fetcher = require("./src/controllers/fetcher");
const ExcelWriter = require("./src/controllers/excelWriter");
const Repository = require("./src/model/repository");

const { SELECTORS } = require("./src/consts/kufar");
const { generateKufarListingsUrl } = require("./src/utils/kufar");
const { getDaysAgo, parsePrice } = require("./src/utils/parsers");

const wantedProduct = process.argv[2];

if (!wantedProduct) {
  process.stderr.write(
    "Select a product by passing it as a first argument \nexample: (node index.js шопер)\n"
  );
  process.exit(1);
}

const repository = new Repository();
const fetcher = new Fetcher();
const excelWriter = new ExcelWriter();

fetcher.setFetchLink(generateKufarListingsUrl(wantedProduct));

const run = async () => {
  const html = await fetcher.fetchData("text");

  fs.writeFileSync("kufar.html", html);

  const htmlParser = new HtmlParser(html);

  const productElements = htmlParser.querySelectorAll(SELECTORS.PRODUCT);

  console.log(productElements[0]);

  productElements.forEach((product) => {
    const parsedProduct = HtmlParser.parseElement(product, {
      name: SELECTORS.PRODUCT_NAME,
      price: SELECTORS.PRODUCT_PRICE,
      photo: {
        selector: SELECTORS.PRODUCT_PHOTO,
        field: "src",
        fromDataset: true,
      },
      date: SELECTORS.PRODUCT_DATE,
      link: {
        selector: "self!",
        field: "href",
      },
    });

    console.log(parsedProduct);

    parsedProduct.price = parsePrice(parsedProduct.price);
    parsedProduct.date = getDaysAgo(parsedProduct.date);

    repository.addData(parsedProduct);
  });

  excelWriter.addSheet(wantedProduct + "s");
  excelWriter.setCurrentWorksheet(wantedProduct + "s");

  excelWriter.addHeadersToSheet([
    {
      header: "Название",
      key: "name",
    },
    {
      header: "Цена, р.",
      key: "price",
    },
    {
      header: "Ссылка",
      key: "link",
    },
    {
      header: "Дата создания, дней назад",
      key: "date",
    },
    {
      header: "Фото",
      key: "photo",
    },
  ]);

  excelWriter.addRows(repository.getData());

  excelWriter.exportFile(wantedProduct + ".xlsx");
};

run();
