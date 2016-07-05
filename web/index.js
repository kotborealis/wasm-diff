'use strict';

const exec = require('child_process').exec;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/test/:filea/:fileb',(req,res)=>{
	exec("../bin/void ../tests/"+req.params.filea+" ../tests/"+req.params.fileb , (err, stdout)=> {
		res.send(stdout);
	});
});

app.listen(8019);    