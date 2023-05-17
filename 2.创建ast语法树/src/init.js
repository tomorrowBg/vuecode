/*
 * @Author: yyds白 11935851+yyds-white@user.noreply.gitee.com
 * @Date: 2023-05-11 20:55:45
 * @LastEditors: yyds白 11935851+yyds-white@user.noreply.gitee.com
 * @LastEditTime: 2023-05-11 21:09:05
 * @FilePath: \vue_code\2.创建ast语法树\src\init.js
 * @Description: 初始化文件方法
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { initState } from './initState'
import { compileToFunction } from './compile/index';
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options)
        let vm = this
        vm.$options = options
        //初始化状态
        initState(vm)

        //渲染模板  el 
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    //创建 $mount

    Vue.prototype.$mount = function (el) {
        console.log(el)
        // el template  render
        let vm = this
        el = document.querySelector(el) //获取元素
        let options = vm.$options
        if (!options.render) { //没有
            let template = options.template
            if (!template && el) {
                //获取html
                el = el.outerHTML
                console.log(el)

                //<div id="app"> hello {{msg}}</div>
                //变成ast语法树
                console.log('el', el);
               let ast =  compileToFunction(el)
               //render()

               //
            }
        }
    }

}



