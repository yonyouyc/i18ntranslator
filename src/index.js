var readdir = require('./util/file').readdir
var fs = require('fs')
var path = require('path')
var destDictionary = require('./util/dictionary').destDictionary
var lineReader = require('line-reader')
var getChinese = require('./util/dictionary').getChinese
var XLSX = require('xlsx')
// 读取所有code目录下的文件
var path = require('path')
// 当前目录下js和html文件的总数
var filesize = 0
// 当前目录下已经完成读取的js和html文件的总数
var finishedSize = 0
// 当前目录下文件夹的数量
var directorySize = 0
// 当前目录下已经遍历的文件夹数量
var getDirectorySize = 0
// 当前目录下非js和html文件的总数
var otherFileSize = 0
// 当前目录下已经遍历的非js和html文件的数量
var getOtherFileSize = 0
// 存储所给目录下的所有文件夹
var directoryArr = []

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
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = { v: data[R][C] };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

// 写入txt文件
function writeTxt(path, data) {
  fs.writeFile(path, JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }
    console.log('The txt file has been saved!');
  });
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

// 逐行读取文件内容，同时忽略注释
function readLine(file, callback) {
  // 这里读取当前文件全部内容，用来判断该文件的内容是否为空，如果为空的话lineReader.eachLine不会执行
  var str = fs.readFileSync(file).toString()
  if (!str) {
    callback()
    return
  }
  // 找出html文件夹的注释
  if (file.indexOf('.html') > 0) {
    var status = 'code'
    lineReader.eachLine(file, function (line, last) {
      switch (status) {
        case 'code':
          var startIndex = line.indexOf('<!--')
          var endIndex = line.indexOf('-->')
          // html注释在同一行的情况
          if (startIndex > -1 && endIndex > -1) {
            // 改变status的值为code
            status = 'code'
            // 获取注释前面的内容
            var startStr = line.substring(0, startIndex)
            // 获取注释后面的内容
            var endStr = line.substring(endIndex)
            if (startStr) {
              getChinese(startStr)
            }
            if (endStr) {
              getChinese(endStr)
            }
          } else if (startIndex > -1 && endIndex < 0) { //多行注释的情况
            // 改变status的状态为commentStart，表示是多行注释，直到-->出现
            status = 'commentStart'
            var startStr = line.substring(0, startIndex)
            if (startStr) {
              getChinese(startStr)
            }
          } else if (startIndex < 0) {
            status = 'code'
            getChinese(line)
          }
          break
        case 'commentStart':
          var endIndex = line.indexOf('-->')
          // 多行注释结束，改变status=code，否则的话就status继续为commentStart
          if (endIndex > -1) {
            var endStr = line.substring(endIndex)
            if (endStr) {
              getChinese(endStr)
            }
            status = 'code'
          } else {
            status = 'commentStart'
          }
          break
        default:
          status = 'code'
          break
      }
      if (last) {
        callback()
      }
    })
  }
  // 找出js文件的注释
  if (file.indexOf('.js') > 0) {
    var status = 'code'
    lineReader.eachLine(file, function (line, last) {
      switch (status) {
        case 'code':
          // js里有多行注释和单行注释的情况
          var singleStartIndex = line.indexOf('//')
          var mulStartIndex = line.indexOf('/*')
          var mulEndIndex = line.indexOf('*/')
          // 用//单行注释的情况且不在''里面
          if (singleStartIndex > -1 && line.search(/('|").*\/\/.*('|")$/) < 0) {
            status = 'code'
            var startStr = line.substring(0, singleStartIndex)
            if (startStr) {
              getChinese(startStr)
            }
          } else if (mulStartIndex > -1 && mulEndIndex > -1) {// 用/* */单行注释的情况
            status = 'code'
            var startStr = line.substring(0, mulStartIndex)
            var endStr = line.substring(mulEndIndex)
            if (startStr) {
              getChinese(startStr)
            }
            if (endStr) {
              getChinese(endStr)
            }
          } else if (mulStartIndex > -1 && mulEndIndex < 0) {// 用/* */多行注释的情况
            status = 'startComment' // 多行注释开始
            var startStr = line.substring(0, mulStartIndex)
            if (startStr) {
              getChinese(startStr)
            }
          } else {
            getChinese(line)
          }
          break
        case 'startComment':
          var mulEndIndex = line.indexOf('*/')
          // 多行注释结束
          if (mulEndIndex > -1) {
            status = 'code'
            var endStr = line.substring(mulEndIndex)
            if (endStr) {
              getChinese(endStr)
            }
          } else {
            status = 'startComment'
          }
          break
        default:
          status = 'code'
      }
      if (last) {
        callback()
      }
    })
  }
}

// 给当前文件或文件夹添加完整的路径
function fullPath(dir, files) {
  return files.map(function (f) {
    return path.join(dir, f)
  })
}

// 工具的入口函数
function readFileContent(path) {
  fs.readdir(path, function (err, files) {
    if (err) console.log(err)
    files = fullPath(path, files)
    if (files) {
      // 循环获取当前目录下js和html文件、非这两种文件以及文件夹的数量
      for (var i = 0; i < files.length; i++) {
        var stats = fs.statSync(files[i])
        if (stats.isFile()) {
          if (files[i].indexOf('.js') > -1 || files[i].indexOf('.html') > -1) {
            filesize++
          } else {
            otherFileSize++
          }
        }
        if (stats.isDirectory()) {
          directorySize++
        }
      }
      files.forEach(function (f) {
        fs.stat(f, function (err, stats) {
          if (stats.isFile()) {
            if (f.indexOf('.js') > -1 || f.indexOf('.html') > -1) {
              readLine(f, function () {
                finishedSize++
                // 判断当前目录下的js和html文件是否已经遍历完了，遍历完的话就遍历下一个子目录
                if (filesize == finishedSize) {
                  filesize = 0
                  finishedSize = 0
                  getOtherFileSize = 0
                  otherFileSize = 0
                  directorySize = 0
                  getDirectorySize = 0
                  var directory = directoryArr.shift()
                  if (directory) {
                    console.log('directory:' + directory)
                    readFileContent(directory)
                  } else {
                    writeTxt('../dest/final.txt', JSON.stringify(destDictionary));
                    writeXlsx(destDictionary, '../dest/chinese.xlsx');
                  }
                }
              })
            } else {
              // 这里处理当前目录下即没有html、js文件也没有文件夹的情况
              if (filesize == 0 && directorySize == 0) {
                getOtherFileSize++
                if (getOtherFileSize == otherFileSize) {
                  getOtherFileSize = 0
                  otherFileSize = 0
                  var directory = directoryArr.shift()
                  if (directory) {
                    readFileContent(directory)
                  } else {
                    writeTxt('../dest/final.txt', JSON.stringify(destDictionary));
                    writeXlsx(destDictionary, '../dest/chinese.xlsx');
                  }
                }

              }
            }
          }
          if (stats.isDirectory()) {
            directoryArr.push(f)
            // 这里处理当前目录下没有js和html文件的情况
            if (filesize == 0) {
              getDirectorySize++
              if (getDirectorySize == directorySize) {
                getDirectorySize = 0
                otherFileSize = 0
                getOtherFileSize = 0
                directorySize = 0
                var directory = directoryArr.shift()
                if (directory) {
                  readFileContent(directory)
                }
              }
            }
          }
        })
      })
    }
  })
}
readFileContent('../code')

///分为*.js 和 *.html

// 输出所有中文内容（正则）