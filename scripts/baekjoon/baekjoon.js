const currentUrl = window.location.href;

function findUsername() {
    if(currentUrl != 'https://www.acmicpc.net/') return null;
    
    const el = document.querySelector('a.username');
    console.log(el);

    if (el == null) return null;
    
    const username = el?.innerText?.trim();
    if (username == null) return null;

    return username;
};

var username = findUsername();