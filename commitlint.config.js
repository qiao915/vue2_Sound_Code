/*
	Created by qiao.wu@pingcl.com on 2020/9/24.
*/
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
        "style", // 代码格式修改, 注意不是 css 修改
        "chore" //其他修改, 比如构建流程, 依赖管理.
      ],
    ],
    "subject-full-stop": [0, "never"], // subject结尾不能有句号
    "subject-case": [0, "never"],
  },
};
