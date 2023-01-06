

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


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
//     if(changeInfo.status == 'complete') {
//         /* 탭 정보 변경 후, 수행할 로직 작성 */
//         // const regex = /^https:\/\/www\.acmicpc\.net\/status.{0,}/i;
//         console.log('탭 변경 됨' + tab.url + ' ' + regex.test(tab.url));
//         chrome.browserAction.openPopup();

//         // if(regex.test(tab.url)){
//         //     chrome.scripting.executeScript({
//         //         target: { tabId: tabId },
//         //         func: addUploadBtnToResult
//         //     });
//         // }
//     }
// });

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

/**
 * contentScript로 부터 전달받은 메세지에 대한 처리
 * @param request {
 *      closeWebPage: true,
 *      isSuccess: true,
 *      token,
 *      username,
 *      KEY: this.KEY,
 *   }
 */
function handleMessage(request) {
    if (request && request.closeWebPage === true && request.isSuccess === true) {
        /* 인증된 유저 이름을 로컬 스토리지에 저장 */
        chrome.storage.local.set(
            { BaekjoonHub_username: request.username }
        );

        /* 인증에 사용된 토큰을 로컬 스토리지에 저장 */
        chrome.storage.local.set(
            { BaekjoonHub_token: request.token }
        );

        /* 파이프 닫기 */
        chrome.storage.local.set({ pipe_BaekjoonHub: false }, () => {
            console.log('Closed pipe.');
        });

        /* 다시 welcome.html로 돌아감 */
        const urlOnboarding = `chrome-extension://${chrome.runtime.id}/welcome.html`;
        chrome.tabs.create({ url: urlOnboarding, selected: true }); // creates new tab

    } else if (request && request.closeWebPage === true && request.isSuccess === true) {
        alert('Something went wrong while trying to authenticate your profile!');
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.remove(tab.id);
        });
    }
}

chrome.runtime.onMessage.addListener(handleMessage);
