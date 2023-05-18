/**
 * <div id="app" value="12"> hello {{msg}}<h1></h1></div>
 * 变为一下解构
 * render () { _c 解析标签(1.标签名. 2.属性, 3._v解析文本('hellow' + _s插值表达式就是变量(msg)), 如果有子元素继续直接_c(...))
 *  return _c('div', {id: app}, _v('hellow' + _s(msg)), ,_c(...))
 * }
*/
// 处理属性
function genProps (attrs) {
    let str = ''
    for(let i = 0; i < attrs.length; i++) { // [{name: 'id', value: 'app'}, {name: 'style', value: 'color: red; font-size: 20px'}]
        let attr = attrs[i]
        console.log('attr1', attr);
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':')
                obj[key] = val
            })
            attr.value = obj
        }
        // 拼接
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    // str => {id:"app",style:{"color":" red"," font-size":" 20px"}}
    return `{${str.slice(0, -1)}}`
}
export function generate (el) {
    console.log('generateel', el);
    // 注意属性(行内属性中多个属性是用;分号连接得) attrs: [{name: 'id', value: 'app'}, {name: 'style', value: 'color: red; font-size: 20px'}]
    let code = `_c(${el.tag}, ${el.attrs.length ? `${genProps(el.attrs)}`: 'null'})`
    console.log('code', code);
}