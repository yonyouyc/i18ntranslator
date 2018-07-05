var fs = require('fs')
var readFileContent = require('./util/file').readFileContent
var writeXlsx = require('./util/xlsx').writeXlsx
var readXlsx = require('./util/xlsx').readXlsx
// 写入txt文件
function writeTxt(path, data) {
  fs.writeFile(path, JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }
    console.log('The txt file has been saved!');
  });
}

// 入口函数
readFileContent('../code', function (destDictionary) {
  console.log('wiret')
  writeXlsx(destDictionary, '../dest/chinese.xlsx');
})
///分为*.js 和 *.html

// 输出所有中文内容（正则）