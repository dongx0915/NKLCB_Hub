function unescapeHtml(text) {
    const unescaped = {
        '&amp;': '&',
        '&#38;': '&',
        '&lt;': '<',
        '&#60;': '<',
        '&gt;': '>',
        '&#62;': '>',
        '&apos;': "'",
        '&#39;': "'",
        '&quot;': '"',
        '&#34;': '"',
        '&nbsp;': ' ',
        '&#160;': ' ',
    };
    return text.replace(/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g, function (m) {
        return unescaped[m];
    });
}

/**
 * 상대 경로 이미지를 절대 경로로 변경하는 함수
 */
function convertImageTagAbsoluteURL(doc = document) {
    if (isNull(doc)) return;
    // img tag replace Relative URL to Absolute URL.
    Array.from(doc.getElementsByTagName('img'), (x) => {
        console.log(x);
        x.src = x.src; // 밑의 코드 대신 해당 코드를 써야 경로가 바꿔짐 (다른 환경에서 테스트 해보기)
        //x.setAttribute('src', x.currentSrc);
        return x;
    });
}


/**
* 해당 값이 null 또는 undefined인지 체크합니다.
* @param {any} value - 체크할 값
* @returns {boolean} - null이면 true, null이 아니면 false
*/
function isNull(value) {
    return value === null || value === undefined;
}