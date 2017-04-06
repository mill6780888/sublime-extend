let tplstr = `
abs(x)	number	返回数字的绝对值，如abs(-10) 返回 10
ceil(x)	number	返回数字的上入整数，如math.ceil(4.1) 返回 5
cmp(x, y)	number	如果 x < y 返回 -1, 如果 x == y 返回 0, 如果 x > y 返回 1
exp(x)	float	返回e的x次幂(ex),如math.exp(1) 返回2.718281828459045
fabs(x)	number	返回数字的绝对值，如math.fabs(-10) 返回10.0
floor(x)	number	返回数字的下舍整数，如math.floor(4.9)返回 4
log(x)	number	如math.log(math.e)返回1.0,math.log(100,10)返回2.0
log10(x)	number	返回以10为基数的x的对数，如math.log10(100)返回 2.0
max(x1, x2,...)	number	返回给定参数的最大值，参数可以为序列。
min(x1, x2,...)	number	返回给定参数的最小值，参数可以为序列。
modf(x)	number	返回x的整数部分与小数部分，两部分的数值符号与x相同，整数部分以浮点型表示。
pow(x, y)	number	x**y 运算后的值。
round(x [,n])	number	返回浮点数x的四舍五入值，如给出n值，则代表舍入到小数点后的位数。
sqrt(x)	number	返回数字x的平方根，数字可以为负数，返回类型为实数，如math.sqrt(4)返回 2+0j

`;

let [
      modelName, 
      commantTag,
      objAlias
  ] = 
   [
      "spring.conf", 
    ";//",
    "${2:strObj}."
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
	return modelName+item[2];
}

function getContent(item,index,value) {
	let result="",tag=0;
	let content = item[0].replace(/\$/g,"\\\\$").replace(/\"/g,"\\\"");
	content=content.replace(/\(/,"(${2:").replace(/\)/,"})");
	content=content.replace(/\[?\,/g,(word)=>{
		tag++;
		if("[,"==word){
			return "}"+"${:"+word+(tag+3);
		}
		return "}"+word+"${:"+(tag+3);
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
