function findUsername() {
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
alert(username + '로그인 됨');