const currentUrl = window.location.href;

function findUsername() {
    if(currentUrl != 'https://www.acmicpc.net/') return null;
    
    const el = document.querySelector('a.username');
    alert(el);
    console.log(el);

    if (el == null) return null;
    
    const username = el?.innerText?.trim();
    if (username == null) return null;

    alert(username);
    return username;
};

var username = findUsername();