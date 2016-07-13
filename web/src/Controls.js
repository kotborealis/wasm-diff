/**
 * Бинды и функции для формы выбора файлов и запуска сравнения
 */
const Controls = {};
Controls.file1 = null;
Controls.file2 = null;
/**
 * Функция, вызываемая в submit_form
 * Должна быть задана из вне
 * И принимать FileData как аргумент
 */
Controls.diff = ()=>{};

Controls.handleFile1 = (event)=>
    Controls.file1 = event.target.files[0];

Controls.handleFile2 = (event)=>
    Controls.file2 = event.target.files[0];

Controls.submit_form = ()=>{
    if(Controls.file1===null || Controls.file2===null)
        return;
    const diffFiles = new FormData();
    diffFiles.append('diff_files[]',Controls.file1);
    diffFiles.append('diff_files[]',Controls.file2);
    Controls.diff(diffFiles);
};

Controls.file_input1 = document.getElementsByClassName("js-file-input")[0];
Controls.file_input2 = document.getElementsByClassName("js-file-input")[1];
Controls.file_submit = document.getElementsByClassName("js-file-submit")[0];

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