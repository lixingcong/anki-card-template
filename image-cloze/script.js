function CardStorageImageCloze() {
    this.rects = []
    this.imageWidth = 0
    this.imageHeight = 0
    this.allowHit = true

    this.build = function (str) {
        this.rects = []
        this.imageWidth = 0
        this.imageHeight = 0
        this.allowHit

        try {
            const J = JSON.parse(str)
            for(const r of J){
                if('x' in r && 'y' in r && 'w' in r && 'h' in r){
                    let rect = {show: true}
                    Object.assign(rect, r)
                    this.rects.push(rect)
                }
            }
        } catch (error) { }
    }

    this.mapToImage = function(idx){
        const r = this.rects[idx]
        return {
            x: r.x* this.imageWidth,
            y: r.y* this.imageHeight,
            w: r.w* this.imageWidth,
            h: r.h* this.imageHeight
        }
    }

    this.mapFromImage = function(x, y){
        if(this.imageWidth<=0 || this.imageHeight<=0)
            return undefined

        return {
            x: x / this.imageWidth,
            y: y / this.imageHeight
        }
    }

    this.hit = function(x,y){
        if(!this.allowHit)
            return -1

        const p = this.mapFromImage(x,y,this.imageWidth, this.imageHeight)

        let minimalAreaIndex = -1
        let minimalArea = Number.MAX_VALUE

        this.rects.map(r => {
            return {
                hit: (p.x >= r.x && p.y >= r.y && p.x <= r.x+r.w && p.y <= r.y+r.h),
                area: r.w * r.w
            }
        }).forEach((a, idx) => {
            if(a.hit && a.area < minimalArea){
                minimalAreaIndex = idx
                minimalArea = a.area
            }
        })

        return minimalAreaIndex
    }

    this.setAllowHit = function(b){
        this.allowHit = b
    }

    this.setAnswerVisible = function(idx, b){ // 是否显示答案（即去除遮罩）
        this.rects[idx].show = !b
    }
}

var ClickedClozeIndex = 0 // 揭开过cloze答案的序号
var StoreKeyDivHeight = 'lxc-mask-div-height'

function show_masks() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if(0 >= cs.imageWidth || 0 >= cs.imageHeight){
        return
    }

    cs.rects.forEach((r, idx) => {
        if(r.show)
            paintRect(ctx, idx)
    })
}

function paintRect(ctx, rectIndex){
    const r = cs.mapToImage(rectIndex)

    ctx.beginPath();
    ctx.moveTo(r.x, r.y)
    ctx.lineTo(r.x+r.w, r.y)
    ctx.lineTo(r.x+r.w, r.y+r.h)
    ctx.lineTo(r.x, r.y+r.h)
    ctx.lineTo(r.x, r.y)

    // 填充颜色
    ctx.fillStyle = 'black'
    ctx.fill();
    ctx.strokeStyle = '#525252';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 写字
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    const center = {x: r.x+r.w/2, y:r.y+r.h/2}
    ctx.fillText(rectIndex+1+'', center.x, center.y);
}

function clozeAnswerHidden(idx){
    return cs.rects[idx].show // 这里有点绕，show=true表示遮罩生效，那就是看不到图片答案
}

// 参数show可能的值：undefined, true, false
function showClozeAnswer(idx, show){
    ClickedClozeIndex = idx

    if (undefined === show)
        show = clozeAnswerHidden(idx); // toggle

    cs.setAnswerVisible(idx, show)
}

// 用键盘控制的显示和隐藏cloze答案，参数show: true/false
function showClozeAnswerByStep(show){
    let idx = ClickedClozeIndex
    if(idx < 0 || idx >= cs.rects.length)
        return; // overflow

    const step = show ? 1 : -1;
    while(clozeAnswerHidden(idx) != show){
        idx += step // next or prev

        if (idx < 0) {
            ClickedClozeIndex = 0 // reset to first
            return;
        }

        if (idx >= cs.rects.length) {
            ClickedClozeIndex = cs.rects.length - 1 // reset to last
            return;
        }
    }

    showClozeAnswer(idx, show)
    show_masks()
}

function adjustDivHeight(add){
    var divResizable = document.getElementById('div-outside')
    var height = divResizable.style.height
    height= height.replace('px','')
    height = parseFloat(height)
    height+=(add ? 20 : -20)
    divResizable.style.height = height + 'px'

    if (Persistence.isAvailable())
        Persistence.setItem(StoreKeyDivHeight, divResizable.style.height)
}

// for debug only
module.exports = { CardStorage }