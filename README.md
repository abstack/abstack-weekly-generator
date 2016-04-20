# 周报表格生成器

## 开发
1. `npm install` 安装依赖
2. 'npm run dev' 启动 webpack-dev-server，即可进行开发

## 发布
1. `npm run build` 打包文件
2. `npm version [patch, minor, major, prepatch, preminor, premajor, prerelease] -m "Upgrade to %s"` 更新项目版本号
3. 在 `index.html` 中修改成对应版本号

## Todo 列表
1. 邮件直接发送功能
2. 表格行上下切换功能
3. HTML 标签转义
4. ……

## 更新日志

### v1.0.3
1. 添加项目构建脚本
2. 添加首个 E2E 测试脚本

### v1.0.2
1. 添加版本号到网站头部
2. 添加浏览器兼容提示

### v1.0.1
1. 修复 usage 中的文案错误
2. 修复 Firefox 下单元格无法编辑的问题

### v1.0.0
1. 新增表格内容自动保存功能，防止数据丢失
2. 新增清空表格数据功能
3. 修复序号无法复制的问题
4. 修复无论确认与否都会删除行的问题

### v0.2.0
1. 新增一键复制功能

### v0.1.1
1. 增加删除行功能
2. 修正文字量变多的 bug
3. 改善说明文字显示效果

### v0.1.0
1. Tab 切换到下一个单元格
2. Shift + Tab 切换到上一个单元格
3. Enter 新增一行