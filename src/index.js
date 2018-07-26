var fs = require('fs')
var readFileContent = require('./util/file').readFileContent
var writeXlsx = require('./util/xlsx').writeXlsx
// 写入txt文件
function writeTxt(path, data) {
  fs.writeFile(path, JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }
    console.log('The txt file has been saved!');
  });
}
var path = require('path')
var absolutePath = path.resolve('./code/src')
var exportPath = path.resolve('./dest')
var setting = require('./util/setting')
setting.setIgnoreDirectory(['my', 'test', 'vue', 'translated'])
// 入口函数
readFileContent(absolutePath, function (destDictionary) {
  console.log('write')
  writeXlsx(destDictionary, exportPath + '/chinese.xlsx');
})
///分为*.js 和 *.html

// 输出所有中文内容（正则）