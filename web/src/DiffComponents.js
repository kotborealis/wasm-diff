const highlight = require("./LineHighlight");
const Components = {};

Components.info  = (text,class_) =>{
    const e = document.createElement('span');
    e.innerHTML = text.replace(/\r?\n/g,"<span class='shadow__symbol'>↵</span>\n");
    e.className = class_;
    return e;
};

Components.line = (elements_a,elements_b,class_a,class_b) =>{
    const el = document.createElement('span');
    el.className = class_a+" diff__line-left";
    elements_a.forEach(e=>el.appendChild(e));
    if(el.textContent==='')
        el.innerHTML = "<span class='shadow__symbol'>...</span>\n";

    const er = document.createElement('span');
    er.className = class_b+" diff__line-right";
    elements_b.forEach(e=>er.appendChild(e));
    if(er.textContent==='')
        er.innerHTML = "<span class='shadow__symbol'>...</span>\n";

    const cnt = document.createElement('span');
    cnt.className = "diff__line";
    cnt.onmouseenter = highlight.hover;
    cnt.appendChild(el);
    cnt.appendChild(er);
    return cnt;
};

module.exports = Components;