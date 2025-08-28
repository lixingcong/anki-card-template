function EventHistoryTimer(eventName, interval){ // 事件定时器，在间隔interval（毫秒）内收集eventName所有事件，然后统一处理
    this.check = undefined
    this.timer = undefined
    this.history = []
    this.eventName = eventName // eventName 事件名，如'keydown'
    this.interval = interval

    this.timeout = function(instance){ // 没法直接传递this，因此手动传入instance
        for(var e of instance.history){
            if(instance.check(e))
                break
        }

        instance.timer = undefined
        instance.history.length = 0
        document.addEventListener(instance.eventName, instance, {once: true})
    }

    this.handleEvent = function(event) { // 使用固定名字函数 https://stackoverflow.com/a/19507086/5271632
        this.history.unshift(event)
        if (undefined === this.timer)
            this.timer = setTimeout(this.timeout, this.interval, this)
    }

    this.install=function(checkFunc){
        this.check = checkFunc // function(keyEvent) -> boolean，返回true表示停止处理历史
        this.timeout(this)
    }

    this.uninstall=function(){
        if(this.check){
            this.check=undefined
            document.removeEventListener(this.eventName, this, {once: true})
        }
    }
}

function index_to_id(index){
    return "index-" + index
}

function id_to_index(id){
    return parseInt(id.slice(6))
}

function takeContent(id) {
    var e = document.getElementById(id) // 查找id并返回该html内容，然后移除该元素
    if (e) {
        e.remove()
        return e.innerHTML
    }
    return ''
}

function show_tags(tags, divId, tagClass){
    if (tags){
        div = document.getElementById(divId)
        splited = tags.split(' ')
        for (var tag of splited) {
            var span = document.createElement('span')
            span.className = tagClass
            span.innerText = tag
            div.appendChild(span)
        }
    }
}