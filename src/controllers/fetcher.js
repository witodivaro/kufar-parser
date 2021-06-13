const fetch = require("node-fetch");

class Fetcher {
  constructor() {
    this.link = null;
  }

  setFetchLink(link) {
    this.link = link;
  }

  async fetchData(responseType) {
    try {
      const response = await fetch(this.link);

      const data = response[responseType]();

      return data;
    } catch (error) {
      console.error("An error occured in fetch data attempt", error);
    }
  }
}

module.exports = Fetcher;
