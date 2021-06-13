const HtmlParser = require("./src/controllers/htmlParser");
const Fetcher = require("./src/controllers/fetcher");
const ExcelWriter = require("./src/controllers/excelWriter");
const Repository = require("./src/model/repository");

const { CLASSNAMES } = require("./src/consts/kufar");
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

  const htmlParser = new HtmlParser(html);

  const productElements = htmlParser.querySelectorAllByClass(
    CLASSNAMES.PRODUCT
  );

  productElements.forEach((product) => {
    const parsedProduct = HtmlParser.parseElement(product, {
      name: "." + CLASSNAMES.PRODUCT_NAME,
      price: "." + CLASSNAMES.PRODUCT_PRICE,
      photo: {
        selector: "." + CLASSNAMES.PRODUCT_PHOTO,
        field: "src",
        fromDataset: true,
      },
      date: "." + CLASSNAMES.PRODUCT_DATE,
      link: {
        selector: "self!",
        field: "href",
      },
    });

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
