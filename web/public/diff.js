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
	const _ = /(?:\n)$/g;
	const n_diff = [];
	let i = 0;
	let eotl = {};
	
	diffs.forEach(diff=>{
		if(n_diff[i]===undefined)
			n_diff[i]=[];

		n_diff[i].push(diff);

		if(diff.text.match(_)!==null)
			switch(diff.type){
				case 0:
					eotl.equal = true;
					break;
				case 1:
					eotl.insert = true;
					break;
				case -1:
					eotl.remove = true;
					break;
			}

		if(eotl.equal===true || (eotl.insert === true && eotl.remove === true)){
			//Reached end of the line
			//BONUS DUCKS
			eotl = {};
			i++;
		}
	});
	return n_diff;
};

diff.show_sideBySide = (_diff)=>{
	let nodes_count = 0;

	_diff = _diff.filter(e=>e.text.length>0);

	const buff_left = [];
	const buff_right = [];

	n_diff = diff.splitDiff(_diff);

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
					nodes_count+=2;
					break;
				case 1:
					buff_line_right.push(diff.el.info(text,'diff__insert'));
					nodes_count++;
					break;
				case -1:
					buff_line_left.push(diff.el.info(text,'diff__remove'));
					nodes_count++;
					break;
			}
		});

		let _;
		if(changed){
			_ = diff.el.highlight(buff_line_left,buff_line_right,'diff__old','diff__new');	
			nodes_count++;
		}
		else{
			_ = diff.el.highlight(buff_line_left,buff_line_right,'diff__eql','diff__eql');
			nodes_count++;
		}
		buff_left.push(_[0]);
		buff_right.push(_[1]);
	});
	const diff_l = document.getElementsByClassName("diff")[0];
	const diff_r = document.getElementsByClassName("diff")[1];

	diff_l.innerHTML=diff_r.innerHTML='';
	
	buff_left.forEach(e=>diff_l.appendChild(e));
	buff_right.forEach(e=>diff_r.appendChild(e));

	info.set('nodes',nodes_count);
};

/*elements*/
diff.el = {};

diff.el.info  = (text,class_) =>{
	const e = document.createElement('span');
	e.textContent = text;
	e.className = class_;
	return e;
};

diff.el.highlight = (elements_a,elements_b,class_a,class_b) =>{
	const el = document.createElement('span');
	el.className = class_a;
	el.onmouseout = diff.highlight_hide;
	elements_a.forEach(e=>el.appendChild(e));

	const er = document.createElement('span');
	er.className = class_b;
	er.onmouseout = diff.highlight_hide;
	elements_b.forEach(e=>er.appendChild(e));
	
	el.onmouseover = diff.highlight.bind(null,el,er);
	er.onmouseover = diff.highlight.bind(null,er,el);

	el.onclick = diff.scrollTo.bind(null,er);
	er.onclick = diff.scrollTo.bind(null,el);

	return [el,er];
}

/*highlight*/
diff.cur_highlighted;
diff.cur_scrollhighlighted=null;
diff.cur_scrollhighlighted_timer=0;

diff.scrollTo = (e)=>{
	diff.hide_scrollhighlight();
	diff.cur_scrollhighlighted = e;
	e.classList.add('diff__scrollhighlight');
	e.scrollIntoViewIfNeeded();

	clearTimeout(diff.cur_scrollhighlighted_timer);
	diff.cur_scrollhighlighted_timer = setTimeout(diff.hide_scrollhighlight,1500);
};
diff.hide_scrollhighlight = ()=>{
	if(diff.cur_scrollhighlighted!==null)
		diff.cur_scrollhighlighted.classList.remove('diff__scrollhighlight');
	diff.cur_scrollhighlighted=null;
};

diff.highlight = (e1,e2)=>{
	diff.cur_highlighted = [e1,e2];

	diff.cur_highlighted[0].classList.add('diff__highlight');
	diff.cur_highlighted[1].classList.add('diff__highlight');

	if(diff.cur_highlighted[1].textContent!==" " && 
			diff.cur_highlighted[1].textContent!=="\n" && 
			diff.cur_highlighted[1].textContent.length>0){
		tooltip.innerHTML = diff.cur_highlighted[1].innerHTML;
		tooltip.showAtElement(diff.cur_highlighted[0]);
	}
};

diff.highlight_hide = ()=>{
	tooltip.hide();
	diff.cur_highlighted[0].classList.remove('diff__highlight');
	diff.cur_highlighted[1].classList.remove('diff__highlight');
};

/*file select*/
let diffFiles = null;
let diffFilesCount = 0;
function handleFile(event){
	const file = event.target.files[0];
	if(file.type!=='text/plain'){
		info.set('status','wrong file type');
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
		case -1:
			console.log(i);
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
