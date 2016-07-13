const DebugInfo = require("./DebugInfo");
const StatusInfo = require("./StatusInfo");
const Controls = require("./Controls");
const DiffComponents = require("./DiffComponents");

const Diff = {};
Diff.diffFiles = (files,callback)=>{
    StatusInfo.set(0);
    DebugInfo.set("startTime",(new Date).getTime());
    fetch("http://"+location.host+"/diff_0/",{
        method: 'post',
        body: files
    })
    .catch(e=>StatusInfo.set(-1))
    .then(e=>e.json())
    .then(callback);
};

Diff.diffString = (str1,str2,callback)=>{
    fetch("http://"+location.host+"/diff_1/"+encodeURIComponent(str1)+"/"+encodeURIComponent(str2))
    .catch(e=>StatusInfo.set(-1))
    .then(e=>e.json())
    .then(callback);
};

Diff.splitDiff = (data,callback)=>{
    const _data = [];
    let buff=[];
    data.forEach(e=>{
        buff.push(e);
        const last = _data.length-1;
        const replaced =    _data[last] !== undefined &&
                            _data[last].length === 1 &&
                            buff.length === 1 &&
                            buff[0].type !== 0 &&
                            _data[last][0].type === -buff[0].type;

        if(replaced)
            _data[last].push(buff[0]);
        else
            _data.push(buff);
        buff=[];
    });
    Diff.detail1(_data,callback);
};

Diff.detail1 = (diff,callback)=>{
    let counter = 0;
    for(let i=0;i<diff.length;i++){
        if(diff[i].length>=2)
            Diff.diffString(diff[i][0].text,diff[i][1].text,(e)=>{
                diff[i] = e;
                if(++counter===diff.length)
                    detal1_done_helper(diff,callback);
            });
        else if(++counter===diff.length)
            detal1_done_helper(diff,callback);
    }
};

const detal1_done_helper = (diff,callback)=>{
    StatusInfo.set(2);
    DebugInfo.set("endTime",(new Date).getTime());
    DebugInfo.set("total_duration",(DebugInfo.data.endTime-DebugInfo.data.startTime)/1000);
    delete DebugInfo.data.startTime;
    delete DebugInfo.data.endTime;
    DebugInfo.update();
    callback(diff);
};

Diff.render = (diff)=>{
    diff = diff.filter(e=>e.text.length>0);
    const buff = [];
    const diff_container = document.getElementsByClassName("diff")[0];
    diff_container.innerHTML='';

    Diff.splitDiff(diff,(diff_lines)=>{
        diff_lines.forEach(line=>{
            let changed = false;
            const line_left = [];
            const line_right = [];
            line.forEach(d=>{
                const type = d.type;
                const text = d.text;

                switch(type){
                    case 0:
                        line_left.push(DiffComponents.info(text,''));
                        line_right.push(DiffComponents.info(text,''));
                        break;
                    case 1:
                        changed=true;
                        line_right.push(DiffComponents.info(text,'diff__insert'));
                        break;
                    case -1:
                        changed=true;
                        line_left.push(DiffComponents.info(text,'diff__remove'));
                        break;
                }
            });

            const type_left = changed?'diff__old':'';
            const type_right = changed?'diff__new':'';
            const _ = DiffComponents.line(line_left,line_right,type_left,type_right);

            diff_container.appendChild(_);
        });
    });
};

Controls.diff = (files)=>Diff.diffFiles(files,Diff.render);