// 달러함수(document.querySelector())
let $ = (selector, text) => {
	if(text){
		return document.querySelector(selector).innerHTML += `${text}<br>`;
	}
	return document.querySelector(selector);
}

// 현재 시간 표시해주기
let renderCurrentTimer = ()=>{
	let now = new Date(); // 현재 시간을 반환하는 객체 생성
	
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	
	// 삼항연산자
	hour = hour < 10? '0' + hour : hour;
	minutes = minutes < 10? '0' + minutes : minutes;
	seconds = seconds < 10? '0' + seconds : seconds;
	
	$('.txt_clock').innerHTML =
						`${hour} : ${minutes} : ${seconds}`;
	
}

// 사용자 이름 표시해주기
let renderUser = (event)=>{
	let input = $('.inp_username').value;
	localStorage.setItem('username',input);
	
	convertmainDiv(input);
}

// 요소를 삭제하고 화면에 다시 그려주기
let removeSchedule = event=>{
	let curPage = Number($('#currentPage').textContent);
	let todoList = JSON.parse(localStorage.getItem('todo'));
	
	let removedList = todoList.filter(e=>{
		return event.target.dataset.idx != e.idx;
	});
	
	console.dir(removedList);
	localStorage.setItem('todo',JSON.stringify(removedList));
	
	let end = curPage * 8;
	let begin = end - 8;
	
	renderSchedule(removedList.slice(begin, end));
}

// 전달받은 일정을 화면에 그리는 함수
let renderSchedule = (todoList)=>{
	// 이미 그려졌던 div를 초기화
	document.querySelectorAll('.todo-list>div').forEach(e=>{
		e.remove();
	});
	
	// input 요소 입력칸 초기화
	$('.inp_username').value = '';
	
	// 배열의 값을 div에 다시 그려주기
	todoList.forEach(e=>{
		let workDiv = document.createElement('div'); // CSS 스타일 적용을 위해 div 사용
		workDiv.innerHTML = `${e.work} <i class="far fa-trash-alt" data-idx=${e.idx}></i>`;
		$('.todo-list').append(workDiv);
	});
	
	document.querySelectorAll('.todo-list>div>i').forEach(e=>{
		e.addEventListener('click',removeSchedule);
	});
}

// 일정 등록 함수
let registSchedule = (event)=>{
	let input = $('.inp_username').value;
	
	if(!input){
		alert('입력된 값이 없습니다.');
		return;
	}
	
	let prevTodo = localStorage.getItem('todo');
	
	let todoList = [];
	
	if(prevTodo){
		todoList = JSON.parse(prevTodo);
		
		// 식별자로 사용할 인덱스 설정
		let idx = Number(localStorage.getItem('lastIdx'))+1;
		localStorage.setItem('lastIdx',idx);
		
		todoList.unshift({work: input, idx: idx});
	}else{
		//처음 동작하는 상황에 인덱스 설정
		localStorage.setItem('lastIdx',0);
		todoList.unshift({work: input, idx: 0});
	}
	
	localStorage.setItem('todo',JSON.stringify(todoList));
	
	renderSchedule(todoList.slice(0,8));
}

// 통합 페이지 이동 메서드
let renderPagination = (event)=>{
	let dir = Number(event.target.dataset.dir);
	let curPage = Number($('#currentPage').textContent);
	let lastPage = 1;
	let renderPage = curPage + dir;
	
	let todoList = localStorage.getItem('todo');
	
	if(todoList){
		todoList = JSON.parse(todoList);
		let todoCnt = todoList.length;
		lastPage = Math.ceil(todoCnt/8); // ceil: 올림처리
	}
	
	if(renderPage > lastPage){
		alert('마지막 페이지입니다.');
		return;
	}
	
	if(renderPage < 1){
		alert('첫 페이지입니다.');
		return;
	}
	
	let end = renderPage * 8;
	let begin = end - 8;
	
	renderSchedule(todoList.slice(begin,end));
	$('#currentPage').textContent = renderPage;
}

// 이름이 입력되면 보여주는 화면 구성을 변경함
let convertmainDiv = (username)=>{
	$('.username').innerHTML = username;
	$('.inp_username').placeholder = 'Enter your schedule';
	$('.inp_username').value = '';
	
	/*$('.wrap.username').className = 'wrap_todo';
	$('.frm_username').className = 'frm_todo';
	$('.inp_username').className = 'inp_todo';*/
	
	// 로그인 시 화면 구성을 변경함
	$('.main').style.justifyContent = 'space-between';
	$('.wrap_todo').style.marginRight = '20vw';
	$('.todo-list').style.display = 'block';
	
	/*$('.frm_username').removeEventListener('submit',renderUser);*/
	$('.frm_username').addEventListener('submit',registSchedule);
	// 화살표 버튼에 이벤트 할당
	$('#leftArrow').addEventListener('click',renderPagination);
	$('#rightArrow').addEventListener('click',renderPagination);
}

(()=>{
	let username = localStorage.getItem('username');
	let todoList = localStorage.getItem('todo');
	
	if(username){ // 사용자가 저장해놓은 값이 있다면
		convertmainDiv(username);
		
		if(todoList){
			todoList = JSON.parse(todoList);
			renderSchedule(todoList.slice(0,8));
		}
	}else{
		$('.frm_username').addEventListener('submit',renderUser);
	}
	
	setInterval(renderCurrentTimer,1000);
})();


