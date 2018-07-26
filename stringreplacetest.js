var str = 'AbbbA 你好: 世界 我们是 你好一起的人'
var reg = /你好:/g
str = str.replace(reg, 'hahha')
console.log(str)