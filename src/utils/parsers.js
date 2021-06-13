const RU_MONTHS = {
  "янв.": "jan",
  "фев.": "feb",
  "мар.": "mar",
  "апр.": "apr",
  мая: "may",
  "июн.": "june",
  "июл.": "jul",
  "авг.": "aug",
  "сен.": "sep",
  "окт.": "oct",
  "ноя.": "nov",
  "дек.": "dec",
};

const MS_IN_ONE_DAY = 1000 * 60 * 60 * 24;

const getDaysAgo = (dateString) => {
  const [date] = dateString.toLowerCase().split(",");

  const [day, month] = date.split(" ");

  if (!month) {
    if (day === "сегодня") {
      return 0;
    }

    if (day === "вчера") {
      return 1;
    }
  }

  const localMonth = RU_MONTHS[month];

  const datePublished = new Date(
    `${new Date().getFullYear()} ${localMonth} ${day}`
  );

  const diff = Date.now() - datePublished.getTime();

  return Math.floor(diff / MS_IN_ONE_DAY);
};

const parsePrice = (price) => {
  const [value] = price.split(" ");

  if (isNaN(Number(value))) {
    return 0;
  }

  return Number(value);
};

module.exports = {
  getDaysAgo,
  parsePrice,
};
