const jsdom = require("jsdom");

class HtmlParser {
  constructor(html) {
    this.htmlDom = new jsdom.JSDOM(html);
  }

  // options structure:
  // {
  //  [textContentName: string]: elementSelector: string || {
  //    selector: string;
  //    field?: string;
  //    fromDataset?: boolean
  //  }
  //
  // }
  static parseElement(element, options) {
    const parsedData = {};

    for (const key in options) {
      let wantedField = "textContent";
      let elementSelector = options[key];
      let isFromDataset = false;

      if (options[key] instanceof Object) {
        const { field, selector, fromDataset } = options[key];
        wantedField = field || wantedField;
        elementSelector = selector;

        isFromDataset = fromDataset || false;

        if (!selector) {
          throw new Error('"selector" field must be specified');
        }
      }

      let content = null;

      if (elementSelector === "self!") {
        content = element[wantedField];
      } else {
        const childElement = element.querySelector(elementSelector);

        if (isFromDataset) {
          content = childElement.dataset[wantedField];
        } else {
          content = childElement[wantedField];
        }
      }

      parsedData[key] = content;
    }

    return parsedData;
  }

  querySelectorAllByClass(className) {
    return this.htmlDom.window.document.querySelectorAll("." + className);
  }
}

module.exports = HtmlParser;
