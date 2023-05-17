// 打包的配置文件
// 配置rollup
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js', // 打包的入口文件
    output: { // 打包的出口文件
        file: 'dist/vue.js',
        format: 'umd', // 打包的方式, 在window上就可以上就可以得到vue
        name: 'Vue', // 设置的全局变量
        sourcemap: true, // 映射
    },
    plugin: [
        babel({ // 将高级语法转为 低级语法
            exclude: 'node_modules/**', // /**意思是排除node_modules文件夹下的所有文件
        }),
        serve({ // 开启一个服务
            port: '8080', // 端口号
            contentBase: '', // 配置开启服务要找的页面, 如果值是空字符串,就是当前目录
            openPage: '/index.html',
            open: true // 运行之后打开地址
        })
    ]
}