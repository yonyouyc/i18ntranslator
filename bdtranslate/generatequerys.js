var i18ntranslator = require('../dist/i18ntranslator.min')
var fs = require('fs')
var path = require('path')
// 入口函数
var json = i18ntranslator.readXlsx('./bdtranslate/source.xlsx')
json = json.filter(function (item) {
  return !item.value ||  item.value =='not translated' || item.value == 'Not Translate' || item.value == 'Not translated'
}).map(function (item) {
  return item.key
}).join('\\n')
json = "var querys = \"" + json + "\""
console.log(json)
var writeDirectoryString = './bdtranslate'
var writePath = './bdtranslate/query.js'
fs.mkdir(writeDirectoryString, [], function () {
  fs.writeFile(writePath, json,function(err){
    if(err) console.log(err);
  });
})