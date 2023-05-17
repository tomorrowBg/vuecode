/*
 * @Author: white tomorrowBg@163.com
 * @Date: 2023-05-06 17:11:45
 * @LastEditors: yyds白 11935851+yyds-white@user.noreply.gitee.com
 * @LastEditTime: 2023-05-11 17:20:27
 * @FilePath: \vue_code\src\init.js
 * @Description: 初始化文件方法
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { initState } from "./initState"
import { compileToFunction } from "./compile"
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        console.log(options, 2)
        let vm = this // this就是vue得实例
        vm.$options = options
        // 初始化状态
        initState(vm)
        // 模板编译
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        console.log('88888888888888');
        let vm = this
        el = document.querySelector(el) // 获取元素
        let options = vm.$options
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                // 获取html
                el = el.outerHTML
                console.log(`%c vue-devtools %c Detected Vue v${Vue.version} %c`,'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff','background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff','background:transparent', el, 8989); // => <div id="app">{{msg}}</div>
                // 变成ast语法树
                let ast =  compileToFunction(el)
                // 变成render函数
            }
        }
    }
}
// ast语法树 可以操作css, js 和元素节点
// vnode 虚拟dom, vnode只能操作元素节点
// ast语法树  <div id="app">heelo<div></div></div>
/**
 * {
 * tag: 'div',标签名称
 * attrs: [{id: "#app"}], 属性
 * children:[{tag: null, text: hello},{tag: 'div'}], 子元素
 * }
 */