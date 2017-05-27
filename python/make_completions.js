// 方法	返回值	注释

let tplstr = `



AES_ENCRYPT(str,key)		返回用密钥key对字符串str利用高级加密标准算法加密后的结果，调用AES_ENCRYPT的结果是一个二进制字符串，以BLOB类型存储
AES_DECRYPT(str,key)		返回用密钥key对字符串str利用高级加密标准算法解密后的结果
DECODE(str,key)		使用key作为密钥解密加密字符串str
ENCRYPT(str,salt)		用关键词salt加密字符串str
ENCODE(str,key)		使用key作为密钥加密字符串str结果是一个二进制字符串，它以BLOB类型存储
MD5()		计算字符串str的MD5校验和
PASSWORD(str)		返回字符串str的加密版本，这个加密过程是不可逆转的，和UNIX密码加密过程使用不同的算法。
SHA()		计算字符串str的安全散列算法(SHA)







`;

let [
      modelName, 
      commantTag,
      objAlias
  ] = 
   [
      "mysql.group.", 
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


