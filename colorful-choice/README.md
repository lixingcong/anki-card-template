# 说明

基于[anki-awesome-select](https://github.com/git9527/anki-awesome-select)的CSS样式修改

|亮色主题|暗色主题|
|--|--|
|![](images/preview-light.png)|![](images/preview-dark.png)|

卡片字段

- `id`排序的主键，建议采用不重复的数字
- `question`问题，如`以下选项正确的是？`
- `options`选项，以回车换行分割，每行以一个字符开头（除了`?`特殊标记以外的任意字符），后跟一个英文句号。如

```
A.第一项
B.第二项
C.第三项
D.第四项
```

- `answer`答案，如`ACD`，注意必须与`options`的选项对应，如在答案前加上`?`表示不定项（即正确选项个数至少1个）
- `notes`附注，可选字段。可以使用`[[A]]`这种括起来的指示原题的选项，在显示卡牌时会自动替换为乱序后的选项，如`[[A]]`自动被替换为`C`
- `reference`来源，可选字段，用于指示题目第几题，如`2025年卷第10题`

# 按键选中

支持`Ctrl+Alt+数字`快捷键。设置该快捷键的目的在于外接一个自定义蓝牙键盘，远程答题。

# 单元测试

```bash
nvm use 22
node test.js
```
