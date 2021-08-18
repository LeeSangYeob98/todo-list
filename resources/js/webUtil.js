/**
 * 창을 가운데 띄우기 위한 함수
 */
let createPopup = (popupInfo)=>{ //객체 매개변수
	let left = (window.innerWidth/2)-popupInfo.width/2;
	let top = (window.innerHeight/2)-popupInfo.height/2;
	
	let popup = open(popupInfo.url,popupInfo.name
			,`width=${popupInfo.width},height=${popupInfo.height},left=${left},top=${top}`);
}

let createQueryString = params=>{
	
	let arr = [];
	
	for(key in params){
		arr.push(key+'='+params[key]);
	}
	return arr.join('&');
}