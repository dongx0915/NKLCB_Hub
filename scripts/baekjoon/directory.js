function convertDirectoryToMap(map, path) {
    if (path == 0) return;

    const dir = path.split('/')[0];
    const lestStr = path.substr(dir.length + 1);

    if (!map.has(dir)) { // 해당 디렉토리가 저장되어있지 않으면
        map.set(dir, new Map());
    }

    convertDirectoryToMap(map.get(dir), lestStr);
}


/**
 * 사용자가 선택한 Repository의 디렉토리 구조를 Map으로 저장하는 함수
 */
async function saveRepositoryDirectory() {
    const token = await getToken(); // 토큰 가져오기
    const hook  = await getHook();  // 리포지토리 경로 가져오기

    if (isNull(token) || isNull(hook)) {
        console.error('token or hook is null', token, hook);
        return;
    }

    const git = new GitHub(hook, token);
    // 전체 디렉토리 가져오기 (결과가 로컬 스토리지에 저장 됨)
    git.getTree(); 
    // 저장된 디렉토리 가져오기
    const treedata = await getTreeInLocalStorage();

    treedata.forEach(element => {
        convertDirectoryToMap(diretoryMap, element.path);
    });
    
    console.log(diretoryMap);
    saveObjectInLocalStorage({diretoryMap: diretoryMap});
}