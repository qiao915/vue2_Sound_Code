## Vue2.x 源码学习

### 1，获取vue 

项目地址：https://github.com/vuejs/vue

迁出项目： git clone https://github.com/vuejs/vue.git

当前版本号：2.6.10

### 2，文件目录介绍

```
├── .circleci
├── .github
├── benchmarks            // 性能测试文件
├── dist                  // 发布目录
├── examples              // 范例
├── flow                  // 静态类型检查类型声明文件
├── packages              // 包含服务端渲染和模板编译器两种不同的NPM包，是提供给不同使用场景使用的
├── scripts               // 构建脚本
    ├── alias.js          // 模块导入所有源代码和测试中使用的别名
    ├── config.js         // 包含在'dist/`中找到的所有文件的生成配置
    └── build.js          // 对 config.js 中所有的rollup配置进行构建
├── src                   // 源码
    ├── compiler          // 编译器相关
        ├── codegen       // 把AST转换为Render函数
        ├── directives    // 通用生成Render函数之前需要处理的指令
        └── parser        // 解析模版成AST
    ├── core              // 核心代码 重点
        ├── components    // 通用组件  keep-alive (所有平台通用)
        ├── global-api    // 全局API
        ├── instance      // 构造函数，实例化相关内容，生命周期、事件等
        ├── observer      // 响应式核心目录，双向数据绑定相关文件
        ├── util          // 工具方法
        ├── vdom          // 虚拟DOM相关
        ├── config.js
        └── index.js
    ├── platforms         // 和平台相关的内容
        ├── web           // web端
            ├── compiler   // web端编译相关代码，用来编译模版成render函数basic.js
            ├── runtime    // web端运行时相关代码，用于创建Vue实例等
                ├── index.js    // 定义$mount   重点
            ├── server     // 服务端渲染
            ├── util       // 相关工具类
            ├── entry-runtime-with-compiler.js    //入口   重点
      	└── weex          // 基于通用跨平台的 Web 开发语言和开发经验，来构建 Android、iOS 和 Web 应用
    ├── server            // 服务端渲染（ssr）				
    ├── sfc               // 转换单文件组件（*.vue）
    └── shared            // 全局共享的方法和变量
├── test                  // 测试用例
└── types                 // ts类型声明
```
### 3，调试环境搭建
安装依赖： npm i

安装rollup： npm i -g rollup

修改dev脚本，添加sourcemap，package.json
```json
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```
运行开发命令： npm run dev


#### 术语解释（输出包格式 见dist文件夹下）：
```
  runtime：仅包含运行时，不包含编译器（不能使用template模板） 
  common：只能使用require方式导入。cjs规范
  esm：ES模块，用于webpack2及以上的打包工具
  umd: （例如vue.js。什么都没有加的）universal module deﬁnition，兼容cjs和amd，用于浏览器
```

### 4，入口
查看 package.json 中的dev
```json
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```
dev脚本中-c scripts/config.js 指明配置文件所在

参数 TARGET:web-full-dev 指明输出文件配置项
```javascript
// Runtime+compiler development build (Browser) 
{  
   'web-full-dev': {
      entry: resolve('web/entry-runtime-with-compiler.js'),   //入口文件   web/ 真是路劲见 scripts/slias.js
      dest: resolve('dist/vue.js'),
      format: 'umd',
      env: 'development',
      alias: { he: './entity-decoder' },
      banner
    }
}
```

```javascript
const resolve = p => {
  /* 斜杠截取 */
  const base = p.split('/')[0]
  /*./alias.js
  * {
  *    vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  *    compiler: resolve('src/compiler'),
  *    core: resolve('src/core'),
  *    shared: resolve('src/shared'),
  *    web: resolve('src/platforms/web'),
  *    weex: resolve('src/platforms/weex'),
  *    server: resolve('src/server'),
  *    sfc: resolve('src/sfc')
  * }
  * */
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```
通过resolve()方法得到入口文件路径  为src\platforms\web\entry-runtime-with-compiler.js




### 5，初始化流程 

#### 入口 platforms/web/entry-runtime-with-compiler.js
扩展默认$mount方法：处理template或el选项   
```javascript
const mount = Vue.prototype.$mount

Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  //...
}
```
重新$mount




#### platforms/web/runtime/index.js
安装web平台特有指令和组件 定义__patch__：补丁函数，执行patching算法进行更新
定义$mount：挂载vue实例到指定宿主元素（获得dom并替换宿主元素）   

#### core/index.js
初始化全局api
具体如下：
```javascript
Vue.set = set 
Vue.delete = del 
Vue.nextTick = nextTick 
initUse(Vue) // 实现Vue.use函数 
initMixin(Vue) // 实现Vue.mixin函数 
initExtend(Vue) // 实现Vue.extend函数 
initAssetRegisters(Vue) // 注册实现Vue.component/directive/filter

```

#### core/instance/index.js
Vue构造函数定义 
定义Vue实例API
```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  /*构造函数仅执行了_init */
  this._init(options)

}

initMixin(Vue) // 实现init函数
stateMixin(Vue) // 状态相关api $data,$props,$set,$delete,$watch
eventsMixin(Vue) // 事件相关api $on,$once,$off,$emit
lifecycleMixin(Vue) // 生命周期api _update,$forceUpdate,$destroy
renderMixin(Vue) // 渲染api _render,$nextTick

```

#### core/instance/init.js
创建组件实例，初始化其数据、属性、事件等
```javascript
  initLifecycle(vm); // $parent,$root,$children,$refs
  initEvents(vm); // 处理父组件传递的事件和回调
  initRender(vm); // $slots,$scopedSlots,_c,$createElement
  callHook(vm, 'beforeCreate')
  initInjections(vm) // 获取注入数据
  initState(vm) // 初始化props，methods，data，computed，watch 
  initProvide(vm) // 提供数据注入 
  callHook(vm, 'created')
```

#### mountComponent core/instance/lifecycle.js
执行挂载，获取vdom并转换为dom  


#### render() src\core\instance\render.js 
渲染组件，获取vdom  


#### update() src\core\instance\lifecycle.js 
执行更新，将传入vdom转换为dom，初始化时执行的是dom创建操作


#### 总体流程：
new Vue() => _init() => $mount() => _render() => _update() 