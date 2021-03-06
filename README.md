# yci18ntranslator
[![npm version](https://img.shields.io/npm/v/yci18ntranslator.svg)](https://www.npmjs.com/package/yci18ntranslator)
[![license](https://img.shields.io/npm/l/yci18ntranslator.svg)](https://www.npmjs.com/package/yci18ntranslator)
[![Build Status](https://api.travis-ci.org/yonyouyc/i18ntranslator.png?branch=master)](https://api.travis-ci.org/yonyouyc/i18ntranslator.png?branch=master)

# 版本更新说明
- 2018-07-20 更新setting配置，支持设置抽取和替换指定的扩展名，
    支持忽略部分不需要抽取和替换的目录
- 仍存在的bug 目录下不允许存在空目录，所有目录下必须有文件

# how to use
安装依赖
```
yarn add yci18ntranslator

```
抽取词条
```
// 获取引用
var i18ntranslator = require('yci18ntranslator')
// 入口函数，'./code 表示你要进行抽取的目录'
// './dest/chinese-test.xlsx' 表示要把抽取后的词条excel文件输出到什么位置
i18ntranslator.readFileContent('./code', function (destDictionary) {
  i18ntranslator.writeXlsx(destDictionary, './dest/chinese-test.xlsx');
})
// 可参考test/index.js

```
替换词条生成英文版代码
```
// 可参考src/translate.js

```

```

# i18ntranslator
用于统一抽取中文内容并动态替换
>已完成的功能
<ol>
  <li>忽略js和html文件中的注释</li>
  <li>遍历给定目录下的所有js和html文件，提取文件中非注释的中文字段</li>
</ol>

> 忽略js和html文件注释实现思路

    使用的是line-reader进行文件的逐行读取，每读取一行就判断通过indexOf判断当前行是否有注释，如果有的话再判断该注释是多行注释还是单行注释。
    判断单多行注释是通过变量status来记录的，status='code'表示上一行是单行注释或不是注释行，status='commentStart'表示处于多行注释中。
    
> 遍历给定目录的思路

    一开始使用的遍历方法是深度遍历，但是当路径下文件太多时就会卡住，现在采取的方式是广度遍历，思路是：首先通过readir读取给定路径下的目录内容
    如果是html或js文件用lineReader遍历内容提取中文字段，当当前目录js和html文件遍历完之后，取出目录数组中的第一个元素进行相关的操作，如果
    是文件夹的话就放入一个数组，如果当前目录下没有html和js文件只有其他文件的话就当处理到最后一个文件时，取出目录数组中路径进行遍历，直到数
    组长度为0。
    
> 未完成的功能
 
 <ol>
   <li>由于提取中文时，是逐个字符进行判断导致提取中文字段时遇到中文间有英文时，提取的中文字段会被切断造成语意问题，后面需要完善怎么把整个带英文
   的字段提取出来</li>
   <li>在新的文件夹下，建立和给定路径目录结构相同的目录，同时用翻译好的英文替换掉对应的中文</li>
 </ol>
    
    
    
# 关于翻译的设想
- 1.读取xlsx文件
- 2.遍历指定文件夹，读取中文，然后对中文长度由长到短排序
- 3.从长的开始替换中文
- 4.写入dist同名目录
