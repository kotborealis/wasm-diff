const Controls = require("./Controls");
const StatusInfo = {};

StatusInfo.el = document.getElementById("info-status");

StatusInfo.set = (i)=>{
    switch(i){
        case -2:
            StatusInfo.el.textContent = Strings.badType;
            StatusInfo.show();
            Controls.enable();
            break;
        case -1:
            StatusInfo.el.textContent = Strings.error;
            StatusInfo.show();
            Controls.enable();
            break;
        case 0:
            StatusInfo.el.textContent = Strings.loading;
            StatusInfo.show();
            Controls.disable();
            break;
        case 2:
            StatusInfo.el.textContent = Strings.done;
            StatusInfo.show();
            Controls.enable();
            setTimeout(StatusInfo.hide,1000);
            break;
    }
};

StatusInfo.show = ()=>
    StatusInfo.el.classList.remove('tooltip__hide');
StatusInfo.hide = ()=>
    StatusInfo.el.classList.add('tooltip__hide');

const Strings = {
    "badType":"Неверный формат файла",
    "error":"Ошибка",
    "loading":"Загрузка...",
    "done":"Выполнено"
}

module.exports = StatusInfo;