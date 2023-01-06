
/**
 * 백준 페이지에 디렉토리 선택 Modal을 추가하는 함수
 */
function addModal(){
    let body = document.querySelector('body');

    body.innerHTML = body.innerHTML + 
    `
    <div class="modal-bg"></div>
    <div class="modal-wrap">
        <h1 id="title">Baekjoon<span style="color: #0078c3">Hub</span></h1>

        <p id="caption">업로드할 폴더를 지정해주세요<br>
            Please select a folder to upload</p>
        <br />

        <div id="caption">선택 경로 : <span id="select-dir"></span> </div>

        <div id="tree"></div>

        <br>
        <button id = "select-directory" class="btn btn-primary btn-sm form-control">선택</button>
        <button class="modal-close btn btn-default btn-sm form-control" style="margin-top: 10px">닫기</button>
    </div>`;

    // <button class="modal-close">닫기</button>
    let modalclose = document.querySelector('.modal-close');
    modalclose.addEventListener("click", popClose)
}

async function popOpen(bojData) {
    console.log(bojData);

    let modalPop = document.querySelector('.modal-wrap');   // $('.modal-wrap');
    let modalBg = document.querySelector('.modal-bg');      // $('.modal-bg');
    
    let json = JSON.parse(await getObjectFromLocalStorage('directoryMap'));
    $('#tree').bstreeview({ data: JSON.stringify(json)});

    modalBg.style = "display: block";
    modalPop.style = "display: block";

    let selectBtn = document.querySelector('#select-directory');
    selectBtn.addEventListener("click", function(){
        bojData.directory = document.querySelector('#select-dir').textContent + bojData.dirName;
        uploadOneSolveProblemOnGit(bojData, null);
    });

}

function popClose() {
    var modalPop = $('.modal-wrap');
    var modalBg = $('.modal-bg');

    $(modalPop).hide();
    $(modalBg).hide();
}