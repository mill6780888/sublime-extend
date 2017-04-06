let tplstr = `


assert(value[, message])		测试 value 是否为真值
assert.deepEqual(actual, expected[, message])		测试 actual 参数与 expected 参数是否深度相等。 原始值使用相等运算符（==）比较。
assert.deepStrictEqual(actual, expected[, message])		首先，原始值使用全等运算符（===）比较。 其次，对象的比较包括检查它们的原型是否全等。
assert.doesNotThrow(block[, error][, message])		当 assert.doesNotThrow() 被调用时，它会立即调用 block 函数
assert.equal(actual, expected[, message])		使用相等运算符（==）测试 actual 参数与 expected 参数是否相等
assert.fail(actual, expected, message, operator)		抛出 AssertionError
assert.ifError(value)		如果 value 为真，则抛出 value
assert.notDeepEqual(actual, expected[, message])		测试是否不深度相等
assert.notDeepStrictEqual(actual, expected[, message])		测试是否不深度全等
assert.notEqual(actual, expected[, message])		使用不等运算符（!=）测试是否不相等
assert.notStrictEqual(actual, expected[, message])		使用不全等运算符（!==）测试是否不全等
assert.ok(value[, message])		测试 value 是否为真值
assert.strictEqual(actual, expected[, message])		使用全等运算符（===）测试是否全等
assert.throws(block[, error][, message])		期望 block 函数抛出错误




`;

let [
      modelName, 
      commantTag,
      objAlias
  ] = 
   [
      "nodejs.", 
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


