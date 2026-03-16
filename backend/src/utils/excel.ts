import { Column, Worksheet } from "exceljs";

type FillDataParam = {
  columns: Partial<Column>[];
  data: any[];
};

export function colName(n: number) {
  var ordA = "A".charCodeAt(0);
  var ordZ = "Z".charCodeAt(0);
  var len = ordZ - ordA + 1;

  var s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}

export const fillDataArray = (
  ws: Worksheet,
  { columns, data }: FillDataParam,
) => {
  ws.columns = columns;
  ws.addRows(data);
};

export const cellBorderCenter = (
  ws: Worksheet,
  { initRow = 0, initCol = 0 },
) => {
  ws.eachRow(function (row, rowNumber) {
    row.eachCell(function (cell, colNumber) {
      if (rowNumber >= initRow && colNumber >= initCol) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          horizontal: "center",
        };
      }
    });
  });
};
