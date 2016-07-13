const DebugInfo = {};
DebugInfo.visible = false;
DebugInfo.data = {};
DebugInfo.el = document.getElementById("debug-info");
DebugInfo.el.style.left = 100+"px";
DebugInfo.el.style.top = 100+"px";
DebugInfo.set = (n,i)=>{
    DebugInfo.data[n] = i;
    DebugInfo.update();
};
DebugInfo.update = ()=>
    DebugInfo.el.textContent = JSON.stringify(DebugInfo.data,null,' ');

DebugInfo.show = ()=>{
    DebugInfo.el.classList.remove('c-tooltip--hide');
    DebugInfo.visible = true;
}

DebugInfo.hide = ()=>{
    DebugInfo.el.classList.add('c-tooltip--hide');
    DebugInfo.visible = false;
}

DebugInfo.toggle = ()=>
    DebugInfo.visible ? DebugInfo.hide() : DebugInfo.show();

window.document.body.addEventListener('keypress',(e)=>{
    if(e.code==="KeyI")
        DebugInfo.toggle();
});

module.exports = DebugInfo;
