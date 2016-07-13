'use strict';

/**
 * Модуль, экспортирующий функцию
 * Которая возвращает функцию Диффа из libvoiddiff
 * Функция диффа принимает две строки и уровень точности (0 - по строкам, 1 - по словам)
 */
module.exports = function (){
	const ffi = require('ffi');
	const ref = require('ref');
	const ArrayType = require('ref-array');
	const Struct = require('ref-struct');

	const diff_info = Struct({
		'text': 'string',
		'type': 'int'
	});

	const diff_info_array = ArrayType(ref.refType(diff_info));

	const libdiff = new ffi.Library('./libvoiddiff',{
		'__diffString': [diff_info_array,['string','string','int']]
	});

	return function(text1, text2, detail, callback){
		libdiff.__diffString.async(text1,text2,detail,(err,res)=>{
			if(err)
				throw err;
			const _ = res;
			_.length=1;
			_.length = diff_info(_[0]).type+1;

			const diff=[];
			for(let i=1; i<_.length;i++)
				diff.push({
					type: diff_info(_[i]).type,
					text: diff_info(_[i]).text
				});
			callback(diff);
		});
	}
};