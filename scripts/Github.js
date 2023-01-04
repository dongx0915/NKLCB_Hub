class GitHub {
  constructor(hook, token) {
    this.update(hook, token);
  }

  update(hook, token) {
    this.hook = hook;
    this.token = token;
  }

  async getReference(branch = 'main') {
    // hook, token, branch
    return getReference(this.hook, this.token, branch);
  }

  async getDefaultBranchOnRepo() {
    return getDefaultBranchOnRepo(this.hook, this.token);
  }

  async createBlob(content, path) {
    // hook, token, content, path
    return createBlob(this.hook, this.token, content, path);
  }

  async createTree(refSHA, tree_items) {
    // hook, token, baseSHA, tree_items
    return createTree(this.hook, this.token, refSHA, tree_items);
  }

  async createCommit(message, treeSHA, refSHA) {
    // hook, token, message, tree, parent
    return createCommit(this.hook, this.token, message, treeSHA, refSHA);
  }

  async updateHead(ref, commitSHA) {
    // hook, token, commitSHA, force = true)
    return updateHead(this.hook, this.token, ref, commitSHA, true);
  }

  async getTree() {
    // hook, token
    return getTree(this.hook, this.token);
  }

  async getHeadTree(){
    return getHeadTree(this.hook, this.token);
  }

  async getTreeOfTreeSHA(treeSHA) {
    // hook, token
    return getTreeNoRecursive(this.hook, this.token, treeSHA);
  }

  async getRepoDirectory() {
    const dir = new Directory(this.hook, new Array());
    await getRepoDirectory(this.hook, this.token, '', dir);
    return dir;
  }
}

/** get a repo default branch
 * @see https://docs.github.com/en/rest/reference/repos
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @return {Promise} - the promise for the branch sha
 */
async function getDefaultBranchOnRepo(hook, token) {
  return fetch(`https://api.github.com/repos/${hook}`, {
    method: 'GET',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.default_branch;
    });
}

/** get a reference
 * @see https://docs.github.com/en/rest/reference/git#get-a-reference
 * @param {string} hook - github repository
 * @param {string} token - reference name
 * @param {string} ref - reference name
 * @return {Promise} - the promise for the reference sha
 */
async function getReference(hook, token, branch = 'main') {
  // return fetch(`https://api.github.com/repos/${hook}/git/refs`, {
  return fetch(`https://api.github.com/repos/${hook}/git/refs/heads/${branch}`, {
    method: 'GET',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return { refSHA: data.object.sha, ref: data.ref };
      // return { refSHA: data[0].object.sha, ref: data[0].ref };
    });
}

/** create a Blob
 * @see https://docs.github.com/en/rest/reference/git#create-a-blob
 * @param {string} hook - github repository
 * @param {string} token - github token
 * @param {string} content - the content on base64 to add the repository
 * @param {string} path - the path to add the repository
 * @return {Promise} - the promise for the tree_item object
 */
async function createBlob(hook, token, content, path) {
  return fetch(`https://api.github.com/repos/${hook}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: b64EncodeUnicode(content), encoding: 'base64' }),
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'content-type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return { path, sha: data.sha, mode: '100644', type: 'blob' };
    });
}

/** create a new tree in git
 * @see https://docs.github.com/en/rest/reference/git#create-a-tree
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @param {object} tree_items - the tree items
 * @param {string} refSHA - the root sha of the tree
 * @return {Promise} - the promise for the tree sha
 */
async function createTree(hook, token, refSHA, tree_items) {
  return fetch(`https://api.github.com/repos/${hook}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ tree: tree_items, base_tree: refSHA }),
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'content-type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.sha;
    });
}

/** create a commit in git
 * @see https://docs.github.com/en/rest/reference/git#create-a-commit
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @param {string} message - the commit message
 * @param {string} treeSHA - the tree sha
 * @param {string} refSHA - the parent sha
 * @return {Promise} - the promise for the commit sha
 */
async function createCommit(hook, token, message, treeSHA, refSHA) {
  return fetch(`https://api.github.com/repos/${hook}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeSHA, parents: [refSHA] }),
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'content-type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.sha;
    });
}

/** update a ref
 * @see https://docs.github.com/en/rest/reference/git#update-a-reference
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @param {string} ref - the ref to update
 * @param {string} commitSHA - the commit sha
 * @param {boolean} force - force update
 * @return {Promise} - the promise for the http request
 */
async function updateHead(hook, token, ref, commitSHA, force = true) {
  return fetch(`https://api.github.com/repos/${hook}/git/${ref}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commitSHA, force }),
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'content-type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.sha;
    });
}


/** 리포지토리의 디렉토리들을 가져오는 메소드
 * @see https://docs.github.com/en/rest/reference/git#get-a-reference
 * @param {string} hook - github repository(리포지토리)
 * @param {string} token - 토큰
 * @param {string} path - 하위 폴더의 경로
 * @param {Directory} repo - 디렉토리를 저장할 객체(JSON 형식)
 */
async function getRepoDirectory(hook, token, path, repo, branch = 'main') {
  //`https://api.github.com/repos/${owner}/${repositry}/contents/{subdir}/{subdir}?ref=master`
  if(path == undefined || path == null) return;

  return await fetch(`https://api.github.com/repos/${hook}/contents/${path}`, {
    method: 'GET',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => res.json())
    .then((res) => {
      var cnt = 0;
      res.forEach(e =>{
        if(e.type == 'dir') cnt++;
      });

      if(cnt >= 10) return null;
      else return res;
    })
    .then((data) => {
      if(data == null) {
        console.log('하위 폴더가 10개 이상인 폴더는 조회가 불가능합니다.');
        return;
      }

      data.forEach(async e => {
        if(e.length > 10) return;
        if(e.type == 'dir') {
          const dir = new Directory(e.path, new Array());
          getRepoDirectory(hook, token, dir.path, dir);

          repo.subDir.push(dir);
        }
      });
    })
    .catch((error) => console.log(error));
}

/** 폴더 트리를 가져오는 함수
 * @see https://docs.github.com/en/rest/reference/git#get-a-tree
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @return {Promise} - the promise for the tree items
 */
async function getTree(hook, token) {
  return fetch(`https://api.github.com/repos/${hook}/git/trees/HEAD?recursive=1}`, {
    method: 'GET',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.tree;
    });
}

/** 폴더 트리를 가져오는 함수
 * @see https://docs.github.com/en/rest/reference/git#get-a-tree
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @return {Promise} - the promise for the tree items
 */
async function getHeadTree(hook, token) {
  return fetch(`https://api.github.com/repos/${hook}/git/trees/HEAD?}`, {
    method: 'GET',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.tree;
    });
}

/** 폴더 트리를 가져오는 함수 (하위 폴더는 가져오지 않음)
 * @see https://docs.github.com/en/rest/reference/git#get-a-tree
 * @param {string} hook - the github repository
 * @param {string} token - the github token
 * @return {Promise} - the promise for the tree items
 */
async function getTreeNoRecursive(hook, token, treeSHA) {
  return fetch(`https://api.github.com/repos/${hook}/git/trees/${treeSHA}`, {
    method: 'GET',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.tree;
    });
}

class Directory {
  constructor(path, subDir) {
    this.path = path;
    this.subDir = subDir;
  }
}