const diff = {};

/*main*/
diff.diffFiles = (files)=>{
	fetch("http://"+location.host+"/diff/",{
		method: 'post',
    	body: files
	})
	.then(e=>e.json())
	.then(e=>{
		diff.show_sideBySide(e);
	});
}

diff.splitDiff = (diffs)=>{
	const _ = /(?:\n|\r\n|\n\r)$/g;
	const n_diff = [];
	let i = 0;
	diffs.forEach(diff=>{
		if(n_diff[i]===undefined)
			n_diff[i]=[];
		n_diff[i].push(diff);
		if(diff.type>=0 && diff.text.match(_)!==null)
			i++;
	});
	return n_diff;
};

diff.show_sideBySide = (_diff)=>{
	let _id = 0;
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
			_ = diff.el.highlight(buff_line_left,buff_line_right,'diff__old','diff__new',_id);
		else
			_ = diff.el.highlight(buff_line_left,buff_line_right,'diff__eql','diff__eql',_id);

		buff_left.push(_[0]);
		buff_right.push(_[1]);

		_id++;
	});
	const diff_l = document.getElementsByClassName("diff")[0];
	const diff_r = document.getElementsByClassName("diff")[1];
	
	buff_left.forEach(e=>diff_l.appendChild(e));
	buff_right.forEach(e=>diff_r.appendChild(e));
};

/*elements*/
diff.el = {};

diff.el.info  = (text,class_) =>{
	const e = document.createElement('span');
	e.textContent = text;
	e.className = class_;
	return e;
};

diff.el.highlight = (elements_a,elements_b,class_a,class_b,id) =>{
	const el = document.createElement('span');
	el.className = class_a;
	el.onmouseleave = diff.highlight_hide;
	elements_a.forEach(e=>el.appendChild(e));

	const er = document.createElement('span');
	er.className = class_b;
	er.onmouseleave = diff.highlight_hide;
	elements_b.forEach(e=>er.appendChild(e));
	
	el.onmouseenter = diff.highlight.bind(null,el,er);
	er.onmouseenter = diff.highlight.bind(null,er,el);

	return [el,er];
}

/*highlight*/
diff.cur_highlighted;

diff.highlight = (e1,e2)=>{
	diff.cur_highlighted = [e1,e2];

	diff.cur_highlighted[0].classList.add('diff__highlight');
	diff.cur_highlighted[1].classList.add('diff__highlight');

	tooltip.innerHTML = diff.cur_highlighted[1].innerHTML;
	tooltip.showAtElement(diff.cur_highlighted[0]);
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

file_input1.addEventListener("change",handleFile);
file_input2.addEventListener("change",handleFile);

/*tooltip*/
const tooltip = document.getElementById("tooltip");

tooltip.show = (x,y)=>{
	tooltip.style.left = x+"px";
	tooltip.style.top = y+"px";
	tooltip.style.display='block';
};

tooltip.showAtElement = (e)=>{
	const rect = e.getBoundingClientRect();
	const y = rect.bottom + window.pageYOffset - document.documentElement.clientTop;
	const x = rect.left + window.pageXOffset - document.documentElement.clientLeft;
	tooltip.show(x,y);
};

tooltip.hide = ()=>{
	tooltip.style.display='none';	
}