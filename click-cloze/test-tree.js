const util = require('util')
const utilsParam = { showHidden: false, depth: null, colors: true }

const parse = (text, leftBracket, rightBracket) => {
    // Step1 分词
    const tokens = [] // 元素:字符,true(左括号),false(右括号)

    const BracketLength = leftBracket.length
    if (BracketLength != rightBracket.length) // 为提高搜索效率，暂定窗口长度固定
        return null

    let tokenLength = 0
    let tokenStart = 0

    const appendBracket = (index, leftBracket) => {
        if (tokenLength) {
            tokens.push(text.slice(tokenStart, tokenStart + tokenLength))
            tokenLength = 0
        }
        tokens.push(leftBracket)
        tokenStart = index
    }

    for (let i = 0; i < text.length;) {
        const window = text.slice(i, i + BracketLength)

        if (window === leftBracket) {
            i += BracketLength
            appendBracket(i, true)
        }
        else if (window == rightBracket) {
            i += BracketLength
            appendBracket(i, false)
        } else {
            ++i
            ++tokenLength
        }

        // last token
        if (i >= text.length && tokenLength > 0) {
            tokens.push(text.slice(tokenStart, text.length))
        }
    }

    // Step2 符号与操作数
    const newNode = (t, question) => {
        if (typeof (t) === 'object')
            return t

        const child = {
            text: t,
            question: question,
            children: []
        }

        return child
    }

    const mergeNodes = (nodes, isRootQuesetion) => {
        const p = newNode('', isRootQuesetion)
        for (const n of nodes) {
            const c = newNode(n, false)
            p.children.push(c)
        }
        return p
    }

    let node = null

    while (tokens.length > 0) {
        // 找到右括号
        const leftBracketIndex = tokens.lastIndexOf(true)
        const rightBrackIndex = tokens.indexOf(false, leftBracketIndex)

        if (-1 == leftBracketIndex && -1 == rightBrackIndex) {
            // 找不到括号
            if (tokens.length === 1) {
                if (!node)
                    node = newNode(tokens[0], false)
            } else {
                node = mergeNodes(tokens, false)
                tokens.length = 0
            }
            break
        } else if (-1 != leftBracketIndex && -1 != rightBrackIndex && leftBracketIndex + 2 <= rightBrackIndex) {
            // 找到匹配括号
            const rangeCount = rightBrackIndex - leftBracketIndex + 1;
            if (rangeCount > 3) {
                const validNodes = tokens.slice(leftBracketIndex + 1, leftBracketIndex + rangeCount - 1)
                node = mergeNodes(validNodes, true)
            } else {
                // 最深层的答案（直接被一对【】括住）
                node = newNode(tokens[leftBracketIndex + 1], true)
            }
            tokens.splice(leftBracketIndex, rangeCount) // 移除括号和nodes
            tokens.splice(leftBracketIndex, 0, node) // 插入已合并的node
        } else {
            return null // 分词不合理
        }
    }

    return node
}

if (0) {
    const cases = [
        'A0',
        '(A0)',
        'A0(X1)',
        'A0(A1(X2)B1)',
        'A0(A1(A2(X3)B2)B1)B0(Y1(Y2))',
        'A0(A1)A2(A3)A4',
        '(Y1(Y2))',
    ]

    for (const text of cases) {
        const tree = parse(text, '(', ')')
        console.log('Parse', text, util.inspect(tree, utilsParam))
        console.log('------------------------------------------')
    }

    const errCases = [
        // error examples
        '(',
        ')',
        '()',
        ')(',
        '(()',
        '))('
    ]

    for (const text of errCases) {
        if (null !== parse(text, '(', ')')) {
            console.error('Failed to parse test case =', text)
            process.exit(1)
        }

    }
}

if (1) {
    const text = 'A0(A1(A2(X3)B2)B1)B0(Y1(Y2))'

    const tree = parse(text, '(', ')')
    console.log('Parse', text, util.inspect(tree, utilsParam))

    // merge: function(tree, parentResult:any, childrenResult:any[]) : any
    // hook: function(tree): any

    const dfs = (t, hook, merge) => {
        const parentResult = hook(t)
        const childrenResult = []
        t.children.forEach(c => childrenResult.push(dfs(c, hook, merge)))
        return merge(t, parentResult, childrenResult)
    }

    const hook = (t) => {
        return t.text
    }

    const merge = (tree, parentResult, childrenResult) => {
        let s = ''
        if(tree.question)
            s+='<span>'

        s+=parentResult
        s+=childrenResult.join('')

        if(tree.question)
        s+='</span>'

        // console.log(s)
        return s
    }

    const Final = dfs(tree, hook, merge)
    console.log(Final)

    /*
    // 这是经过实测，在HTML网页中能展示的效果，但是点击效果不好，会重叠，不再浪费时间研究了。
    const hook = t => {
        const span = document.createElement('span')
        span.innerHTML = t.text
        return span
    }

    const merge =  (tree, parentResult, childrenResult) => {
        const span = document.createElement('span')
        const arr = [parentResult].concat(childrenResult)

        if(tree.question){
            span.id = index_to_id(clickClozeCount)
            span.innerHTML = C.Spaces
            span.className = C.ClassHidden
            const s = arr.map(c => c.innerHTML)
            span.setAttribute(C.Answer, s)

            clickClozeCount+=tree.children.filter(c => c.question).length
        }else{
            arr.forEach(e => span.appendChild(e))
        }

        return span
    }

    const finalSpan = dfs(tree, hook, merge)
    console.log(finalSpan.innerHTML)
    */
}