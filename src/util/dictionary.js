let dictionnary = {
  '中文': 'chinese'
}
var myDictionary = {}
function generateDictionary(fileKeys, key, value) {
  myDictionary[key] = value
  fileKeys.push(key)
}

function getChinese(fileKeys, line) {
  var str_cut = null
  var str_len = line.length
  for (var i = 0; i < str_len; i++) {
    var a = line.charAt(i);
    if (escape(a).length > 4) {
      if (!str_cut) {
        str_cut = new String()
      }
      //中文字符的长度经编码之后大于4
      str_cut = str_cut.concat(a);
    }
    if (escape(a).length <= 4 || i === (str_len - 1)) {
      if (str_cut) {
        generateDictionary(fileKeys, str_cut.toString(), '')  //将中文字符作为myDictionary对象的键名，并初始化值为''
      }
      str_cut = null
    }
  }
}
module.exports = {
  dictionnary: dictionnary,
  destDictionary: myDictionary,
  generateDictionary: generateDictionary,
  getChinese: getChinese
}