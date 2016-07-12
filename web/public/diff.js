const diff = {};

/*main*/
diff.diffFiles = (files)=>{
	const t = {};
	t.startTime = (new Date).getTime();
	info_status.set(0);
	fetch("http://"+location.host+"/diff/",{
		method: 'post',
    	body: files
	})
	.catch(e=>info_status.set(-1))
	.then(e=>{
		t.serverTime = (new Date).getTime();
		return e.json();
	})
	.then(e=>{
		info_status.set(1);
		diff.show_sideBySide(e);
		info_status.set(2);
		t.renderTime = (new Date).getTime();

		info.data.time = {};
		info.data.time.server = (t.serverTime - t.startTime)/1000 + 's';
		info.data.time.render = (t.renderTime - t.serverTime)/1000 + 's';
		info.data.time.total = (t.renderTime - t.startTime)/1000 + 's';
		info.update();
	});
}

diff.splitDiff = (diffs)=>{
	const n_diff = [];
	let buff = [];
	diffs.forEach(diff=>{
		buff.push(diff);
		if(diff.text.indexOf('\n')>=0 && diff.type>=0){
			n_diff.push(buff);
			buff=[];
		}
	});
	return n_diff;
};

diff.show_sideBySide = (_diff)=>{
	_diff = _diff.filter(e=>e.text.length>0);
	const buff = [];
	n_diff = diff.splitDiff(_diff);
	const diff_cnt = document.getElementsByClassName("diff")[0];
	diff_cnt.innerHTML='';

	n_diff.forEach(line=>{
		let changed = false;
		const buff_line_left = [];
		const buff_line_right = [];
		line.forEach(d=>{
			const type = d.type;
			const text = d.text;

			if(type!==0)
				changed=true;

			switch(type){
				case 0:
					buff_line_left.push(diff.el.info(text,''));
					buff_line_right.push(diff.el.info(text,''));
					break;
				case 1:
					buff_line_right.push(diff.el.info(text,'diff__insert'));
					break;
				case -1:
					buff_line_left.push(diff.el.info(text,'diff__remove'));
					break;
			}
		});

		let _;
		if(changed)
			_ = diff.el.highlight(buff_line_left,buff_line_right,'diff__old','diff__new');	
		else
			_ = diff.el.highlight(buff_line_left,buff_line_right,'diff__eql','diff__eql');
		diff_cnt.appendChild(_);
	});
};

/*elements*/
diff.el = {};

diff.el.info  = (text,class_) =>{
	const e = document.createElement('span');
	e.innerHTML = text.replace(/\r?\n/g,"<span class='shadow__symbol'>↵</span>\n");
	e.className = class_;
	return e;
};

diff.el.highlight = (elements_a,elements_b,class_a,class_b) =>{
	const el = document.createElement('span');
	el.className = class_a+" diff__line-left";
	elements_a.forEach(e=>el.appendChild(e));

	const er = document.createElement('span');
	er.className = class_b+" diff__line-right";
	elements_b.forEach(e=>er.appendChild(e));

	const cnt = document.createElement('span');
	cnt.className = "diff__line";
	cnt.onmouseenter = highlight.hover;
	cnt.appendChild(el);
	cnt.appendChild(er);
	return cnt;
}

/*highlight*/
const highlight = {};
highlight.hover_el;

highlight.hover = (event)=>{
	if(highlight.hover_el)
		highlight.hover_el.classList.remove('diff__hover');

	event.target.classList.add('diff__hover');
	highlight.hover_el = event.target;
};

/*file select*/
let diffFiles = null;
let diffFilesCount = 0;
function handleFile(event){
	const file = event.target.files[0];
	if(file.type.indexOf('text/')<0 && file.type.length!==0){
		info_status.set(-2);
		file_input1.value = '';
		file_input2.value = '';
		return;
	}
	else{
		if(diffFiles===null)
			diffFiles = new FormData();
		diffFiles.append('diff_files[]',file);

		diffFilesCount++;
		if(diffFilesCount>=2){
			diff.diffFiles(diffFiles);
			diffFiles = null;
			diffFilesCount=0;
			file_input1.value = '';
			file_input2.value = '';
		}
	}
}
const file_input1 = document.getElementById("file1");
const file_input2 = document.getElementById("file2");

const disable_file_inputs = ()=>{
	file_input1.disabled = true;
	file_input2.disabled = true;
}
const enable_file_inputs = ()=>{
	file_input1.disabled = false;
	file_input2.disabled = false;
}

file_input1.addEventListener("change",handleFile);
file_input2.addEventListener("change",handleFile);

/*tooltip*/
const tooltip = document.getElementById("tooltip");

tooltip.show = (x,y)=>{
	tooltip.style.left = x+"px";
	tooltip.style.top = y+"px";
	tooltip.classList.remove('tooltip__hide');
};

const getElementPos = (e)=>{
	const rect = e.getBoundingClientRect();
	const y = rect.bottom + window.pageYOffset - document.documentElement.clientTop;
	const x = rect.left + window.pageXOffset - document.documentElement.clientLeft;
	return {x,y};
}
tooltip.showAtElement = (e)=>{
	const pos = getElementPos(e);
	tooltip.show(pos.x,pos.y);
};

tooltip.hide = ()=>{
	tooltip.classList.add('tooltip__hide');	
}

/*info*/
const info = {};
info.visible = false;
info.data = {};
info.el = document.getElementById("info");
info.el.style.left = 100+"px";
info.el.style.top = 100+"px";
info.set = (n,i)=>{
	info.data[n] = i;
	info.update();
};
info.update = ()=>
	info.el.textContent = JSON.stringify(info.data,null,' ');

info.show = ()=>{
	info.el.classList.remove('tooltip__hide');
	info.visible = true;
}

info.hide = ()=>{
	info.el.classList.add('tooltip__hide');
	info.visible = false;
}

info.toggle = ()=>{
	info.visible ? info.hide() : info.show();
};

document.body.addEventListener('keypress',(e)=>{
	if(e.keyCode===105)
		info.toggle();
});

/*info status*/
const info_status = {};
info_status.el = document.getElementById("info_status");
info_status.set = (i)=>{
	switch(i){
		case -2:
			info_status.el.textContent = "Неверный формат файла";
			info_status.show();
			break;
		case -1:
			info_status.el.textContent = "Ошибка сервера";
			info_status.show();
			enable_file_inputs();
			break;
		case 0:
			info_status.el.textContent = "Загрузка...";
			info_status.show();
			disable_file_inputs();
			break;
		case 1:
			info_status.el.textContent = "Рендер...";
			info_status.show();
			break;
		case 2:
			info_status.el.textContent = "Выполнено";
			info_status.show();
			enable_file_inputs();
			setTimeout(info_status.hide,1000);
			break;
	}
};
info_status.show = ()=>
	info_status.el.classList.remove('tooltip__hide');
info_status.hide = ()=>
	info_status.el.classList.add('tooltip__hide');
