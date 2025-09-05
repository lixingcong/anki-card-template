const API = require('./script.js')
const cs = new API.CardStorageClickCloze()

if(1){
    const text = `<table>
<thead>
<tr>
<th>[[Header1]]</th>
<th>Header2</th>
</tr>
</thead>
<tbody><tr>
<td>Item1</td>
<td>Item2</td>
</tr>
<tr>
<td>Item3</td>
<td>Item4</td>
</tr>
</tbody></table>`

    cs.build(text)
    console.log(JSON.stringify(cs))
    console.log('---------------------------')
}

if(1){
    const text = `支持[[『PDF、Word、Xmind、幕布、Markdown、Excel、微信读书、欧陆词典』]]等众多类型材料快速制作Anki
    卡片，支持[[挖空题、问答题、选择题]]等常见题型批量制卡，有效解决Anki卡片制作过程繁杂、效率低下等问题，可以为用户节省大量时间来专注于学习本身。
    `
    cs.build(text)
    console.log(JSON.stringify(cs))
    console.log('---------------------------')
}