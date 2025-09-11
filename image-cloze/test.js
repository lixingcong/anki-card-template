const API = require('./script.js')
const cs = new API.CardStorageImageCloze()

if(1){
    const text = `[{"x":0.06328670795147236,"y":0.43916082493353004,"w":0.256993006993007,"h":0.29836829836829837},{"x":0.5667832114479758,"y":0.2643356501083552,"w":0.256993006993007,"h":0.29603729603729606},{"x":0.3814685261332905,"y":0.17808856386126895,"w":0.20104895104895104,"h":0.2703962703962704}]`
    cs.build(text)
    console.log(JSON.stringify(cs))
    console.log('------------------------')
}

if(1){
    const text = `[{"x":0.5,"y":0.55,"w":0.1,"h":0.1}, {"x":0.9,"y":0.95,"w":0.1,"h":0.1}]`
    const ImageWidth = 100
    const ImageHeight = 100

    cs.build(text);
    [cs.imageWidth, cs.imageHeight] = [ImageWidth, ImageHeight]

    console.log(JSON.stringify(cs))

    console.log('mapFromImage(10,10)=', cs.mapFromImage(10,10))
    console.log('mapFromImage(90,90)=', cs.mapFromImage(90,90))

    console.log('mapToImage(0)=', cs.mapToImage(0))
    console.log('mapToImage(1)=', cs.mapToImage(1))

    const hitCase = [[10,10],[50,50],[50,55],[60,55],[60,60],[60,65],[65,65], [90,90],[100,100]]

    for(const h of hitCase)
        console.log('hit', h, '=',cs.hit(h[0],h[1]))

    console.log('------------------------')
}