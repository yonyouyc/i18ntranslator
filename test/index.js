var i18ntranslator = require('../dist/i18ntranslator.min')
// 入口函数
i18ntranslator.readFileContent('./code', function (destDictionary) {
  i18ntranslator.writeXlsx(destDictionary, './dest/chinese-test.xlsx');
})