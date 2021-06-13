class Repository {
  constructor() {
    this.data = [];
  }

  addData(dataElement) {
    this.data.push(dataElement);
  }

  getData() {
    return this.data;
  }
}

module.exports = Repository;
