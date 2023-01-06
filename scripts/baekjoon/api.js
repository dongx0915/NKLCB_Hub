/**
 * 문제 번호를 통해 해당 문제의 html을 가져오는 함수
 * 파싱 후 리턴
*/
async function fetchProblemDescriptionById(problemId) {
    return fetch(`https://www.acmicpc.net/problem/${problemId.trim()}`)
        .then((res) => res.text())
        .then((html) => {
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
 * SolvedAC API를 이용하여 문제 번호로 문제 정보를 가져오는 함수
 */
async function fetchSolvedACById(problemId) {
    return fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemId.trim()}`, { method: 'GET' })
        .then((res) => res.json())
}




