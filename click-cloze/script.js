function CardStorage() {
    this.results = []
    this.clickClozeCount = 0 // 可以点击的个数

    this.build = function (text) {
        this.clickClozeCount = 0

        var R = /\[{2}(.*?)\]{2}/gm
        var matches
        var lastPos = 0

        this.results = []
        while ((matches = R.exec(text)) !== null) {
            var answer = matches[1]
            var startPos = matches.index
            var length = matches[0].length

            if (startPos > lastPos)
                this.appendResult(false, text.slice(lastPos, startPos))

            ++this.clickClozeCount
            this.appendResult(true, answer)

            lastPos = startPos + length
        }

        if (lastPos < text.length - 1)
            this.appendResult(false, text.slice(lastPos, text.length - 1))
    }

    this.appendResult = function (h, t) {
        this.results.push({ hidden: h, text: t })
    }
}

var HiddenClass = 'cloze-hide'
var ShowClass = 'cloze-show'
var Answer = 'answer'
var Spaces = '&nbsp;'.repeat(25) // 这个重复字符总宽度，适合手指点击
var ClickedClozeIndex = 0 // 揭开过cloze答案的序号

function show_result(always) {
    var div = document.getElementById('content-div') // 在Android上用content作为id会同名冲突，因此加上div后缀
    ClickedClozeIndex = 0
    var clickClozeCount = 0

    for (var r of cs.results) {
        if (always || !r.hidden) {
            div.innerHTML += r.text
        } else {
            var span = document.createElement('span')
            span.id = index_to_id(clickClozeCount)
            span.innerHTML = Spaces
            span.className = HiddenClass
            span.setAttribute(Answer, r.text)
            div.appendChild(span)

            ++clickClozeCount
        }
    }

    document.querySelectorAll('.' + HiddenClass).forEach(function (span) {
        span.onclick = function () {
            showClozeAnswer(id_to_index(span.id), undefined)
        }
    })
}

function clozeAnswerHidden(idx){
    var span = document.getElementById(index_to_id(idx))
    return span.className.indexOf(HiddenClass) >= 0
}

// 参数show可能的值：undefined, true, false
function showClozeAnswer(idx, show){
    ClickedClozeIndex = idx

    var span = document.getElementById(index_to_id(idx))
    var hidden = span.className.indexOf(HiddenClass) >= 0

    if (undefined === show)
        show = hidden; // toggle

    if (show) {
        span.innerHTML = span.getAttribute(Answer)
        span.className = ShowClass
    } else {
        span.innerHTML = Spaces
        span.className = HiddenClass
    }
}

// 用键盘控制的显示和隐藏cloze答案，参数show: true/false
function showClozeAnswerByStep(show){
    var idx = ClickedClozeIndex
    var currentShow = !clozeAnswerHidden(idx)
    if(currentShow == show)
        idx += (show ? 1 : -1) // next or prev

    if(idx >= 0 && idx < cs.clickClozeCount)
        showClozeAnswer(idx, show)
}

// for debug only
module.exports = { CardStorage }