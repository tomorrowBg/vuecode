import {parseHTML} from './parseAst'
import {generate} from './generate'
export function compileToFunction(el) {
    console.log('el', el);
    // 1.将html变成ast语法树
    let ast = parseHTML(el)
    // console.log('ast', ast);
    // 2.ast 语法树变成render 函数分为俩步: (1)ast语法树变成字符串 (2)字符串变成函数
    let code = generate(ast)
}
/**
 * <div id="app" value="12"> hello {{msg}}<h1></h1></div>
 * 变为一下解构
 * render () { _c 解析标签(1.标签名. 2.属性, 3._v解析文本('hellow' + _s插值表达式就是变量(msg)), 如果有子元素继续直接_c(...))
 *  return _c('div', {id: app}, _v('hellow' + _s(msg)), ,_c(...))
 * }
*/