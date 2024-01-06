// 注：anki正反面传值：移动版需要使用缓存传值，桌面版不需要，直接按cs全局变量传递
var platform_string = (window.ankiPlatform && ankiPlatform) || "mobile";
var is_mobile = "mobile" == platform_string;

if (is_mobile){
// v1.1.8 - https://github.com/SimonLammer/anki-persistence/blob/584396fea9dea0921011671a47a0fdda19265e62/script.js
if(void 0===window.Persistence){var e="github.com/SimonLammer/anki-persistence/",t="_default";if(window.Persistence_sessionStorage=function(){var i=!1;try{"object"==typeof window.sessionStorage&&(i=!0,this.clear=function(){for(var t=0;t<sessionStorage.length;t++){var i=sessionStorage.key(t);0==i.indexOf(e)&&(sessionStorage.removeItem(i),t--)}},this.setItem=function(i,n){void 0==n&&(n=i,i=t),sessionStorage.setItem(e+i,JSON.stringify(n))},this.getItem=function(i){return void 0==i&&(i=t),JSON.parse(sessionStorage.getItem(e+i))},this.removeItem=function(i){void 0==i&&(i=t),sessionStorage.removeItem(e+i)},this.getAllKeys=function(){for(var t=[],i=Object.keys(sessionStorage),n=0;n<i.length;n++){var s=i[n];0==s.indexOf(e)&&t.push(s.substring(e.length,s.length))}return t.sort()})}catch(n){}this.isAvailable=function(){return i}},window.Persistence_windowKey=function(i){var n=window[i],s=!1;"object"==typeof n&&(s=!0,this.clear=function(){n[e]={}},this.setItem=function(i,s){void 0==s&&(s=i,i=t),n[e][i]=s},this.getItem=function(i){return void 0==i&&(i=t),void 0==n[e][i]?null:n[e][i]},this.removeItem=function(i){void 0==i&&(i=t),delete n[e][i]},this.getAllKeys=function(){return Object.keys(n[e])},void 0==n[e]&&this.clear()),this.isAvailable=function(){return s}},window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey("py")),!Persistence.isAvailable()){var i=window.location.toString().indexOf("title"),n=window.location.toString().indexOf("main",i);i>0&&n>0&&n-i<10&&(window.Persistence=new Persistence_windowKey("qt"))}}
}

function CardStorage() {
    this.options = []; // ['A. SelA','B. SelB','C. SelC']
    this.options_no_prefix = []; // ['SelA','SelB','SelC']
    this.options_prefix = [];; // ['A','B','C']

    this.shuffled_indexes = []; // [1,0,2]
    this.answers = []; // ["A","B"]
    this.selected = []; // ["answer_A","answer_B"]
}

function options_to_array(options) {
    return options.split(/<br>/g).map(function (str) {
        return str.trim();
    }).filter(function (str) {
        return str != "";
    });
}

function option_array_remove_prefix(option_array) {
    return option_array.map(function (str) {
        return str.replace(/^[A-Za-z0-9][\.\|、\s]{1,}/i, "");
    });
}

function option_array_get_prefix(option_array) {
    return option_array.map(function (str) {
        return str[0];
    }); // TODO: 过滤A-Z等基本字母
}

function answer_to_array(answer) {
    var arr = [];
    for (var i = 0; i < answer.length; ++i) arr.push(answer[i]);
    return arr;
}

function shuffle(arr) {
    var currentIndex = arr.length,
        randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        var _ref = [arr[randomIndex], arr[currentIndex]];
        arr[currentIndex] = _ref[0];
        arr[randomIndex] = _ref[1];
    }
    return arr;
}

function init_options() {
    var single_choice = cs.answers.length <= 1;
    document.getElementById("question_type").innerText = single_choice ? "(单选)" : "(多选)";
    var option_div = document.getElementById("options_div");
    cs.shuffled_indexes.forEach(function (idx) {
        var option = cs.options_no_prefix[idx];

        option_div.innerHTML += "<div onclick='toggle(this)'><input type='$t' name='options' id='$id' onclick='toggle(this.parentNode)' /><label>$label</label></div>"
        .replace("$id", answer_to_id(cs.options_prefix[idx]))
        .replace("$label", option)
        .replace("$t", single_choice ? "radio" : "checkbox");

    });
}

function toggle(item) {
    var input = item.getElementsByTagName("input")[0];

    var single_choice = cs.answers.length <= 1;
    if(single_choice){
        input.checked = true;
        cs.selected = [input.id];
    }else{
        input.checked = !input.checked;

        cs.selected = [];
        cs.options_prefix.forEach(p => {
            var id = answer_to_id(p);
            if(document.getElementById(id).checked)
                cs.selected.push(id);
        });
    }
}

function answer_to_id(a){
    return "answer_id_" + a;
}