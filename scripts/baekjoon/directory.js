class Tree{
    constructor(text, icon, nodes){
        this.text = text;
        this.icon = icon;
        this.nodes = nodes;
    }
}

function convertDirectoryToTree(tree, map){
    if (map.size == 0) return;

    map.forEach((value, key) => {
        let array = new Array();
        let icon = 'fa fa-inbox';
        // 마지막 폴더인 경우 nodes를 null로, icon은 archive로 표시
        // 더 이상 들어가지 못하도록
        if(value.size == 0) {
            array = null;
            icon = 'fa fa-archive';
        }
        const subdir = new Tree(key, icon, array);
        convertDirectoryToTree(subdir, value);
        tree.nodes.push(subdir);
    })
}

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
        convertDirectoryToMap(directoryMap, element.path);
    });
    
    /**
     * map으로 변환한 디렉토리를 다시 JSON으로 변환
     * 해당 JSON을 Popup.js로 전송해서 폴더 선택 가능하도록 하면됨
     * (부트스트랩 treeview 이용)
     */
    const array = new Array();
    directoryMap.forEach((value, key) =>{
        let tree = new Tree(key, 'fa fa-inbox', new Array());
        convertDirectoryToTree(tree, value);
        array.push(tree);
    })
    
    console.log(array);

    //console.log(directoryMap);

    saveObjectInLocalStorage({directoryMap: JSON.stringify(directoryMap)});
}