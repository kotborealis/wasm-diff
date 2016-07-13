const highlight = {};
highlight.hover_el;

highlight.hover = (event)=>{
    if(highlight.hover_el)
        highlight.hover_el.classList.remove('diff__hover');

    event.target.classList.add('diff__hover');
    highlight.hover_el = event.target;
};

module.exports = highlight;