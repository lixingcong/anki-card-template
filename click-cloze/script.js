function CardStorageClickCloze() {
    this.results = []
    this.clickClozeCount = 0 // 可以点击的个数

    this.build = function (text) {
        this.clickClozeCount = 0

        const R = /\[{2}(.*?)\]{2}/gm
        let matches
        let lastPos = 0

        this.results = []
        while ((matches = R.exec(text)) !== null) {
            const answer = matches[1]
            const startPos = matches.index
            const length = matches[0].length

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

var C = Object.freeze({ // Constant
    IdContent: 'content-div', // 在Android上用content作为id会同名冲突，因此加上div后缀
    ClassHidden: 'cloze-hide',
    ClassShown: 'cloze-show',
    Answer: 'answer',
    Spaces: '&nbsp;'.repeat(25) // 这个重复字符总宽度，适合手指点击
})

var ClickedClozeIndex = 0 // 揭开过cloze答案的序号

function show_result(always) {
    const div = document.getElementById(C.IdContent)
    ClickedClozeIndex = 0
    let clickClozeCount = 0

    for (const r of cs.results) {
        if (always || !r.hidden) {
            div.innerHTML += r.text
        } else {
            const span = document.createElement('span')
            span.id = index_to_id(clickClozeCount)
            span.innerHTML = C.Spaces
            span.className = C.ClassHidden
            span.setAttribute(C.Answer, r.text)
            div.appendChild(span)

            ++clickClozeCount
        }
    }

    document.querySelectorAll('.' + C.ClassHidden).forEach(function (span) {
        span.onclick = function () {
            showClozeAnswer(id_to_index(span.id), undefined)
        }
    })
}

function clozeAnswerHidden(idx){
    const span = document.getElementById(index_to_id(idx))
    return span.className.indexOf(C.ClassHidden) >= 0
}

// 参数show可能的值：undefined, true, false
function showClozeAnswer(idx, show){
    ClickedClozeIndex = idx

    const span = document.getElementById(index_to_id(idx))
    const hidden = span.className.indexOf(C.ClassHidden) >= 0

    if (undefined === show)
        show = hidden; // toggle

    if (show) {
        span.innerHTML = span.getAttribute(C.Answer)
        span.className = C.ClassShown
    } else {
        span.innerHTML = C.Spaces
        span.className = C.ClassHidden
    }
}

// 用键盘控制的显示和隐藏cloze答案，参数show: true/false
function showClozeAnswerByStep(show){
    let idx = ClickedClozeIndex
    if(idx < 0 || idx >= cs.clickClozeCount)
        return; // overflow

    const step = show ? 1 : -1;
    while(clozeAnswerHidden(idx) != show){
        idx += step // next or prev

        if (idx < 0) {
            ClickedClozeIndex = 0 // reset to first
            return;
        }

        if (idx >= cs.clickClozeCount) {
            ClickedClozeIndex = cs.clickClozeCount - 1 // reset to last
            return;
        }
    }

    showClozeAnswer(idx, show)
}

// for debug only
module.exports = { CardStorage }