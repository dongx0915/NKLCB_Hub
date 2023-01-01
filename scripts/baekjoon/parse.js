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
    //이미지에 상대 경로가 있을 수 있으므로 이미지 경로를 절대 경로로 전환
    convertImageTagAbsoluteURL(doc.getElementById('problem_description')); 
    
    let problem_tier_img = doc.querySelector('.page-header > blockquote');
    problem_tier_img = problem_tier_img.innerHTML.split('&nbsp')[0].replace('<img', '<img width="20px" ');

    const problemId = doc.getElementsByTagName('title')[0].textContent.split(':')[0].replace(/[^0-9]/, '');
    const problem_title = doc.getElementById('problem_title').innerHTML.trim();
    const problem_description = unescapeHtml(doc.getElementById('problem_description').innerHTML.trim());
    const problem_input = unescapeHtml(doc.getElementById('problem_input')?.innerHTML.trim?.());   // eslint-disable-line
    const problem_output = unescapeHtml(doc.getElementById('problem_output')?.innerHTML.trim?.()); // eslint-disable-line

    if (problemId && problem_description) {
        // if (debug) console.log(`문제번호 ${problemId}의 내용을 저장합니다.`);
        return { problemId, problem_title, problem_description, problem_input, problem_output, problem_tier_img };
    }
    return {};
}



/**
 * Readme를 생성하는 함수
 */
function makeReadme(problem_info) {
    const { 
        submitNo,            /* 제출 번호 */
        user,                /* 사용자 닉네임 */
        result,              /* 채점 결과 */
        memory,              /* 코드 메모리 */
        time,                /* 실행 시간 */
        lang,                /* 사용 언어 */
        byte,                /* 코드 바이트 수 */
        submitTime,          /* 제출 시간 */
        problemId,           /* 문제 번호 */
        problem_description, /* 문제 설명 */
        problem_title,       /* 문제 명 */
        problem_input,       /* 문제 입력 */
        problem_output,      /* 문제 출력 */
        problem_tier_img     /* 문제 티어 이미지 */
    } = problem_info;

    const readme = 
    `# ${problem_tier_img} [${problem_title}](https://www.acmicpc.net/problem/${problemId}) \n\n` +
    `| 제출 번호 | 닉네임 | 채점 결과 | 메모리 | 시간 | 언어 | 코드 길이 |\n` +
    `|---|---|---|---|---|---|---|\n` +
    `|${submitNo}|${user}|${result.replace('Github Upload', '')}|${memory}KB|${time}ms|${lang}|${byte}B|\n\n`+
    `## 문제\n` + 
    `${problem_description}\n\n` +
    `## 입력\n` + 
    `${problem_input}\n\n` + 
    `## 출력\n` + 
    `${problem_output}\n\n`;

    console.log(readme);

    // const readme = `# [${level}] ${title} - ${problemId} \n\n`
    //     + `[문제 링크](https://www.acmicpc.net/problem/${problemId}) \n\n`
    //     + `### 성능 요약\n\n`
    //     + `메모리: ${memory} KB, `
    //     + `시간: ${runtime} ms\n\n`
    //     + `### 분류\n\n`
    //     + `${category || "Empty"}\n\n` + (!!problem_description ? ''
    //         + `### 문제 설명\n\n${problem_description}\n\n`
    //         + `### 입력 \n\n ${problem_input}\n\n`
    //         + `### 출력 \n\n ${problem_output}\n\n` : '');
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