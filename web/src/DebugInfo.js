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
    DebugInfo.el.classList.remove('tooltip__hide');
    DebugInfo.visible = true;
}

DebugInfo.hide = ()=>{
    DebugInfo.el.classList.add('tooltip__hide');
    DebugInfo.visible = false;
}

DebugInfo.toggle = ()=>{
    DebugInfo.visible ? DebugInfo.hide() : DebugInfo.show();
};

document.body.addEventListener('keypress',(e)=>{
    if(e.keyCode===105)
        DebugInfo.toggle();
});

module.exports = DebugInfo;
