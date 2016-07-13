const Controls = {};
Controls.file1 = null;
Controls.file2 = null;
Controls.diff = ()=>{};

Controls.invalidFileType = (file)=>
    file.type.indexOf('text/')<0 && file.type.length!==0;

Controls.handleFile1 = (event)=>{
    const file = event.target.files[0];
    if(Controls.invalidFileType(file)){
        info_status.set(-2);
        file_input1.value = '';
        return;
    }
    else
        Controls.file1 = file;
};

Controls.handleFile2 = (event)=>{
    const file = event.target.files[0];
    if(Controls.invalidFileType(file)){
        info_status.set(-2);
        file_input2.value = '';
        return;
    }
    else
        Controls.file2 = file;
};

Controls.submit_form = ()=>{
    if(Controls.file1===null || Controls.file2===null){
        info_status.set(-3);
        return;
    }
    const diffFiles = new FormData();
    diffFiles.append('diff_files[]',Controls.file1);
    diffFiles.append('diff_files[]',Controls.file2);
    Controls.diff(diffFiles);
};

Controls.file_input1 = document.getElementsByClassName("file-input")[0];
Controls.file_input2 = document.getElementsByClassName("file-input")[1];
Controls.file_submit = document.getElementsByClassName("file-submit")[0];

Controls.disable = ()=>{
    Controls.file_input1.disabled = true;
    Controls.file_input2.disabled = true;
    Controls.file_submit.disabled = true;
};

Controls.enable = ()=>{
    Controls.file_input1.disabled = false;
    Controls.file_input2.disabled = false;
    Controls.file_submit.disabled = false;
};

Controls.file_input1.addEventListener("change",Controls.handleFile1);
Controls.file_input2.addEventListener("change",Controls.handleFile2);
Controls.file_submit.onclick = Controls.submit_form;

module.exports = Controls;