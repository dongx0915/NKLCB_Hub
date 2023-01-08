
/**
 * 백준 페이지에 디렉토리 선택 Modal을 추가하는 함수
 */
function addModal(){
    let body = document.querySelector('body');

    body.innerHTML = body.innerHTML + 
    `
    <div class="modal-bg"></div>
    <div class="modal-wrap">
        <h1 id="title">N<span style="color: #0078c3">/&lt;</span>LCB<span style="color: #0078c3"> Hub</span></h1>

        <p id="caption">업로드할 폴더를 지정해주세요<br>
            Please select a folder to upload</p>
        
        <div id="BaekjoonHub_progress_elem" class=""></div>

        <div id="caption">선택 경로 : <span id="select-dir"></span> </div>

        <div id="tree"></div>

        <br>
        <p id="caption">*디렉토리는 최초 1회만 갱신됩니다.<br>디렉토리 갱신을 원하는 경우 <a href="javascript:void(0);">여기</a>를 눌러주세요</p>

        <button id = "select-directory" class="btn btn-primary btn-sm form-control">선택</button>
        <button class="modal-close btn btn-default btn-sm form-control" style="margin-top: 10px">닫기</button>
    </div>`;

    let modalclose = document.querySelector('.modal-close');
    modalclose.addEventListener("click", popClose)
}

async function popOpen(bojData) {
    const elem = document.getElementById('BaekjoonHub_progress_elem');
    elem.className = ''; // 기존 완료 아이콘 CSS 없애기

    let modalPop = document.querySelector('.modal-wrap');   // $('.modal-wrap');
    let modalBg = document.querySelector('.modal-bg');      // $('.modal-bg');
    let json = await getObjectFromLocalStorage('directoryMap');
    
    if(isNull(json)){
        alert('로딩된 디렉토리가 없습니다.\n\nRepository 연결 상태를 확인해주세요.');
        return;
    }

    json = JSON.parse(json);


    $('#tree').bstreeview({ data: JSON.stringify(json)});

    modalBg.style = "display: block";
    modalPop.style = "display: block";

    let selectBtn = document.querySelector('#select-directory');
    selectBtn.addEventListener("click", function(){
        // 로딩 CSS 표시
        const elem = document.getElementById('BaekjoonHub_progress_elem');
        elem.className = 'BaekjoonHub_progress';
        
        let selectDir = document.querySelector('#select-dir').textContent;
        if(selectDir == '') bojData.directory = bojData.dirName;
        else bojData.directory = selectDir + '/' + bojData.dirName;


        //bojData.directory = document.querySelector('#select-dir').textContent + '/' + bojData.dirName;
        uploadOneSolveProblemOnGit(bojData, null);
    });

}

function popClose() {
    var modalPop = $('.modal-wrap');
    var modalBg = $('.modal-bg');

    $(modalPop).hide();
    $(modalBg).hide();
}