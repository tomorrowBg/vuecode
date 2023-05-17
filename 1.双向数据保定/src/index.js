// 引入初始化的方法
import { initMixin } from "./init"
function Vue (options) {
    // 这里的options就是初始化的data,methods....vue上的方法
    // init 初始化的方法 (模块化)
    console.log('1');
    this._init(options)
}
console.log('3');
initMixin(Vue)
export default Vue