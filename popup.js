
// 화면 상의 모든 html 요소가 돔 형태로 불러졌을 때
// $(document).ready(function(){
//   chrome.storage.local.get('directoryMap', (dir) => {
//       alert(dir);
//   })
// });


/* global oAuth2 */
/* eslint no-undef: "error" */

let action = false;

$('#authenticate').on('click', () => {
  if (action) {
    oAuth2.begin();
    // alert('[ popup.js ] oauth login 실행');
  }
});

/* Get URL for welcome page */
$('#welcome_URL').attr('href', `chrome-extension://${chrome.runtime.id}/welcome.html`);
$('#hook_URL').attr('href', `chrome-extension://${chrome.runtime.id}/welcome.html`);

/**
 * 로컬 스토리지에서 BaekjoonHub_token을 가져옴
 * 없으면 auth_mode를 통해서 github 인증 받도록,
 * 있으면 hook 모드를 통해 github 바로 연동
 */
chrome.storage.local.get('BaekjoonHub_token', (data) => {
  const token = data.BaekjoonHub_token;
  // alert('[ popup.js ] token = ' + token);

  if (token === null || token === undefined) {
    action = true;
    $('#auth_mode').show();
  } else {
    // To validate user, load user object from GitHub.
    const AUTHENTICATION_URL = 'https://api.github.com/user';

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          /* Show MAIN FEATURES */
          chrome.storage.local.get('mode_type', (data2) => {
            if (data2 && data2.mode_type === 'commit') {
              $('#commit_mode').show();
              /* Get problem stats and repo link */
              chrome.storage.local.get(['stats', 'BaekjoonHub_hook'], (data3) => {
                const BaekjoonHubHook = data3.BaekjoonHub_hook;
                if (BaekjoonHubHook) {
                  $('#repo_url').html(`Your Repo: <a target="blank" style="color: #0078c3;" href="https://github.com/${BaekjoonHubHook}">${BaekjoonHubHook}</a>`);
                }
              });
            } else {
              $('#hook_mode').show();
            }
          });
        } else if (xhr.status === 401) {
          // bad oAuth
          // reset token and redirect to authorization process again!
          chrome.storage.local.set({ BaekjoonHub_token: null }, () => {
            console.log('BAD oAuth!!! Redirecting back to oAuth process');
            action = true;
            $('#auth_mode').show();
          });
        }
      }
    });
    xhr.open('GET', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.send();
  }
});

/*
  초기에 활성화 데이터가 존재하는지 확인, 없으면 새로 생성, 있으면 있는 데이터에 맞게 버튼 조정
 */
chrome.storage.local.get('bjhEnable', (data4) => {
  if (data4.bjhEnable === undefined) {
    $('#onffbox').prop('checked', true);
    chrome.storage.local.set({ 'bjhEnable': $('#onffbox').is(':checked') }, () => { });
  }
  else {
    $('#onffbox').prop('checked', data4.bjhEnable);
    chrome.storage.local.set({ 'bjhEnable': $('#onffbox').is(':checked') }, () => { });
  }
})
/*
  활성화 버튼 클릭 시 storage에 활성 여부 데이터를 저장.
 */
$('#onffbox').on('click', () => {
  chrome.storage.local.set({ 'bjhEnable': $('#onffbox').is(':checked') }, () => { });
});