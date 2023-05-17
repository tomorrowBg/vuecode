import { observer } from "./observer/index";

export function initState(vm) {
    let opts = vm.$options
    console.log('opts', opts);
    // 下面就是判断带过来什么值
    // 判断传过来什么,就初始化什么值
    // 初始化props
    if (opts.props) {
        initProps()
    }
    // 初始化data
    if (opts.data) {
        initData(vm)
    }
    // 初始化watch
    if (opts.watch) {
        initWatch()
    }
    // 初始化compouted
    if (opts.compouted) {
        initCompouted()
    }
    // 初始化methods
    if (opts.methods) {
        initMethods()
    }
}
function initCompouted() {}
function initMethods () {}
function initProps () {}
function initWatch (){}

// vue2对data经行初始化 , data有俩种情况,1,是对象,2是函数
// 第一种情况 
function initData (vm) {
    console.log('data初始化', vm);
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data // 注意一个问题this得指向
    console.log('data', data);
    // 将data上得所有得属性代理到实例上
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    // data数据进行劫持
    observer(data)
}
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set (val) {
            return vm[source][key] = val
        }
    })
}