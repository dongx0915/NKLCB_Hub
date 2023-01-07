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
    
    // let problem_tier_img = doc.querySelector('.page-header > blockquote');
    // problem_tier_img = problem_tier_img.innerHTML.split('&nbsp')[0].replace('<img', '<img width="20px" ');
    
    const problemId = doc.getElementsByTagName('title')[0].textContent.split(':')[0].replace(/[^0-9]/, '');
    const problem_title = doc.getElementById('problem_title').innerHTML.trim();
    const problem_description = unescapeHtml(doc.getElementById('problem_description').innerHTML.trim());
    const problem_input = unescapeHtml(doc.getElementById('problem_input')?.innerHTML.trim?.());   // eslint-disable-line
    const problem_output = unescapeHtml(doc.getElementById('problem_output')?.innerHTML.trim?.()); // eslint-disable-line

    if (problemId && problem_description) {
        // if (debug) console.log(`문제번호 ${problemId}의 내용을 저장합니다.`);
        return { problemId, problem_title, problem_description, problem_input, problem_output };
    }
    return {};
}



/**
 * Readme를 생성하는 함수
 */
function makeDetailMessageAndReadme(problem_info) {
    const { 
        submitNo,            /* 제출 번호 */
        user,                /* 사용자 닉네임 */
        result,              /* 채점 결과 */
        memory,              /* 코드 메모리 */
        time,                /* 실행 시간 */
        lang,                /* 사용 언어 */
        byte,                /* 코드 바이트 수 */
        code,                /* 소스 코드 */
        level,               /* 문제 레벨(티어) */
        submitTime,          /* 제출 시간 */
        problemId,           /* 문제 번호 */
        problem_description, /* 문제 설명 */
        problem_title,       /* 문제 명 */
        problem_input,       /* 문제 입력 */
        problem_output,      /* 문제 출력 */
    } = problem_info;

    const directory = `baekjoon/#${problemId} ${problem_title}`;
    const dirName = `#${problemId} ${problem_title}`;
    const message = `[${problemId}] Title: ${problem_title}, Time: ${time} ms, Memory: ${memory} KB -BaekjoonHub`;
    const fileName = `${convertSingleCharToDoubleChar(problem_title)}.${languages[lang]}`;
    const problem_tier_img = `<img width=\"20px\"  src=\"https://d2gd6pc034wcta.cloudfront.net/tier/${level}.svg\" class=\"solvedac-tier\">`;

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

    return {
        directory,
        dirName,
        fileName,
        message,
        readme,
        code
    };
}

