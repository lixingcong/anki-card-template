function CardStorage() {
    this.options_text = [] // ['SelA','SelB','SelC']
    this.options_prefix = [] // ['A','B','C']

    this.to_shuffled = [] // [1,0,2] 原下标 => 映射后下标
    this.from_shuffled = [] // [1,0,2] 映射后下标 => 原下标

    this.answer_idxes = [] // [1,2] 原下标
    this.single_choice = false // 是否单选

    this.selected = [] // [false, false, true, false] 给外界选中的，数组下标是映射后的
    this.indeterminate = false // 不定项

    this.build = function(options, answers){
        var options_splited = options.split(/<br>/g).map(function (str) {
            return str.trim()
        }).filter(function (str) {
            return str != ""
        })

        this.options_text = options_splited.map(function (str) {
            return str.replace(/^[A-Za-z0-9][\.\|、\s]{1,}/i, "")
        })

        this.options_prefix = options_splited.map(function (str) {
            return str[0]  // 这里只取一个字符
        })

        var answerArray = answers.split('')

        if (answerArray.length > 0 && '?' == answerArray[0]) {
            this.indeterminate = true
            answerArray.shift()
        } else {
            this.indeterminate = false
        }

        answerArray.sort()
        this.answer_idxes = []
        for(var option_idx = 0; option_idx<this.options_prefix.length;++option_idx){
            var option_prefix = this.options_prefix[option_idx]

            for(var answer_idx =0; answer_idx<answerArray.length;++answer_idx){
                if(answerArray[answer_idx] == option_prefix){
                    this.answer_idxes.push(option_idx)
                    break
                }
            }
        }
        this.single_choice = this.answer_idxes.length <= 1

        var shuffled = shuffle(this.options_prefix.length)
        this.to_shuffled = shuffled[0]
        this.from_shuffled = shuffled[1]

        this.reset_selected()
    }

    // 返回文本数组
    this.shuffled_options = function(){
        var cs = this
        return this.from_shuffled.map(function(idx){
            return cs.options_text[idx]
        })
    }

    // 返回数组，每一项是'ok','ng','miss',undefined
    this.commit = function(){
        var ok = 'ok'
        var ng = 'ng'
        var miss = 'miss'
        var ret = this.options_text.map(function(){return undefined})

        for(var i =0;i<ret.length;++i){
            var expect = this.answer_idxes.includes(this.from_shuffled[i])
            var actual = this.selected[i]

            if(expect && actual)
                ret[i] = ok
            else if(!expect && !actual)
                ret[i] = undefined
            else if(expect && !actual)
                ret[i] = miss
            else
                ret[i] = ng
        }

        return ret
    }

    // 选中一项
    this.toggle = function(idx, selected){
        if(0 == this.answer_idxes.length) // Missing
            return

        if(this.single_choice)
            this.reset_selected() // 单选模式

        this.selected[idx] = selected
    }

    // 重置选中
    this.reset_selected = function(){
        this.selected = this.options_text.map(function () {
            return false
        })
    }

    // 返回['A','C']，为乱序之后的值
    this.selected_answers = function(){
        ret = []
        for(var i =0;i<this.selected.length;++i){
            if(this.selected[i]){
                ret.push(this.options_prefix[i])
            }
        }
        return ret.sort()
    }

    // 返回['A','C']，为乱序之后的值
    this.correct_answers = function(){
        ret = []
        for(var i =0;i<this.answer_idxes.length;++i){
            var shuffled_index = this.to_shuffled[this.answer_idxes[i]]
            ret.push(this.options_prefix[shuffled_index])
        }
        return ret.sort()
    }
}

function init_options(bindClick) {
    if(cs.indeterminate)
        document.getElementById("questionType").innerText = '【不定项】'
    else if(!cs.single_choice)
        document.getElementById("questionType").innerText = '【多选】'

    var div = document.getElementById("options")
    var optionClass = 'option'

    cs.shuffled_options().forEach(function (option, idx) {
        var li = document.createElement('li')
        li.className = optionClass
        li.innerHTML = option
        li.id = to_option_id(idx)
        div.appendChild(li)
    })

    if(bindClick){
        document.querySelectorAll('.' + optionClass).forEach(function (e) {
            e.onclick = function(){toggle(e)}
        })
    }
}

function toggle(li) {
    var selectedKey = 'selected'
    var this_idx = from_option_id(li.id)
    var oldState = li.className.indexOf(selectedKey) >= 0

    // set to model
    cs.toggle(this_idx, !oldState)

    // redraw
    for(var idx =0;idx<cs.selected.length;++idx){
        var newClass = cs.selected[idx] ? 'option ' + selectedKey : 'option'
        document.getElementById(to_option_id(idx)).className = newClass
    }
}

function show_results() {
    var results = cs.commit()
    for(var idx =0;idx<results.length;++idx){
        var r = results[idx]
        if(r){
            var newClass = undefined
            if('ok' == r)
                newClass = 'correct'
            else if('ng' == r)
                newClass = 'wrong'
            else if('miss' == r)
                newClass = 'should-select'

            if(newClass)
                document.getElementById(to_option_id(idx)).className = 'option '+ newClass
        }
    }

    var ca = cs.correct_answers().join('')
    var ya = cs.selected_answers().join('')
    document.getElementById('correct-answer').innerHTML = ca
    document.getElementById('your-answer').innerHTML = (ya == ca) ? '太棒了！': '你选了' + ya
}

function show_tags(tags){
    if (tags){
        div = document.getElementById("tags")
        splited = tags.split(' ')
        for (var tag of splited) {
            var span = document.createElement('span')
            span.className = 'tag'
            span.innerText = tag
            div.appendChild(span)
        }
    }
}

function to_option_id(idx){
    return "index_" + idx
}

function from_option_id(str){
    return parseInt(str.slice(6))
}

function shuffle(count){
    var a2b = Array.from(Array(count).keys())
    var b2a = Array.from(Array(count).keys())
    var i = count

    while (i > 0) {
        // random index
        var r = Math.floor(Math.random() * i)
        --i

        if(r != i){
            // swap
            var x = a2b[i]
            a2b[i] = a2b[r]
            a2b[r] = x
        }

        // reverse table
        b2a[a2b[i]] = i
    }

    return [a2b, b2a]
}

// for debug only
module.exports ={CardStorage, shuffle}