/*
 * @Author: yyds白 tomorrowBg@163.com
 * @Date: 2023-05-18 22:18:02
 * @LastEditors: yyds白 tomorrowBg@163.com
 * @LastEditTime: 2023-05-18 22:18:02
 * @FilePath: \vue_code\2.创建ast语法树\src\compile\parseAst.js
 * @Description: ast语法树解析
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
//<div id="app"> hello {{msg}} <h></h></div>
//ast语法树 {}    vnode {}

/**
 * {
 * tag:'div',
 * attrs:[{id:"app"}],
 * children:[{tag:null,text:hello},{tag:'div'}]
 * }
 * 
 * 
 * 
 * 
 */
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //<span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
//<div id="app"></div>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{}}
// 遍历
// 创建ast语法树
function createASTElement(tag, attrs) {
    //<div id="app"> hello {{msg}} <h></h></div>
    return {
        tag, // 元素 (div ,span)
        attrs, // 属性
        children: [], // 子节点
        type: 1, // 类型
        parent: null // 是否有父元素
    }
}
let root; // 根元素
let createParent; // 当前元素的父元素
let stack = []; // 数据解构 => 栈 <div id="app"> hello {{msg}} <h></h></div> , [] => 首先匹配到第一个开始标签<div id="app"> 将div添加进数组 [div] => 2. 匹配到<h> 开始标签 添加到数组, [div, h] => 3.匹配到</h> h 的结束标签 将 h从数组中删除, [div], 这样来回循环的数组中最后一个就是父元素 === 有问题
function start(tag, attrs) { //开始标签
    console.log(tag, attrs, '开始的标签')
    let element = createASTElement(tag, attrs)
    console.log('element开始标签', element);
    if (!root) {
        root = element
    }
    createParent = element
    stack.push(element)
    console.log('stack', stack);
}
function charts(text) { //获取文本
    console.log(text, '文本')
    // 空格
    text = text.replace(/s/g, '')
    if (text) {
        createParent.children.push({
            type: 3,
            text
        })
    }
}
function end(tag) { //结束的标签
    console.log(tag, '结束标签1',stack)
    let element = stack.pop() // 获取到最后一个元素
    createParent = stack[stack.length - 1]
    if (createParent) { // 判断是否有闭合标签 </div>
        // 元素得关闭
        element.parent = createParent.tag
        createParent.children.push(element)
    }
}
export function parseHTML(html) {
    //<div id="app"> hello {{msg}} <h></h></div>  //  开始标签  文本  结束标签
    while (html) { // html  为空结束
        //判断标签 <>
        let textEnd = html.indexOf('<') // 0
        console.log('%c [ textEnd ]-66', 'font-size:13px; background:pink; color:#bf2c9f;', textEnd)
        if (textEnd === 0) { //标签
            //（1） 开始标签
            const startTagMatch = parseStartTag() // 开始标签的内容 {}
            console.log('startTagMatch', startTagMatch); // => {tagName: 'div', attrs: Array(2)}
            if(startTagMatch){
                console.log('2', 2);
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
             //结束标签 
            console.log(500)
            let endTagMatch = html.match(endTag)
            console.log('endTagMatch结束标签', endTagMatch);
            if(endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
            }
        }
        console.log(600);
        //文本
        let text
        if (textEnd > 0) {
            console.log(textEnd)
            //获取文本内容
            text = html.substring(0, textEnd)
            console.log(text)
        }
        if (text) {
            advance(text.length)
            charts(text)  
        }
        // break 
    }
    function parseStartTag() {
        //
        console.log('1', 1);
        const start = html.match(startTagOpen) // 1结果  2false
        console.log(start, 'start') // => ['<div', 'div', index: 0, input: '<div id="app"> hello {{msg}}</div>', groups: undefined]
        if(start){
             //创建ast 语法树
        let match = {
            tagName: start[1],
            attrs: []
        }
        //删除 开始标签 <div 属性>
        advance(start[0].length) // => <div  id="app"> hello {{msg}}</div> =>  id="app"> hello {{msg}}</div>
        //属性
        //注意  属性有多个,需要遍历
        //注意 >
        let attr // 属性
        let end // 结束标签
        console.log('html.match(startTagClose)结束标签', html.match(startTagClose)); // => null
        console.log('html.match(attribute)属性', html.match(attribute)); // => [' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app"> hello {{msg}}</div>', groups: undefined]
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            console.log(attr, 'attr') // 属性
            console.log('html.match(startTagClose)', html.match(startTagClose));
            match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            console.log('match', match);
            advance(attr[0].length) // => value="12"> hello {{msg}}</div>
        }
        if (end) {
            console.log(end, 'end')
            advance(end[0].length)
            return match
        }

        }
    }
    function advance(n) {
        html = html.substring(n)
        console.log(html, 'advance删除')
    }
    console.log('root', root);
    return root
}