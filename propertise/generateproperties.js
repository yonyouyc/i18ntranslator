var i18ntranslator = require('../dist/i18ntranslator.min')
var fs = require('fs')
var path = require('path')
// 入口函数
var json = i18ntranslator.readXlsx('./propertise/chinese.xlsx')
json = json.filter(function (item) {
  return !item.value ||  item.value =='not translated' || item.value == 'Not Translate' || item.value == 'Not translated'
}).map(function (item) {
  return item.id + '=' + item.en
}).join('\n')
var writeDirectoryString = './propertise'
var writePath = './propertise/result.properties'
fs.mkdir(writeDirectoryString, [], function () {
  fs.writeFile(writePath, json,function(err){
    if(err) console.log(err);
  });
})