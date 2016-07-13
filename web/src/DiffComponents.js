/**
 * Создание компонентов интерфейса
 */
const Components = {};

Components.info  = (text,class_) =>{
    if(class_===undefined)
        class_='';

    const e = document.createElement('span');
    e.innerHTML = text.replace(/\r?\n/g,"<span class='c-shadow-symbol'>↵</span>\n");//Подсветка лайн-брейков
    e.className = "c-diff__info "+class_;
    return e;
};

Components.line = (elements_a,elements_b,class_a,class_b) =>{
    //Левая часть строки диффа
    const el = document.createElement('span');
    elements_a.forEach(e=>el.appendChild(e));
    if(el.textContent==='')
        el.className = "c-diff__text-line c-diff__text-line--right c-diff__text-line--empty";
    else
        el.className = "c-diff__text-line c-diff__text-line--right "+class_a;

    //Правая часть
    const er = document.createElement('span');
    elements_b.forEach(e=>er.appendChild(e));
    if(er.textContent==='')
        er.className = "c-diff__text-line c-diff__text-line--right c-diff__text-line--empty";
    else
        er.className = "c-diff__text-line c-diff__text-line--right "+class_b;

    //Строка диффа
    const cnt = document.createElement('span');
    cnt.className = "c-diff__diff-line";
    cnt.onmouseenter = highlight.hover;
    cnt.appendChild(el);
    cnt.appendChild(er);
    return cnt;
};

/**
 * Подсветка строки
 */
const highlight = {};
highlight.hover_el = null;

highlight.hover = (event)=>{
    if(highlight.hover_el)
        highlight.hover_el.classList.remove('c-diff__text-line--hover');

    event.target.classList.add('c-diff__text-line--hover');
    highlight.hover_el = event.target;
};

module.exports = Components;