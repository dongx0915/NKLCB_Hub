const currentUrl = window.location.href;

function findUsername() {
    if(USER_NAME != null) return USER_NAME;
    if(currentUrl == 'https://www.acmicpc.net/') return null;
    
    const el = document.querySelector('a.username');
    console.log('username = ' + el);

    if (el == null) return null;
    
    const username = el?.innerText?.trim();
    if (username == null) return null;

    return username;
};