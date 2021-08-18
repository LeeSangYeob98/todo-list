/**
 * 8월 17일 화요일
 */
let getCoords = ()=>{
	
	return new Promise((resolve,reject)=>{
		
		navigator.geolocation.getCurrentPosition((position)=>{
			resolve(position.coords);
		})
	})
};

let getLocationWeather = async ()=>{
	
	let coords = await getCoords();
	
	let queryString = createQueryString({
		lat: coords.latitude,
		lon: coords.longitude,
		units: 'metric',
		lang: 'kr',
		appid: 'd00edb9477c6bb599291dbd361948c96'
	});
	
	let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
	
	let response = await fetch(url);
	let datas = await response.json();
	
	let temp = datas.main.temp;
	let loc = datas.name;
	
	let res = {
		temp: datas.main.temp,
		loc: datas.name
	};
	
	return res;
}

let getBackgroundImg = async ()=>{
	
	let prevLog = localStorage.getItem('bg-log');
	
	if(prevLog){
		
		// 문자열을 객체 형태로 반환: 객체명.속성명으로 접근하기 위해서(=쉬운 접근을 위해)
		prevLog = JSON.parse(prevLog);
		
		// 만료일자가 현재 일자보다 크다면 이전 값을 그대로 반환
		if(prevLog.expirationOn > Date.now()){
			return prevLog.bg;
		}
	}
	
	let imgInfo = await requestBackgroundImg();
	
	registBackgroundLog(imgInfo);
	
	return imgInfo;
};

// 통신하는 기능을 분리해냄
let requestBackgroundImg = async ()=>{
	
	let queryString = createQueryString({
		orientation: `landscape`,
		query: `landscape`
	});
	
	let url = `https://api.unsplash.com/photos/random?${queryString}`;
	
	let headers = {
		Authorization: `Client-ID zAnnjScSpJhu4NrDk2pvBCIQg3STdecQ1yXPUEoId3c`
	};
	
	let response = await fetch(url, {headers});
	let datas = await response.json();
	
	/*let img = `url(${datas.urls.regular})`;
	// urls = {"regular": "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&fm=jpg&fit=crop&w=1080&q=80&fit=max"}
	// ㄴ 즉, 객체에서 '옵션이 설정된 이미지의 주소'를 가르키는 속성의 이름이다.*/
	
	return {
		url: datas.urls.regular,
		desc: datas.description,
		alt_desc: datas.alt_description
	}
}

// 시간을 저장하는 기능은 이미지를 불러오는 메서드에 알맞지 않으므로 분리해냄
let registBackgroundLog = (imgInfo)=>{
	
	//통신이 끝난 시간
	let expirationDate = new Date();
	
	//테스트를 위해 데이터 만료시간을 1일 뒤로 설정
	expirationDate = expirationDate.setDate(expirationDate.getDate()+1);
	
	let bgLog = {
		expirationOn: expirationDate,
		bg: imgInfo
	};
	
	// 로컬저장소에 (키,값) 형태로 저장하는 메서드: Storage.setItem();
	// 로컬 저장소는 DOMString 형태로만 저장 가능하기 때문에 문자열 형태로 파싱해준다.
	// 객체를 문자열 형태로 파싱해주는 메서드: JSON.stringify();
	
	localStorage.setItem('bg-log', JSON.stringify(bgLog));
};

// 화면을 그리는 메서드를 분리해냄: 전체 흐름을 관리
let renderBackground = async ()=>{
	
	// 위치와 날씨정보를 받아온다.
	let locationWeater = await getLocationWeather();
	// 통신결과를 객체로 반환하는 메서드이다.
	
	// 화면에 위치와 날씨정보를 그린다.
	document.querySelector('.txt_location').innerHTML = `${locationWeater.temp}º @ ${locationWeater.loc}`;
	
	// 배경에 넣을 이미지를 받아온다.
	let backgroundImage = await getBackgroundImg();
	
	// 배경에 이미지와 이미지정보를 그린다.
	document.querySelector('body').style.backgroundImage = `url(${backgroundImage.url})`;
	
	if(backgroundImage.desc){
		document.querySelector('.txt_bg').innerHTML = backgroundImage.desc;
	}else{
		document.querySelector('.txt_bg').innerHTML = backgroundImage.alt_desc;
	}
};

renderBackground();
