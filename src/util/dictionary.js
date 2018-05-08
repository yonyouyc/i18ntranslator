let dictionnary = {
  '中文': 'chinese'
}
var myDictionary = {}
function generateDictionary (key, value) {
  myDictionary[key] = value
}
module.exports = {
  dictionnary: dictionnary,
  destDictionary: myDictionary,
  generateDictionary: generateDictionary
}