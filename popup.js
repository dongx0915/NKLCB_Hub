function getCurrentTabUrl(callback){
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs){
        var tab = tabs[0];
        var url = tab.url;
        callback(url);
    });
}

function renderURL(statusText){
    document.querySelector('#urls').textContent = statusText;
}

// 화면 상의 모든 html 요소가 돔 형태로 불러졌을 때
// $(document).ready(function(){
//     $('#getUrl').click(function(){
//         getCurrentTabUrl(function(url){
//             renderURL(url);
//         });
//     });
// });

// 화면 상의 모든 html 요소가 돔 형태로 불러졌을 때
// document.addEventListener('DOMContentLoaded', function(){
//     var btn = this.documentElement.querySelector('#btn');
//     var linkbtn = this.documentElement.querySelector('#getUrl');

//     btn.addEventListener("click", hi);
//     linkbtn.addEventListener("click", function(){
//         getCurrentTabUrl(function(url){
//             renderURL(url);
//         });
//     });
// });