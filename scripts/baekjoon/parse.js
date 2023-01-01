/**
 * 채점 결과 테이블 td로 문제 정보를 가져오는 함수
 */
function getProblemInfo(td){
    var problemInfo = {
        submitNo : td[0].textContent,
        user : td[1].textContent,
        problemNo : td[2].textContent,
        result : td[3].textContent,
        memory : td[4].textContent,
        time : td[5].textContent,
        lang : td[6].querySelectorAll('a')[0].textContent,
        byte : td[7].textContent,
        submitTime : td[8].textContent
    };

    return problemInfo;
}

/**
 * 문제 번호를 통해 해당 문제의 html을 가져오는 함수
 * 파싱 후 리턴
*/
async function fetchProblemDescriptionById(problemId) {
    return fetch(`https://www.acmicpc.net/problem/${problemId.trim()}`)
      .then((res) => res.text())
      .then((html) => {
        console.log(html);
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return parseProblemDescription(doc);
      });
  }

/**
 * 제출 코드로 소스 코드를 가져오는 함수
 * @param {int} submissionId 
 * @returns
 */
async function fetchSubmitCodeById(submissionId) {
    return fetch(`https://www.acmicpc.net/source/download/${submissionId}`, { method: 'GET' })
        .then((res) => res.text())
}

/**
 * 문제 정보(문제 번호, 설명, 입출력)을 가져오는 함수
 */
function parseProblemDescription(doc = document) {
    const problemId = doc.getElementsByTagName('title')[0].textContent.split(':')[0].replace(/[^0-9]/, '');
    const problem_description = unescapeHtml(doc.getElementById('problem_description').innerHTML.trim());
    const problem_input = doc.getElementById('problem_input')?.innerHTML.trim?.().unescapeHtml?.() || 'Empty'; // eslint-disable-line
    const problem_output = doc.getElementById('problem_output')?.innerHTML.trim?.().unescapeHtml?.() || 'Empty'; // eslint-disable-line

    if (problemId && problem_description) {
        // if (debug) console.log(`문제번호 ${problemId}의 내용을 저장합니다.`);
        return { problemId, problem_description, problem_input, problem_output };
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
  