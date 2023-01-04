/* 
    (needs patch) 
    IMPLEMENTATION OF AUTHENTICATION ROUTE AFTER REDIRECT FROM GITHUB.
*/

const localAuth = {
  /**
   * Initialize
   */
  init() {
    console.log('[ authorize.js ] localAuth 생성자');
    this.KEY = 'BaekjoonHub_token';
    this.ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
    this.AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
    this.CLIENT_ID =  'beb4f0aa19ab8faf5004';
    this.CLIENT_SECRET = '843f835609c7ef02ef0f2f1645bc49514c0e65a6';
    this.REDIRECT_URL = 'https://github.com/'; // for example, https://github.com
    this.SCOPES = ['repo'];
  },

  /**
   * Parses Access Code
   * 접근 가능한 코드로 변경
   * @param url The url containing the access code.
   */
  parseAccessCode(url) {
    if (url.match(/\?error=(.+)/)) {
      chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.remove(tab.id, function () { });
      });
    } else {
      // eslint-disable-next-line
      const accessCode = url.match(/\?code=([\w\/\-]+)/);
      if (accessCode) {
        this.requestToken(accessCode[1]);
      }
    }
  },

  /**
   * Request Token
   * 토큰 요청
   * @param code The access code returned by provider.
   */
  requestToken(code) {
    const that = this;
    const data = new FormData(); // 요청 데이터 폼 생성
    data.append('client_id', this.CLIENT_ID);
    data.append('client_secret', this.CLIENT_SECRET);
    data.append('code', code); // 요청 코드

    /**
     * 요청을 전송하기 전 응답에 대한 이벤트 리스너를 등록해둠
     */
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { // 토큰 요청에 성공한 경우
          that.finish(xhr.responseText.match(/access_token=([^&]*)/)[1]);
        } else {
          // 토큰 요청에 실패한 경우
          // 파이프를 통해서 background.js로 메세지 전송
          chrome.runtime.sendMessage({
            closeWebPage: true,
            isSuccess: false,
          });
        }
      }
    });

    //요청 전송
    xhr.open('POST', this.ACCESS_TOKEN_URL, true);
    xhr.send(data);
  },

  /**
   * Finish
   * 토큰 요청이 완료된 경우
   * 토큰을 전송하여 사용자 인증
   * @param token The OAuth2 token given to the application from the provider.
   */
  finish(token) {
    /* Get username */
    // To validate user, load user object from GitHub.
    const AUTHENTICATION_URL = 'https://api.github.com/user';

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { // 사용자 인증에 성공한 경우
          /* background.js로 메세지를 전송하여 인증 정보를 로컬 스토리지에 저장 */
          const username = JSON.parse(xhr.responseText).login;
          chrome.runtime.sendMessage({
            closeWebPage: true,
            isSuccess: true,
            token,
            username,
            KEY: this.KEY,
          });
        }
      }
    });
    // 토큰을 이용하여 사용자 인증 요청
    xhr.open('GET', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.send();
  },
};

/**
 * 변수 초기화
 */
localAuth.init(); // load params.
const link = window.location.href;

/* Check for open pipe */
/**
 * 현재 접속한 사이트가 github 인경우
 */
if (window.location.host === 'github.com') {
  chrome.storage.local.get('pipe_baekjoonhub', (data) => {
    if (data && data.pipe_baekjoonhub) {
      localAuth.parseAccessCode(link);
    }
  });
}
