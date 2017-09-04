// 方法	返回值	注释

let tplstr = `



concat(arrayX,arrayX,......,arrayX)	arr	合并数组
join(separator)	str	数组转字符串
pop()	item	弹出最后元素
push(newelement1,newelement2,....,newelementX)	length	末尾压入元素
reverse()		倒序
shift()	item	弹出首元素
slice(start,end)	newArr	从某个已有的数组返回选定的元素
sort()		排序
splice(index,howmany,item1,.....,itemX)	delItems	增删元素
unshift(newelement1,newelement2,....,newelementX)	length	前部压入元素







`;

let [
      modelName,
      commantTag,
      objAlias
  ] =
   [
      "array.",
    ";//",
    "${2:arrObj}."
   ];


var promiseVal = new Promise(function(resolve, reject) {
    let arr = tplstr.trim().split(/\n/);
    if(arr&&arr.length>0){
    	resolve(arr);
    }else{
    	reject();
    }
});


let obj=[];//提取数据的存储

let resultStr="";//结果字符串

//处理行字符串
function handlerRow(rowStr) {
	let rowArr= rowStr.split(/\t/);
	obj.push(rowArr);
}


promiseVal.then(function(value) {
  return  new Promise(function(resolve, reject) {
    value.forEach((item)=>{
  	  handlerRow(item);

    });
  });

}, function(error) {
  console.warn(error);
});


promiseVal.then(()=>{
	return  new Promise(function(resolve, reject) {
	  obj.forEach((item,index)=>{
		handlerItem(item,index,obj);
		});
	});

});

promiseVal.then((value)=>{
	console.log(resultStr);
});

function handlerItem(item,index,value) {
	let [title, content ] = ["", ""];
	title=getTitle(item);
	content=getContent(item);
	let rowStr=concat(title,content);
	resultStr+=rowStr+"\n";
}

function getTitle(item,index,value) {
	let apiName = /^(.*)\(/.test(item[0]);
	// return modelName+RegExp.$1+item[2];
	return modelName+RegExp.$1+"\\t"+item[2];
}

function getContent(item,index,value) {
	let result="",tag=0;
	let content = item[0].replace(/\$/g,"\\\\$").replace(/\"/g,"\\\"");
	content=content.replace(/\(/,"(${3:").replace(/\)/,"})");
	content=content.replace("(${3:})","()");
	content=content.replace(/\[?\,/g,(word)=>{
		tag++;
		if("[,"==word){
			return "}"+"${:"+word+(tag+3);
		}
		return "}"+word+"${"+(tag+3)+":";
	});
	if(item[1]){
		result+='${1:'+item[1]+'}='+objAlias;
	}else{
		result+=objAlias;
	}
	result+=content+commantTag+item[2];
	return result;//item[0];
}

function concat(title,content) {
		let tpl=`{ "trigger": "${title}", "contents": "${content}" },`;
	return tpl;
}


