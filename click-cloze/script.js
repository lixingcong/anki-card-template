function CardStorage() {
    this.results = []

    this.build = function (text) {
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

function show_result(always) {
    var div = document.getElementById('content-div') // 在Android上用content作为id会同名冲突，因此加上div后缀
    var hiddenClass = 'cloze-hide'
    var showClass = 'cloze-show'
    var answerAttribute = 'answer'
    var spaces = '&nbsp;'.repeat(25) // 这个重复字符总宽度，适合手指点击

    for (var r of cs.results) {
        if (always || !r.hidden) {
            div.innerHTML += r.text
        } else {
            var span = document.createElement('span')
            span.innerHTML = spaces
            span.className = hiddenClass
            span.setAttribute(answerAttribute, r.text)
            div.appendChild(span)
        }
    }

    document.querySelectorAll('.' + hiddenClass).forEach(function (e) {
        e.onclick = function () {
            if (-1 != e.className.indexOf(hiddenClass)) {
                e.innerHTML = e.getAttribute(answerAttribute)
                e.className = showClass
            } else {
                e.innerHTML = spaces
                e.className = hiddenClass
            }
        }
    });
}

function show_tags(tags) {
    if (tags) {
        tags = tags.split(' ')
        var tagList = ''
        for (var tag of tags) {
            if (tag)
                tagList += '<span class="tag">' + tag + '</span>'
        }
        document.getElementById("tags").innerHTML = tagList
    }
}

// for debug only
module.exports = { CardStorage }