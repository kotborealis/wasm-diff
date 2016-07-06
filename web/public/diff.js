const diff = {};

diff.diffStrings = (text1,text2)=>{
	fetch("http://"+location.host+"/diff/",{
		method: 'post',
		headers: {  
      		"Content-type": "application/json; charset=UTF-8"  
    	},  
    	body: JSON.stringify({
    		text1,
    		text2
    	})
	})
	.then(e=>e.json())
	.then(e=>{
		diff.show_sideBySide(e);
	});
}

diff.splitDiff = (diffs)=>{
	const _ = /(?:\n|\r\n|\n\r|\.\s|(?:\.){3}\s|\?\s|\!\s)$/g;
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

	let buff_left = "";
	let buff_right = "";

	n_diff = diff.splitDiff(_diff);

	n_diff.forEach(line=>{
		let changed = false;
		let buff_line_left = "";
		let buff_line_right = "";
		line.forEach(d=>{
			const type = d.type;
			const text = d.text.replace(/</g,'&lt;').replace(/>/g,'&gt;');

			if(type!==0)
				changed=true;

			switch(type){
				case 0:
					buff_line_left  += diff.getHtml.diff__equal(text,_id);
					buff_line_right += diff.getHtml.diff__equal(text,_id);
					break;
				case 1:
					buff_line_right += diff.getHtml.diff__insert(text,_id);
					break;
				case -1:
					buff_line_left  += diff.getHtml.diff__remove(text,_id);
					break;
			}
		});

		if(changed){
			buff_line_left = diff.getHtml.diff__old(buff_line_left,_id);
			buff_line_right = diff.getHtml.diff__new(buff_line_right,_id);
		}
		else{
			buff_line_left = diff.getHtml.diff__eql_l(buff_line_left,_id);
			buff_line_right = diff.getHtml.diff__eql_r(buff_line_right,_id);
		}
		_id++;

		buff_left += buff_line_left;
		buff_right += buff_line_right;
	});
	diff.setInnerHTML(buff_left,0);
	diff.setInnerHTML(buff_right,1);
};

diff.setInnerHTML = (buff,i)=>
	document.getElementsByClassName("diff")[i].innerHTML = buff;

diff.getHtml = {};

diff.getHtml.diff__equal  = (e) => e;
diff.getHtml.diff__insert = (e) => "<span class='diff__insert'>"+e+"</span>";
diff.getHtml.diff__remove = (e) => "<span class='diff__remove'>"+e+"</span>";

diff.getHtml.diff__eql_l = (e,id) =>
	"<span class='diff__eql' "+
	"onmouseover=\"diff.highlight('el"+id+"','er"+id+"')\" "+
	"id='el"+id+"'>"+e+"</span>";
diff.getHtml.diff__eql_r = (e,id) => 
	"<span class='diff__eql' "+
	"onmouseover=\"diff.highlight('el"+id+"','er"+id+"')\" "+
	"id='er"+id+"'>"+e+"</span>";

diff.getHtml.diff__old = (e,id) => 
	"<span class='diff__old' "+
	"onmouseover=\"diff.highlight('o"+id+"','n"+id+"')\" "+
	"id='o"+id+"'>"+e+"</span>";

diff.getHtml.diff__new = (e,id) => 
	"<span class='diff__new' "+
	"onmouseover=\"diff.highlight('o"+id+"','n"+id+"')\" "+
	"id='n"+id+"'>"+e+"</span>";

diff.cur_highlighted = null;

diff.highlight = (id1,id2)=>{
	if(diff.cur_highlighted!==null){
		if(diff.cur_highlighted[0]!==null)
			diff.cur_highlighted[0].classList.remove('diff__highlight');
		if(diff.cur_highlighted[1]!==null)
			diff.cur_highlighted[1].classList.remove('diff__highlight');
	}
	if(id1!==undefined & id2!==undefined){
		diff.cur_highlighted=[];
		const e1 = document.getElementById(id1);
		const e2 = document.getElementById(id2);
		diff.cur_highlighted.push(e1,e2);
		if(diff.cur_highlighted[0]!==null)
			diff.cur_highlighted[0].classList.add('diff__highlight');
		if(diff.cur_highlighted[1]!==null)
			diff.cur_highlighted[1].classList.add('diff__highlight');
	}
};

/*file select*/
let diffFiles = ["",""];
function handleFile1(event){
	const file = event.target.files[0];
	console.log(file);
	if(file.type!=='text/plain'){
		diffFiles[0]="";
		return;
	}
	const reader = new FileReader();
	reader.onload = ((e)=>{
		diffFiles[0] = e.target.result;
		diff.diffStrings(diffFiles[0],diffFiles[1]);
	});
	reader.readAsText(file);
}
function handleFile2(event){
	const file = event.target.files[0];
	console.log(file);
	if(file.type!=='text/plain'){
		diffFiles[1]="";
		return;
	}
	const reader = new FileReader();
	reader.onload = ((e)=>{
		diffFiles[1] = e.target.result;
		diff.diffStrings(diffFiles[0],diffFiles[1]);
	});
	reader.readAsText(file);
}
document.getElementById("file1").addEventListener("change",handleFile1);
document.getElementById("file2").addEventListener("change",handleFile2);
