# 说明

一个简单的填空题模板，特点：点击后显示答案，再次点击隐藏答案。

基于[Kevin-Anki-Templates](https://github.com/kevin2li/Kevin-Anki-Templates)的填空题JS逻辑修改

卡片字段

- `content`问题（含答案），其中需要填空的部份，用`[[`和`]]`括起来
- `notes`附注，可选字段

# 按键选中

支持`Ctrl+Alt+1`和`Ctrl+Alt+2`快捷键，进行填空答案的翻看。设置该快捷键的目的在于外接一个自定义蓝牙键盘，远程答题。

# 单元测试

```bash
nvm use 22
node test.js
```
