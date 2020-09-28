## Vue2.x 源码学习

### 1，获取vue 

项目地址：https://github.com/vuejs/vue

迁出项目： git clone https://github.com/vuejs/vue.git

当前版本号：2.6.10

### 2，文件目录介绍

```
├── learning-questions      // 通过问题学习源码
├── vue                     // vue2.x 源码学习
├── commitlint.config.js    // git commit 规范 
```






## 前端git提交信息规范

### 安装husky 增加git钩子
```
npm install husky --save-dev
```

### 在package.json 添加
``` json
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

### 安装 commitlint相关模块
```
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

### 增加 commitlint 配置文件 commitlint.config.js
``` js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", //新特性
        "fix", //修复问题
        "docs", //文档修改
        "perf", // 提升性能的修改
        "style", // 代码格式修改, 注意不是 css 修改
        "refactor", //代码重构
        "test", // 测试用例修改
        "chore", //其他修改, 比如构建流程, 依赖管理.
        "revert", // 代码回滚
      ],
    ],
    "subject-full-stop": [0, "never"], // subject结尾不能有句号
    "subject-case": [0, "never"],
  },
};
```


### 提交规范（注意冒号后面有空格）
<type>: <subject>
示例：
git commit -m 'feat: 增加 xxx 功能'
git commit -m 'bug: 修复 xxx 功能'



### type可选类型
"feat", //新特性

"fix", //修复bug

"docs", //文档修改

"perf", // 提升性能的修改

"style", // 代码格式修改, 注意不是 css 修改（不影响代码运行的变动）

"refactor", //代码重构（即不是新增功能，也不是修改bug的代码变动）

"test", // 测试用例修改

"chore", //其他修改, 比如构建流程, 依赖管理,或辅助工具的变动