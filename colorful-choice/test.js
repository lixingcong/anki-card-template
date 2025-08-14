const API = require('./script.js')

const cs = new API.CardStorage()

const options = 'A.第1项<br>B.第2项<br>C.第3项<br>D.第4项<br>E.第5项'

if(1){
    cs.build(options, 'DC')

    console.log('多选，正确答案是第3,4项，构造函数', JSON.stringify(cs), '\n')
    console.log('随机后', JSON.stringify(cs.shuffled_options()), '\n')
    console.log('没有选中，交卷', JSON.stringify(cs.commit()))

    cs.toggle(0, true)
    console.log('选中第一项，交卷', JSON.stringify(cs.commit()))

    cs.toggle(1, true)
    console.log('选中第二项，交卷', JSON.stringify(cs.commit()))
    console.log('答案：', cs.correct_answers(), '你的选择：', cs.selected_answers())
    console.log('-------------------------')

    cs.build(options, 'AE')
    
    console.log('多选，正确答案是第1,5项，构造函数', JSON.stringify(cs), '\n')
    console.log('随机后', JSON.stringify(cs.shuffled_options()), '\n')
    console.log('没有选中，交卷', JSON.stringify(cs.commit()))

    cs.toggle(2, true)
    console.log('选中第三项，交卷', JSON.stringify(cs.commit()))

    cs.toggle(3, true)
    console.log('选中第四项，交卷', JSON.stringify(cs.commit()))
    
    console.log('答案：', cs.correct_answers(), '你的选择：', cs.selected_answers())
    console.log('-------------------------')
}

if(1){
    cs.build(options, 'D')

    console.log('单选，正确答案是第4项，构造函数', JSON.stringify(cs), '\n')
    console.log('随机后', JSON.stringify(cs.shuffled_options()), '\n')
    console.log('没有选中，交卷', JSON.stringify(cs.commit()))

    cs.toggle(0, true)
    console.log('选中第一项，交卷', JSON.stringify(cs.commit()))
    
    cs.toggle(1, true)
    console.log('选中第二项，交卷', JSON.stringify(cs.commit()))
    
    console.log('答案：', cs.correct_answers(), '你的选择：', cs.selected_answers())
    console.log('-------------------------');

    cs.build(options, 'A')

    console.log('单选，正确答案是第1项，构造函数', JSON.stringify(cs), '\n')
    console.log('随机后', JSON.stringify(cs.shuffled_options()), '\n')
    console.log('没有选中，交卷', JSON.stringify(cs.commit()))

    cs.toggle(2, true)
    console.log('选中第三项，交卷', JSON.stringify(cs.commit()))

    cs.toggle(3, true)
    console.log('选中第四项，交卷', JSON.stringify(cs.commit()))
    
    console.log('答案：', cs.correct_answers(), '你的选择：', cs.selected_answers())
    console.log('-------------------------');
}