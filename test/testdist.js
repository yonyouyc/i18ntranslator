var i18ntranslator = require('../dist/i18ntranslator.min')
var path = './dest/translated.xlsx'
var json = i18ntranslator.readXlsx(path)
console.log(json)