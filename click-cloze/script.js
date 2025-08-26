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
    var div = document.getElementById('content')
    for (var r of cs.results) {
        if (always || !r.hidden) {
            div.innerHTML += r.text
        } else {
            var span = document.createElement("span")
            span.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            span.className = 'cloze-hide'
            span.setAttribute('answer', r.text)
            div.appendChild(span)
        }
    }

    document.querySelectorAll(".cloze-hide").forEach(function (ele) {
        ele.onclick = function () {
            ele.innerHTML = ele.getAttribute('answer')
            ele.className = 'cloze-show'
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