/*
 * @Author: yyds白 11935851+yyds-white@user.noreply.gitee.com
 * @Date: 2023-05-11 20:55:45
 * @LastEditors: yyds白 11935851+yyds-white@user.noreply.gitee.com
 * @LastEditTime: 2023-05-11 21:08:08
 * @FilePath: \vue_code\2.创建ast语法树\rollup.config.js
 * @Description: rollup配置
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import bable from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input:'./src/index.js', //打包入口文件
    output:{
        file:'dist/vue.js',
        format:'umd', //  在window 上 Vue    new Vue
        name:'Vue',
        sourcemap:true
    },
    plugins:[
        bable({
           exclude:'node_modules/**' 
        }),
        serve({ // 3000
             open: true,
             port:8080,
             contentBase:'', // "" 当前目录
             openPage:'/index.html'
        })
    ]
}