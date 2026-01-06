function CardStorageColorfulChoice() {
    this.options_text = [] // ['SelA','SelB','SelC']
    this.options_prefix = [] // ['A','B','C']

    this.to_shuffled = [] // [1,0,2] 原下标 => 映射后下标
    this.from_shuffled = [] // [1,0,2] 映射后下标 => 原下标

    this.answer_idxes = [] // [1,2] 原下标
    this.single_choice = false // 是否单选

    this.selected = [] // [false, false, true, false] 给外界选中的，数组下标是映射后的
    this.indeterminate = false // 不定项

    this.notes = ''

    this.build = function(options, answers, notes){
        const options_splited = options.split(/<br>/g).map(s => s.trim()).filter(s => s.length>0)
        this.options_text = options_splited.map(s => s.replace(/^[\x00-\x7F][\.\|、\s]{1,}/i, ''))
        const orignal_options_prefix = options_splited.map(s => s[0]) // 这里只取一个字符

        const answerArray = answers.split('')
        if (answerArray.length > 0 && '?' == answerArray[0]) {
            this.indeterminate = true
            answerArray.shift()
        } else {
            this.indeterminate = (0 == answerArray.length) // 没有正确答案的情况，也视作不定项
        }

        this.answer_idxes = []
        for(let i = 0; i<orignal_options_prefix.length;++i){
            const option_prefix = orignal_options_prefix[i]

            for(let j =0; j<answerArray.length;++j){
                if(answerArray[j] == option_prefix){ // found correct answer index
                    this.answer_idxes.push(i)
                    break
                }
            }
        }
        this.answer_idxes.sort()

        this.options_prefix = orignal_options_prefix.map((_, idx) => String.fromCharCode(idx + 65)) // map to A...

        this.single_choice = this.answer_idxes.length <= 1

        const shuffled = shuffle(this.options_prefix.length)
        this.to_shuffled = shuffled[0]
        this.from_shuffled = shuffled[1]

        if(typeof(notes) === 'string' && notes.length > 0){
            for(let i =0;i<this.options_prefix.length;++i){ // 映射notes中的选项
                const pattern = '[[' + orignal_options_prefix[i] + ']]'
                const replacement = this.options_prefix[this.to_shuffled[i]]
                notes = notes.replaceAll(pattern, replacement)
            }
            this.notes = notes
        }else
            this.notes = ''

        this.reset_selected()
    }

    // 返回文本数组
    this.shuffled_options = function(){
        return this.from_shuffled.map(i => this.options_text[i])
    }

    // 返回数组，每一项是'ok','ng','miss',undefined
    this.commit = function(){
        const ok = 'ok'
        const ng = 'ng'
        const miss = 'miss'
        let ret = this.options_text.map(() => undefined)

        for(let i =0;i<ret.length;++i){
            let expect = this.answer_idxes.includes(this.from_shuffled[i])
            let actual = this.selected[i]

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
        if(this.answer_idxes.length > 0) { // 有正确答案
            if(!this.indeterminate && this.single_choice) // 单选模式，非不定项
                this.reset_selected() // 清除所有已经选中的
        }

        this.selected[idx] = selected
    }

    // 重置选中
    this.reset_selected = function(){
        this.selected = this.options_text.map(() => false)
    }

    // 返回['A','C']，为乱序之后的值
    this.selected_answers = function(){
        let ret = []
        for(let i =0;i<this.selected.length;++i){
            if(this.selected[i]){
                ret.push(this.options_prefix[i])
            }
        }
        return ret.sort()
    }

    // 返回['A','C']，为乱序之后的值
    this.correct_answers = function(){
        let ret = []
        for(let i =0;i<this.answer_idxes.length;++i){
            const shuffled_index = this.to_shuffled[this.answer_idxes[i]]
            ret.push(this.options_prefix[shuffled_index])
        }
        return ret.sort()
    }
}

var C = Object.freeze({ // Constant
    ClassOption: 'option',
    ClassSelected: 'selected',
    ClassCorrect:'correct',
    ClassWrong: 'wrong',
    ClassMissing: 'should-select',
    IdQuestionType: 'questionType',
    IdOptions: 'options',
    IdCorrectAnswer: 'correct-answer',
    IdYourAnswer: 'your-answer'
})

function init_options(bindClick) {
    const divQT = document.getElementById(C.IdQuestionType)
    if(cs.indeterminate)
        divQT.innerText = '【不定项】'
    else if(!cs.single_choice)
        divQT.innerText = '【多选】'

    const divOpt = document.getElementById(C.IdOptions)

    cs.shuffled_options().forEach((option, idx) => {
        const li = document.createElement('li')
        li.className = C.ClassOption
        li.innerHTML = option
        li.id = index_to_id(idx)
        divOpt.appendChild(li)
    })

    if(bindClick){
        document.querySelectorAll('.' + C.ClassOption).forEach(e => {
            e.onclick = () => {toggle(id_to_index(e.id))}
        })
    }
}

function toggle(option_idx) {
    const li = document.getElementById(index_to_id(option_idx))
    const oldState = li.classList.contains(C.ClassSelected)

    // set to model
    cs.toggle(option_idx, !oldState)

    // redraw
    for(let idx =0;idx<cs.selected.length;++idx){
        let newClass = C.ClassOption
        if (cs.selected[idx])
            newClass += ' ' + C.ClassSelected
        document.getElementById(index_to_id(idx)).className = newClass
    }
}

function show_results() {
    const results = cs.commit()
    for(let idx =0;idx<results.length;++idx){
        const r = results[idx]
        if(r){
            let newClass
            if('ok' == r)
                newClass = C.ClassCorrect
            else if('ng' == r)
                newClass = C.ClassWrong
            else if('miss' == r)
                newClass = C.ClassMissing

            if(newClass)
                document.getElementById(index_to_id(idx)).className = C.ClassOption + ' ' + newClass
        }
    }

    const answersToText = (arr) => arr.length ? arr.join('') : '无'

    const ca = answersToText(cs.correct_answers())
    const ya = answersToText(cs.selected_answers())

    setInnerHtml(C.IdCorrectAnswer, ca)
    setInnerHtml(C.IdYourAnswer, (ya == ca) ? '，太棒了！' : '，你选了' + ya)
}

function shuffle(count){
    const a2b = Array.from(Array(count).keys())
    const b2a = Array.from(Array(count).keys())
    let i = count

    while (i > 0) {
        // random index
        const r = Math.floor(Math.random() * i)
        --i

        if(r != i){
            // swap
            const x = a2b[i]
            a2b[i] = a2b[r]
            a2b[r] = x
        }

        // reverse table
        b2a[a2b[i]] = i
    }

    return [a2b, b2a]
}

// for debug only
module.exports ={CardStorageColorfulChoice, shuffle}