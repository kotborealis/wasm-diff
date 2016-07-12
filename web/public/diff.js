const diff = {};

/*main*/
diff.diffFiles = (files)=>{
	info_status.set(0);
	info.set("startTime",(new Date).getTime());
	fetch("http://"+location.host+"/diff_0/",{
		method: 'post',
    	body: files
	})
	.catch(e=>info_status.set(-1))
	.then(e=>e.json())
	.then(e=>{
		diff.show_sideBySide(e);
	});
};
diff.diffString = (str1,str2,cb)=>{
	fetch("http://"+location.host+"/diff_1/"+encodeURIComponent(str1)+"/"+encodeURIComponent(str2))
	.then(e=>e.json())
	.then(e=>cb(e))
	.catch(e=>info_status.set(-1));
};

diff.splitDiff = (diffs,cb)=>{
	const n_diff = [];
	let buff=[];
	diffs.forEach(diff=>{
		buff.push(diff);
		const prev_el = n_diff.length-1;
		const strReplaced = n_diff[prev_el] !== undefined &&
							n_diff[prev_el].length === 1 &&
							buff.length === 1 &&
							buff[0].type !== 0 &&
							n_diff[prev_el][0].type === -buff[0].type;

		if(strReplaced)
			n_diff[prev_el].push(buff[0]);
		else
			n_diff.push(buff);
		buff=[];
	});
	diff.detail1(n_diff,cb);
};

diff.detail1 = (__diff,__cb)=>{
	let counter = 0;
	for(let i=0;i<__diff.length;i++){
		if(__diff[i].length>=2)
			diff.diffString(__diff[i][0].text,__diff[i][1].text,(e)=>{
				__diff[i] = e;
				if(++counter===__diff.length)
					__done_helper(__diff,__cb);
			});
		else if(++counter===__diff.length)
			__done_helper(__diff,__cb);
	}
}

const __done_helper = (__diff,__cb)=>{
	info_status.set(2);
	info.set("endTime",(new Date).getTime());
	info.set("total_duration",(info.data.endTime-info.data.startTime)/1000);
	delete info.data.startTime;
	delete info.data.endTime;
	info.update();
	__cb(__diff);
}

diff.show_sideBySide = (_diff)=>{
	_diff = _diff.filter(e=>e.text.length>0);
	const buff = [];
	const diff_cnt = document.getElementsByClassName("diff")[0];
	diff_cnt.innerHTML='';

	diff.splitDiff(_diff,(n_diff)=>{
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
	if(el.textContent==='')
		el.innerHTML = "<span class='shadow__symbol'>...</span>\n";

	const er = document.createElement('span');
	er.className = class_b+" diff__line-right";
	elements_b.forEach(e=>er.appendChild(e));
	if(er.textContent==='')
		er.innerHTML = "<span class='shadow__symbol'>...</span>\n";

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

/* controls */
let diffFile1 = null;
let diffFile2 = null;
function handleFile1(event){
	const file = event.target.files[0];
	if(file.type.indexOf('text/')<0 && file.type.length!==0){
		info_status.set(-2);
		file_input1.value = '';
		return;
	}
	else
		diffFile1 = file;
}
function handleFile2(event){
	const file = event.target.files[0];
	if(file.type.indexOf('text/')<0 && file.type.length!==0){
		info_status.set(-2);
		file_input2.value = '';
		return;
	}
	else
		diffFile2 = file;
}
const submit_form = ()=>{
	if(diffFile1===null || diffFile2===null){
		info_status.set(-3);
		return;
	}
	const diffFiles = new FormData();
	diffFiles.append('diff_files[]',diffFile1);
	diffFiles.append('diff_files[]',diffFile2);
	diff.diffFiles(diffFiles);
}
const file_input1 = document.getElementById("file1");
const file_input2 = document.getElementById("file2");
const file_submit_button = document.getElementById("file_submit_button");

const disable_file_inputs = ()=>{
	file_input1.disabled = true;
	file_input2.disabled = true;
}
const enable_file_inputs = ()=>{
	file_input1.disabled = false;
	file_input2.disabled = false;
}

file_input1.addEventListener("change",handleFile1);
file_input2.addEventListener("change",handleFile2);
file_submit_button.onclick = submit_form;

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
			info_status.el.textContent = "Ошибка";
			info_status.show();
			enable_file_inputs();
			break;
		case 0:
			info_status.el.textContent = "Загрузка...";
			info_status.show();
			disable_file_inputs();
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
