/**
 * Главная часть интерфейса
 */
const DebugInfo = require("./DebugInfo");
const StatusInfo = require("./StatusInfo");
const Controls = require("./Controls");
const DiffComponents = require("./DiffComponents");

const api_url = "/voiddiff/";

const Diff = {};
/**
 * Выполняет запрос к серверу и получает дифф двух текстовых файлов
 * @param files - FormData с файлами
 * @param type - Число, определяющее тип диффа (построчный/по словам)
 * @param callback
 */
Diff.diffFiles = (files,type,callback)=>{
    StatusInfo.set(0);
    DebugInfo.set("startTime",(new Date).getTime());
    fetch("http://"+location.host+api_url+type.toString()+"/",{
        method: 'post',
        body: files
    })
    .catch(e=>StatusInfo.set(-1))
    .then(e=>e.json())
    .then(callback);
};

/**
 * Выполняет запрос к серверу и получает дифф двух строк
 * @param str1
 * @param str2
 * @param type - Число, определяющее тип диффа (построчный/по словам)
 * @param callback
 */
Diff.diffString = (str1,str2,type,callback)=>{
    fetch("http://"+location.host+api_url+type.toString()+"/"+encodeURIComponent(str1)+"/"+encodeURIComponent(str2))
    .catch(e=>StatusInfo.set(-1))
    .then(e=>e.json())
    .then(callback);
};

/**
 * Разбивает дифф на строки
 * @param diff - Дифф в виде [{type,text}]
 * @param callback
 */
Diff.splitDiffByLines = (diff, callback)=>{
    DebugInfo.set('nodes_detail0',diff.length);
    const _data = [];
    let buff=[];
    diff.forEach(e=>{
        buff.push(e);
        const last = _data.length-1;
        //Проверка на то, что строка была заменена
        const replaced =    _data[last] !== undefined &&
                            _data[last].length === 1 &&
                            buff.length === 1 &&
                            buff[0].type !== 0 &&
                            _data[last][0].type === -buff[0].type;

        if(replaced)
            if(_data[last][0].type === -1)
                _data[last] = [_data[last][0],buff[0]];
            else
                _data[last] = [buff[0],_data[last][0]];
        else
            _data.push(buff);
        buff=[];
    });
    callback(_data);
};

/**
 * Получает дифф, разбитый на строки, и уточняет результат диффом по словам там, где это необходимо
 * @param diff_lines  - Дифф в виде [[{type,text}]] (Результат splitDiffByLines)
 * @param callback
 */
Diff.diffLinesPrecise = (diff_lines, callback)=>{
    let nodes_detail1 = 0;
    let counter = 0;
    for(let i=0;i<diff_lines.length;i++){
        //Для каждой изменённой строки диффа будет выполнен отдельный запрос к серверу с типом диффа 1 (по словам)
        if(diff_lines[i].length>=2)
            Diff.diffString(diff_lines[i][0].text,diff_lines[i][1].text,1,(e)=>{
                nodes_detail1 += e.length;
                diff_lines[i] = e;
                if(++counter===diff_lines.length){
                    DebugInfo.set('nodes_detail1',nodes_detail1);
                    callback(diff_lines);
                }
            });
        else {
            nodes_detail1++;
            if(++counter===diff_lines.length){
                DebugInfo.set('nodes_detail1',nodes_detail1);
                callback(diff_lines);
            }
        }
    }
};

/**
 * Принимает дифф, разбитый по строкам, и отображает его
 * @param diff_lines
 */
Diff.render = (diff_lines)=>{
    const stats = {};
    stats.nodes_equal = 0;
    stats.nodes_insert = 0;
    stats.nodes_remove = 0;

    const diff_container = document.getElementsByClassName("js-diff-container")[0];
    diff_container.innerHTML='';

    //Проход по строкам диффа и генерация элементов
    diff_lines.forEach(line=>{
        let changed = false;
        const line_left = [];
        const line_right = [];
        line.forEach(d=>{
            switch(d.type){
                case 0:
                    stats.nodes_equal++;
                    line_left.push(DiffComponents.info(d.text));
                    line_right.push(DiffComponents.info(d.text));
                    break;
                case 1:
                    changed=true;
                    stats.nodes_insert++;
                    line_right.push(DiffComponents.info(d.text,'c-diff__info--insert'));
                    break;
                case -1:
                    changed=true;
                    stats.nodes_remove++;
                    line_left.push(DiffComponents.info(d.text,'c-diff__info--remove'));
                    break;
            }
        });

        const type_left = changed?'c-diff__text-line--old':'';
        const type_right = changed?'c-diff__text-line--new':'';
        const _ = DiffComponents.line(line_left,line_right,type_left,type_right);

        diff_container.appendChild(_);
    });
    DebugInfo.set('nodes_equal',stats.nodes_equal);
    DebugInfo.set('nodes_insert',stats.nodes_insert);
    DebugInfo.set('nodes_remove',stats.nodes_remove);
};

/**
 * Функция, выполняемая при нажатии кнопки "Сравнить"
 * Делает дифф с типом 0 по файлам
 * Разбивает результат по строкам
 * Уточняет строки
 * Вызываер рендер
 * @param files
 */
Controls.diff = (files)=>{
    Diff.diffFiles(files,0,(diff)=>{
        Diff.splitDiffByLines(diff,(lines)=>{
            Diff.diffLinesPrecise(lines,(data)=>{
                StatusInfo.set(2);
                DebugInfo.set("total_duration",((new Date).getTime()-DebugInfo.data.startTime)/1000);
                delete DebugInfo.data.startTime;
                DebugInfo.update();
                Diff.render(data);
            });
        });
    });
};