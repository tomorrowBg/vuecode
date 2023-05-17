(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    // 劫持数组得方法
    // 重写数组得方法
    // 步骤1:获取原来得数组方法Array.prototype 得原型
    let oldArrayProtoMehtods = Array.prototype;
    console.log('oldArrayProtoMehtods数组原型', oldArrayProtoMehtods);

    // (2)继承
    let ArrayMethods = Object.create(oldArrayProtoMehtods);
    console.log('ArrayMethods继承数组', ArrayMethods);
    // 劫持
    let methods = [
        'push',
        'pop',
        'unshift',
        'shift',
        'splice'
    ];
    methods.forEach(item => {
        ArrayMethods[item] = function(...args) {
            console.log('劫持数组', args, this);
            let res = oldArrayProtoMehtods[item].apply(this, args);
            console.log('res', res);
            // 问题:数组添加对象得情况, push, unshift , splice
            let inserted;
            switch(item) {
                case 'push':
                case 'unshift':
                    console.log('走动这里');
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.splice(2);
                    return
            }
            console.log('inserted', inserted);
            let ob = this.__ob__; // 用来获取observerArray方法得
            if (inserted) {
                ob.observerArray(inserted); // 对象我们组件添加得对象经行劫持
            }
            return res
        };
    });

    function observer(data) {
        console.log('observer', data);
        // data 得数据类型1对象
        if (typeof data != 'object' || data == null) {
            return data
        }
        // data 得数据类型1对象
        return new Observer(data)
    }
    class Observer {
        constructor(value) {
            console.log('value1', value);
            // 判断数据是数组还是对象
            // 判断是不是数组
            // 给value定义个属性
            Object.defineProperty(value, '__ob__', {
                enumerable: false, // 不可枚举
                value: this
            });
            if (Array.isArray(value)) {
                // 是数组就走执行劫持数组得方法
                console.log('数组执行这里', value);
                value.__proto__ = ArrayMethods;
                // 如果是数组对象 [{q:1}]
                this.observerArray(value);
            } else {
                // 不是的话就是走劫持对象得方法
                // 遍历value 对象所有属性进行劫持
                this.wakl(value);
            }
        }
        wakl(data) {
            let keys = Object.keys(data);
            console.log('keys', keys);
            for (let i = 0; i < keys.length; i++) {
                // 对对象中得每个属性进行劫持
                let key = keys[i];
                let value = data[key];
                // 对对象中得属性进行劫持
                console.log('data, key, value', data, key, value);
                defineRective(data, key, value);
            }
        }
        // 用来劫持数组对象得
        observerArray (value) {
            for (let i = 0; i< value.length; i++) {
                observer(value[i]);
            }
        }
    }
    // 对对象中得属性进行劫持
    function defineRective(data, key, value) { // {a:{b: 1}}
        console.log('11111');
        observer(value); // 深层递归, 判断是不是对象套对象
        Object.defineProperty(data, key, {
            get() {
                console.log('获取值');
                return value
            },
            set(newVaule) {
                if (newVaule === value) return
                observer(value); // 设置得值再次进行劫持
                value = newVaule; // 如果用户设置得值是对象就要进行递归
            }
        });
    }
    // vue2数据劫持使用:object.definePropert 缺点:只能对对象中得属性进行劫持,而不是整个对象
    // data 得俩种情况 1, 是对象 {a: {}}, list: []
    // 总结:(1)对象
    // Object.defineProperty 缺点: 只能对象得属性一个一个得进行劫持
    // 遍历劫持
    // 递归: get set
    // 数组得劫持,采用函数劫持
    // list: [1,3,3,4,5] arr: [{qq:1}, {11: 2}]
    // 函数劫持:重写数组得方法(push,pop....)

    function initState(vm) {
        let opts = vm.$options;
        console.log('opts', opts);
        // 下面就是判断带过来什么值
        // 判断传过来什么,就初始化什么值
        // 初始化props
        if (opts.props) ;
        // 初始化data
        if (opts.data) {
            initData(vm);
        }
        // 初始化watch
        if (opts.watch) ;
        // 初始化compouted
        if (opts.compouted) ;
        // 初始化methods
        if (opts.methods) ;
    }

    // vue2对data经行初始化 , data有俩种情况,1,是对象,2是函数
    // 第一种情况 
    function initData (vm) {
        console.log('data初始化', vm);
        let data = vm.$options.data;
        data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 注意一个问题this得指向
        console.log('data', data);
        // 将data上得所有得属性代理到实例上
        for (let key in data) {
            proxy(vm, '_data', key);
        }
        // data数据进行劫持
        observer(data);
    }
    function proxy(vm, source, key) {
        Object.defineProperty(vm, key, {
            get() {
                return vm[source][key]
            },
            set (val) {
                return vm[source][key] = val
            }
        });
    }

    /*
     * @Author: white tomorrowBg@163.com
     * @Date: 2023-05-06 17:11:45
     * @LastEditors: yyds白 11935851+yyds-white@user.noreply.gitee.com
     * @LastEditTime: 2023-05-11 17:20:27
     * @FilePath: \vue_code\src\init.js
     * @Description: 初始化文件方法
     * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
     */
    // import { compileToFunction } from "./compile"
    function initMixin(Vue) {
        Vue.prototype._init = function (options) {
            console.log(options, 2);
            let vm = this; // this就是vue得实例
            vm.$options = options;
            // 初始化状态
            initState(vm);
            // 模板编译
            if (vm.$options.el) {
                vm.$mount(vm.$options.el);
            }
        };
        Vue.prototype.$mount = function (el) {
            console.log('88888888888888');
            let vm = this;
            el = document.querySelector(el); // 获取元素
            let options = vm.$options;
            if (!options.render) {
                let template = options.template;
                if (!template && el) {
                    // 获取html
                    el = el.outerHTML;
                    console.log(`%c vue-devtools %c Detected Vue v${Vue.version} %c`,'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff','background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff','background:transparent', el, 8989); // => <div id="app">{{msg}}</div>
                    // 变成ast语法树
                    compileToFunction(el);
                    // 变成render函数
                }
            }
        };
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

    // 引入初始化的方法
    function Vue (options) {
        // 这里的options就是初始化的data,methods....vue上的方法
        // init 初始化的方法 (模块化)
        console.log('1');
        this._init(options);
    }
    console.log('3');
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
