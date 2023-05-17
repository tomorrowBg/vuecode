import { ArrayMethods } from './arr'
export function observer(data) {
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
        })
        if (Array.isArray(value)) {
            // 是数组就走执行劫持数组得方法
            console.log('数组执行这里', value);
            value.__proto__ = ArrayMethods
            // 如果是数组对象 [{q:1}]
            this.observerArray(value)
        } else {
            // 不是的话就是走劫持对象得方法
            // 遍历value 对象所有属性进行劫持
            this.wakl(value)
        }
    }
    wakl(data) {
        let keys = Object.keys(data)
        console.log('keys', keys);
        for (let i = 0; i < keys.length; i++) {
            // 对对象中得每个属性进行劫持
            let key = keys[i]
            let value = data[key]
            // 对对象中得属性进行劫持
            console.log('data, key, value', data, key, value);
            defineRective(data, key, value)
        }
    }
    // 用来劫持数组对象得
    observerArray (value) {
        for (let i = 0; i< value.length; i++) {
            observer(value[i])
        }
    }
}
// 对对象中得属性进行劫持
function defineRective(data, key, value) { // {a:{b: 1}}
    console.log('11111');
    observer(value) // 深层递归, 判断是不是对象套对象
    Object.defineProperty(data, key, {
        get() {
            console.log('获取值');
            return value
        },
        set(newVaule) {
            if (newVaule === value) return
            observer(value) // 设置得值再次进行劫持
            value = newVaule // 如果用户设置得值是对象就要进行递归
        }
    })
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