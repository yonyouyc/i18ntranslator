先使用translateenus 生成 chinese.xlsx
把chinese.xlsx中文列拷贝到bdtranslate的source.xlsx
里 然后参考bdtranslate里的方法生成result.xlsx

将result.xlsx和chinese.xlsx 进行合并，第一列改成id
英文翻译改成en
然后调用generateproperties.js 生成最终的result.properties