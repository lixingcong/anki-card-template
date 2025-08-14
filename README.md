# 原理

利用持续存储，传递数据，从正面卡片到背面。

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

# 其它API

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