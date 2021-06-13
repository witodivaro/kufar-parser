const Excel = require("exceljs");

class ExcelWriter {
  constructor() {
    this.workbook = new Excel.Workbook();
    this.worksheet = null;
  }

  addSheet(sheetName) {
    this.workbook.addWorksheet(sheetName);
  }

  setCurrentWorksheet(sheetName) {
    this.worksheet = this.workbook.getWorksheet(sheetName);
  }

  addHeadersToSheet(headers) {
    this.worksheet.columns = headers;
    this.worksheet.getRow(1).font = { bold: true, size: 10 };
    for (let cellIndex = 1; cellIndex <= headers.length; cellIndex++) {
      this.setBorders(1, cellIndex);
    }
  }

  setBorders(row, cell) {
    this.worksheet.getRow(row).getCell(cell).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }

  addRows(data) {
    data.forEach((element) => {
      this.worksheet.addRow(element);
    });
  }

  exportFile(fileName) {
    this.workbook.xlsx.writeFile(fileName);
  }
}

module.exports = ExcelWriter;
