# 原理

利用持续存储，传递数据，从正面卡片到背面。

# 编译

```bash
bash release.sh FOLDER
```

FOLDER的值，就是文件夹名字，如`colorful-choice`。编译结果输出到`/tmp/FOLDER`

# 样式表和JS代码合并成一份

为了复用js代码，可以将css和js同时写入一份。只需在Anki编辑器中央插入`</style><script>`，末尾加上`</script>`即可，如：

```
.card {
    background-color: white;
}

</style>

<script>
console.log("This is my script");
</script>
```

# anki调试

## 桌面平台

```bash
export QTWEBENGINE_REMOTE_DEBUGGING=8080
./anki
```

浏览器打开`localhost:8080`即可

## 安卓平台

参考[调试文档](https://github.com/ankidroid/Anki-Android/wiki/Development-Guide)中有关于`USB Debug`的信息

- 在设置->关于，点击6下程序大图标，开启开发者调试工具。
- Android系统中开启USB调试
- 使用Chrome浏览器打开`chrome://inspect`

# 其它笔记

## 关于ES6

Anki是支持的，但是css和js合并成一个文件了，每次都加载一遍script，会在控制台中打印很多`already declare`的错误。

用传统的javascript就不会有错误提示。

## 判断平台并显示答案

```javascript
function flipToBack() {
    if (typeof pycmd !== "undefined")
        pycmd("ans")
    else if (typeof study !== "undefined")
        study.drawAnswer()
    else if (typeof AnkiDroidJS !== "undefined")
        showAnswer()
    else if (window.anki && window.sendMessage2)
        window.sendMessage2("ankitap", "midCenter")
}
```

## 绑定按键事件

注意front.html中绑定一个keyup事件，编辑卡片时，会再次绑定，导致重复触发。解决：使用定时器（类似`QTimer::singleShot`实现）

关于按键事件的bug

- linux，监听事件使用keydown是可以的，使用keypress不可以（因为keypress已经被废弃了）
- windows，使用keydown监听，不兼容外接sayo小键盘

## 传给js的字符串有转义

考察以下代码

```javascript
cs.build('{{Question}}')
```

如果Question字段含有特殊字符，比如双引号，会导致解析异常。解决：将Question字段放入HTML标记块`<code>`中，然后动态取出
