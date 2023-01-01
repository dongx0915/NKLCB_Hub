/**
 * 채점 결과 테이블 td로 문제 정보를 가져오는 함수
 */
function getProblemInfo(td) {
    var problemInfo = {
        submitNo: td[0].textContent,
        user: td[1].textContent,
        problemNo: td[2].textContent,
        result: td[3].textContent,
        memory: td[4].textContent,
        time: td[5].textContent,
        lang: td[6].querySelectorAll('a')[0].textContent,
        byte: td[7].textContent,
        submitTime: td[8].textContent
    };

    return problemInfo;
}

/**
 * 문제 정보(문제 번호, 설명, 입출력, 티어 이미지)을 가져오는 함수
 */
function parseProblemDescription(doc = document) {
    let problem_tier_img = doc.querySelector('.page-header > blockquote');
    problem_tier_img = problem_tier_img.innerHTML.split('&nbsp')[0].replace('<img', '<img width="20px" ');

    const problemId = doc.getElementsByTagName('title')[0].textContent.split(':')[0].replace(/[^0-9]/, '');
    const problem_description = unescapeHtml(doc.getElementById('problem_description').innerHTML.trim());
    const problem_input = unescapeHtml(doc.getElementById('problem_input')?.innerHTML.trim?.());   // eslint-disable-line
    const problem_output = unescapeHtml(doc.getElementById('problem_output')?.innerHTML.trim?.()); // eslint-disable-line

    if (problemId && problem_description) {
        // if (debug) console.log(`문제번호 ${problemId}의 내용을 저장합니다.`);
        return { problemId, problem_description, problem_input, problem_output, problem_tier_img };
    }
    return {};
}


/**
* url에 해당하는 html 문서를 가져오는 함수
* @param url: url 주소
* @returns html document
*/
async function findHtmlDocumentByUrl(url) {
    return fetch(url, { method: 'GET' })
        .then((html) => html.text())
        .then((text) => {
            const parser = new DOMParser();
            return parser.parseFromString(text, 'text/html');
        });
}
