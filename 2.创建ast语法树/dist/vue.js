(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  //重新写数组
  //(1) 获取原来的数组方法
  var oldArrayProtoMethods = Array.prototype; //（2）继承

  var ArrayMethods = Object.create(oldArrayProtoMethods); //劫持

  var methods = ["push", "pop", "unshift", "shift", "splice"];
  methods.forEach(function (item) {
    ArrayMethods[item] = function () {
      // {list:[]} list.push()
      console.log('劫持数组');

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayProtoMethods[item].apply(this, args); // console.log(args) // [{b:6}]
      //问题 ：数组追加对象的情况  arr.push({a:1})

      var inserted;

      switch (item) {
        case 'push':
        case "unshift":
          inserted = args;
          break;

        case "splice":
          inserted = args.splice(2); //arr.splice(0,1,{a:6})

          break;
      } // console.log( inserted)
      // console.log(this)


      var ob = this.__ob__; //

      if (inserted) {
        ob.observeArray(inserted); // 对我们的添加的对象进行劫持
      }

      return result;
    };
  });

  function observer(data) {
    // console.log(data)
    // 给 data 定义一个属性
    //1判断
    if (_typeof(data) != 'object' || data == null) {
      return data;
    } // 1对象通过一个类


    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      Object.defineProperty(value, "__ob__", {
        enumerable: false,
        value: this
      }); //判断数据
      //  console.log(value)

      if (Array.isArray(value)) {
        //  list:[1,2,3]
        value.__proto__ = ArrayMethods; // console.log('数组')
        //如果你是数组对象

        this.observeArray(value); // 处理数组对象 [{a:1}]
      } else {
        this.walk(value); //遍历
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //  {  msg:'hello'，a}
        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
          //对象我们的每个属性进行劫持
          var key = keys[i]; //

          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        //[{a:1}] 
        for (var i = 0; i < value.length; i++) {
          observer(value[i]);
        }
      }
    }]);

    return Observer;
  }(); //对对象中的属性进行劫持


  function defineReactive(data, key, value) {
    //{a:{b:1}}
    observer(value); //深度代理

    Object.defineProperty(data, key, {
      get: function get() {
        // console.log('获取')
        return value;
      },
      set: function set(newValue) {
        // console.log('设置')
        if (newValue == value) return;
        observer(newValue); //如果用户设置的值是对象

        value = newValue;
      }
    });
  } // vue2     Object.defineProperty  缺点  对象中的一个属性   { a:1,b:2}
  // {a:{}，list:[]}
  // 总结 ：（1）对象 
  //  1 Object.defineProperty  有缺点 只能 对象中的一个属性 进行劫持  
  //  2 遍历 {a:1,b:2 ,obj:{}}
  //  3 递归  get   set
  // 2数组 { list:[1,2,3,4], arr:[{a:1}]} 
  //  方法函数劫持 ，劫持数组方法  arr.push（1）

  function initState(vm) {
    var opts = vm.$options; //  console.log(opts)
    //判断

    if (opts.props) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.watch) ;

    if (opts.computed) ;

    if (opts.methods) ;
  }


  function initData(vm) {
    //  console.log( vm) // （1） 对象  （2） 函数
    var data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data; //注意  this
    //data数据进行劫持
    //将data 上的所有属性代理到 实例上 vm  {a:1,b:2}

    for (var key in data) {
      proxy(vm, "_data", key);
    }

    observer(data);
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  } // data{}   (1) 对象  （2）数组    { a:{b:1},list:[1,2,3], arr:[{}]}

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
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名称

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //<span:xx>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  //<div id="app"></div>

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  // 遍历
  // 创建ast语法树

  function createASTElement(tag, attrs) {
    //<div id="app"> hello {{msg}} <h></h></div>
    return {
      tag: tag,
      // 元素 (div ,span)
      attrs: attrs,
      // 属性
      children: [],
      // 子节点
      type: 1,
      // 类型
      parent: null // 是否有父元素

    };
  }

  function start(tag, attrs) {
    //开始标签
    console.log(tag, attrs, '开始的标签');
    var element = createASTElement(tag, attrs);
    console.log('element开始标签', element);
  }

  function charts(text) {
    //获取文本
    console.log(text, '文本');
  }

  function end(tag) {
    //结束的标签
    console.log(tag, '结束标签');
  }

  function parseHTML(html) {
    //<div id="app"> hello {{msg}} <h></h></div>  //  开始标签  文本  结束标签
    while (html) {
      // html  为空结束
      //判断标签 <>
      var textEnd = html.indexOf('<'); // 0

      if (textEnd === 0) {
        //标签
        //（1） 开始标签
        var startTagMatch = parseStartTag(); // 开始标签的内容 {}

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } //结束标签 


        console.log(500);
        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } //文本


      var text = void 0;

      if (textEnd > 0) {
        console.log(textEnd); //获取文本内容

        text = html.substring(0, textEnd); // console.log(text)
      }

      if (text) {
        advance(text.length);
        charts(text);
      } // break 

    }

    function parseStartTag() {
      //
      var start = html.match(startTagOpen); // 1结果  2false

      console.log(start, 'start');

      if (start) {
        //创建ast 语法树
        var match = {
          tagName: start[1],
          attrs: []
        }; //删除 开始标签 <div 属性>

        advance(start[0].length); //属性
        //注意  属性有多个,需要遍历
        //注意 >

        var attr; // 属性

        var _end; // 结束标签


        console.log('html.match(startTagClose)', html.match(startTagClose));

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          console.log(attr, 'attr'); // 属性

          console.log('html.match(startTagClose)', html.match(startTagClose));
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          console.log(_end, 'end');
          advance(_end[0].length);
          return match;
        }
      }
    }

    function advance(n) {
      html = html.substring(n); // console.log(html)
    }
  }

  function compileToFunction(el) {
    console.log('el', el);
    var ast = parseHTML(el);
    console.log('ast', ast);
  }

  /*
   * @Author: yyds白 11935851+yyds-white@user.noreply.gitee.com
   * @Date: 2023-05-11 20:55:45
   * @LastEditors: yyds白 11935851+yyds-white@user.noreply.gitee.com
   * @LastEditTime: 2023-05-11 21:09:05
   * @FilePath: \vue_code\2.创建ast语法树\src\init.js
   * @Description: 初始化文件方法
   * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
   */
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // console.log(options)
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm); //渲染模板  el 

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }; //创建 $mount


    Vue.prototype.$mount = function (el) {
      console.log(el); // el template  render

      var vm = this;
      el = document.querySelector(el); //获取元素

      var options = vm.$options;

      if (!options.render) {
        //没有
        var template = options.template;

        if (!template && el) {
          //获取html
          el = el.outerHTML;
          console.log(el); //<div id="app"> hello {{msg}}</div>
          //变成ast语法树

          console.log('el', el);
          compileToFunction(el); //render()
          //
        }
      }
    };
  }

  function Vue(options) {
    //初始化
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
