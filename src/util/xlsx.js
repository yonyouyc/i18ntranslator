var XLSX = require('xlsx')
// 创建构造函数
function workBook() {
  this.SheetNames = [];
  this.Sheets = {};
}
// 将json数据转换成xlsx能识别的数组格式
function jsonToArray(jsonData) {
  var arr = [];
  var titleArr = ['key', 'value'];
  arr.push(titleArr);
  for (var key in jsonData) {
    var coArr = [];
    coArr.push(key);
    coArr.push(jsonData[key]);
    arr.push(coArr);
  }
  return arr;
}
// 将数组转化为xlsx能识别的形式
function arrayToXlsx(data) {
  var ws = {};
  var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C]};
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}
// 写xlsx文件
function writeXlsx(data, path) {
  var wb = new workBook();
  var jsonArr = jsonToArray(data);
  var ws = arrayToXlsx(jsonArr);
  wb.SheetNames.push('chinese');
  wb.Sheets['chinese'] = ws;
  XLSX.writeFile(wb, path);
  console.log('The xlsx file has been saved!');
}
function readXlsx (path) {
  var wb = XLSX.readFile(path);
  /* grab first sheet */
  var wsname = wb.SheetNames[0];
  var ws = wb.Sheets[wsname];
  /* generate HTML */
  var json = XLSX.utils.sheet_to_json(ws);
  return json
}

module.exports = {
  writeXlsx: writeXlsx,
  readXlsx: readXlsx
}