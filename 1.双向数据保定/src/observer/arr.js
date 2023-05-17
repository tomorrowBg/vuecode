// 劫持数组得方法
// 重写数组得方法
// 步骤1:获取原来得数组方法Array.prototype 得原型
let oldArrayProtoMehtods = Array.prototype
console.log('oldArrayProtoMehtods数组原型', oldArrayProtoMehtods);

// (2)继承
export let ArrayMethods = Object.create(oldArrayProtoMehtods)
console.log('ArrayMethods继承数组', ArrayMethods);
// 劫持
let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice'
]
methods.forEach(item => {
    ArrayMethods[item] = function(...args) {
        console.log('劫持数组', args, this);
        let res = oldArrayProtoMehtods[item].apply(this, args)
        console.log('res', res);
        // 问题:数组添加对象得情况, push, unshift , splice
        let inserted;
        switch(item) {
            case 'push':
            case 'unshift':
                console.log('走动这里');
                inserted = args
                break;
            case 'splice':
                inserted = args.splice(2)
                return
        }
        console.log('inserted', inserted);
        let ob = this.__ob__ // 用来获取observerArray方法得
        if (inserted) {
            ob.observerArray(inserted) // 对象我们组件添加得对象经行劫持
        }
        return res
    }
})