

// chrome.runtime.onInstalled.addListener : 프로그램의 설치 시점에 설정값들을 세팅합니다.
// chrome.runtime.onMessage.addListener : 메세지를 받았을 때 수행됩니다. request.action 값을 통해 메세지의 의도를 전달하는 방식으로 구현할 수 있습니다.
// chrome.tabs.onActivated.addListener : 현재 활성화된 탭이 변경되는 시점에 수행됩니다.


/**
 * 탭의 상태가 변경될 때 발생
 * tabId: 변경된 탭의 ID
 * changeInfo: 변경된 내용
 * tab: 변경된 탭 Object
 * 
 * 필요한 changeInfo: status ( unloaded / loading / complete ) 
 *      ⇒ status == complete 를 체크해주지 않을 시, 로딩 중 다양한 변화에도 Listner가 작동하여 불필요한 호출이 반복된다.
 */
var username = 'dongdong99';
function changeNickname(){
    document.querySelector('.username').text = 'hi'
}

/**
 * 채점 결과에 업로드 버튼 추가하는 함수
 * 맞춘 문제에 대해서만 적용
 */
function addUploadBtnToResult(){
    var resultTable = document.querySelector('.table-responsive');
    var results = resultTable.querySelectorAll('tbody > tr');

    for (const rows of results) {
        var td = rows.querySelectorAll('td');

        if(td[3].textContent == '맞았습니다!!'){
            //alert(submitNo + ' : ' + user + ' ' + problemNo + ' ' + result + ' ' + memory + ' ' + time + ' ' + lang + ' ' + byte + ' ' + submitTime);
            td[3].style = "justify-content:center";
            td[3].innerHTML = td[3].innerHTML + 
            '<div style="float:right;"><a href="javascript:void(0);" class="uploadBtn">Github Upload</a></div>';
        }
    }

    // a 태그에 클릭 이벤트 등록(이렇게해야 해당 a 태그에 해당하는 문제 정보를 가져올 수 있음)
    var uploadbtn = document.querySelectorAll('.uploadBtn');
    uploadbtn.forEach( it =>
        it.addEventListener("click", async function(){
            const td = it.parentNode.parentNode.parentNode.querySelectorAll('td');
            // 채점 결과 테이블의 데이터를 가져옴
            const table_data = getProblemInfo(td);
            // problem_info로 데이터 병합
            const problem_info = Object.assign({},
                table_data,
                await fetchProblemDescriptionById(table_data.problemNo),
                await fetchSubmitCodeById(table_data.submitNo)
            );

            console.log(problem_info);

            makeReadme(problem_info);
            uploadToGithub(table_data);
        })
    );
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    if(changeInfo.status == 'complete') {
        /* 탭 정보 변경 후, 수행할 로직 작성 */
        console.log('탭 변경 됨' + tab.url);
        if(tab.url == 'https://www.acmicpc.net/status?user_id=dongdong99'){
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: addUploadBtnToResult
            });
        }
    }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    // UPDATE: re-rendering view
    console.log('탭 로딩 완료');
});

chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: 'popup.html'
        });
    }
});