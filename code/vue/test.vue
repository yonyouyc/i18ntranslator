<template>
    <div>
        <code data="标题"></code>
        <!-- 注释要去掉 -->
        <p>我们是红军and红军是我们</p>
        <span>编辑者：</span><span>是否不是有问题在vue下</span>
    </div>
</template>
<script>
    export default {
      data () {
        return {
          data: '标题是2'
        }
      },
      mounted () {
        // 单行注释
        /*****
         * 多行注释
         * */
        var test = '中文' // 行末注释
      }
    }
</script>
<style>
    /*css里的注释*/
</style>