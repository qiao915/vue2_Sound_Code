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
    ├── alias.js          // 模块导入所有源代码和测试中使用的别名
    ├── config.js         // 包含在'dist/`中找到的所有文件的生成配置
    ├── build.js          // 对 config.js 中所有的rollup配置进行构建
├── scripts               // 构建脚本
├── src                   // 源码
    ├── compiler          // 编译器相关
        ├── codegen       // 把AST转换为Render函数
        ├── directives    // 通用生成Render函数之前需要处理的指令
        └──parser         // 解析模版成AST
    ├── core              // 核心代码 ******
    ├── components        // 通用组件
       ├── global-api     // 全局API
       ├── instance       // 构造函数，实例化相关内容，生命周期、事件等
       ├── observer       // 响应式核心目录，双向数据绑定相关文件
       ├── util           // 工具方法
       ├── vdom           // 虚拟DOM相关
       ├── config.js
       └── index.js
    ├── platforms         // 和平台相关的内容
        ├── web           // web端
           ├── compiler   // web端编译相关代码，用来编译模版成render函数basic.js
           ├── runtime    // web端运行时相关代码，用于创建Vue实例等
           ├── server     // 服务端渲染
           └── util       // 相关工具类
      	└── weex          // 基于通用跨平台的 Web 开发语言和开发经验，来构建 Android、iOS 和 Web 应用
    ├── server            // 服务端渲染（ssr）				
    ├── sfc               // 转换单文件组件（*.vue）
    └── shared            // 全局共享的方法和变量
├── test                  // 测试用例
└── types                 // ts类型声明
```

