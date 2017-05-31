// 方法	返回值	注释

let tplstr = `



:active		激活元素
:focus		焦点元素
:hover		鼠标悬停
:link		未访问
:visited		已访问
:first-child		首子元素
:lang		语言







`;

let [
      modelName, 
      commantTag,
      objAlias
  ] = 
   [
      "select.element\t", 
    ";//",
    "${2:numObj}."
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
	return modelName+RegExp.$1+item[2];
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
	}
	result+=content+commantTag+item[2];
	return result;//item[0];
}

function concat(title,content) {
		let tpl=`{ "trigger": "${title}", "contents": "${content}" },`;
	return tpl;
}


