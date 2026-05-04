// firebase-config.js에서 생성한 db 객체를 그대로 사용합니다.
// (Compat 버전이므로 전역 변수로 접근 가능)

// DOM 요소
const viewList = document.getElementById('view-list');
const viewWrite = document.getElementById('view-write');
const viewDetail = document.getElementById('view-detail');
const btnShowWrite = document.getElementById('btn-show-write');
const headerActions = document.getElementById('board-header-actions');

// 목록 관련
const postListBody = document.getElementById('post-list-body');

// 폼 관련
const postForm = document.getElementById('post-form');
const btnCancelWrite = document.getElementById('btn-cancel-write');

// 상세조회 관련
let currentPostId = null;
let currentPostData = null;

// 모달 관련
const pwdModal = document.getElementById('pwd-modal');
const modalPwdInput = document.getElementById('modal-pwd-input');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalConfirm = document.getElementById('btn-modal-confirm');
let modalActionCallback = null;

// 화면 전환 함수
function showView(viewName) {
    viewList.classList.add('hidden');
    viewWrite.classList.add('hidden');
    viewDetail.classList.add('hidden');
    headerActions.classList.add('hidden');

    if (viewName === 'list') {
        viewList.classList.remove('hidden');
        headerActions.classList.remove('hidden');
        loadPosts();
    } else if (viewName === 'write') {
        viewWrite.classList.remove('hidden');
    } else if (viewName === 'detail') {
        viewDetail.classList.remove('hidden');
    }
}

// 1. 게시글 목록 불러오기 (Read)
async function loadPosts() {
    postListBody.innerHTML = '<tr><td colspan="3">로딩 중...</td></tr>';
    try {
        const querySnapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
        
        postListBody.innerHTML = '';
        if (querySnapshot.empty) {
            postListBody.innerHTML = '<tr><td colspan="3">게시글이 없습니다.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : '';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="title-cell" data-id="${doc.id}">${data.title}</td>
                <td>${data.author}</td>
                <td>${dateStr}</td>
            `;
            postListBody.appendChild(tr);
        });

        document.querySelectorAll('.title-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                showPostDetail(e.target.dataset.id);
            });
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        postListBody.innerHTML = '<tr><td colspan="3" style="color:red;">데이터베이스 연결 오류! 파이어베이스 콘솔의 Firestore 설정을 확인하세요.</td></tr>';
    }
}

// 2. 글쓰기/수정 (Create & Update)
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-post-id').value;
    const title = document.getElementById('post-title').value;
    const author = document.getElementById('post-author').value;
    const password = document.getElementById('post-password').value;
    const content = document.getElementById('post-content').value;

    try {
        if (id) {
            await db.collection("posts").doc(id).update({ title, content, author });
            alert("수정되었습니다.");
            showPostDetail(id);
        } else {
            await db.collection("posts").add({
                title, author, password, content,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("등록되었습니다.");
            showView('list');
        }
    } catch (error) {
        console.error("Error saving post:", error);
        alert("오류가 발생했습니다: " + error.message);
    }
});

// 3. 게시글 상세 조회 (Read)
async function showPostDetail(id) {
    try {
        const docSnap = await db.collection("posts").doc(id).get();
        
        if (docSnap.exists) {
            currentPostId = id;
            currentPostData = docSnap.data();
            
            document.getElementById('detail-title').textContent = currentPostData.title;
            document.getElementById('detail-author').innerHTML = `<i class="fa-solid fa-user"></i> ${currentPostData.author}`;
            const dateStr = currentPostData.createdAt ? currentPostData.createdAt.toDate().toLocaleString() : '';
            document.getElementById('detail-date').innerHTML = `<i class="fa-regular fa-clock"></i> ${dateStr}`;
            document.getElementById('detail-content').textContent = currentPostData.content;
            
            showView('detail');
            loadComments(id);
        }
    } catch (error) {
        console.error("Error loading post details:", error);
    }
}

// 댓글 로직
async function loadComments(postId) {
    const ul = document.getElementById('comment-list');
    ul.innerHTML = '';
    try {
        const querySnapshot = await db.collection("comments")
            .where("postId", "==", postId)
            .orderBy("createdAt", "asc")
            .get();
        
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleString() : '';
            const li = document.createElement('li');
            li.className = 'comment-item';
            li.innerHTML = `
                <div>
                    <span class="comment-author">${data.author}</span>
                    <span class="comment-date">${dateStr}</span>
                    <div class="comment-text">${data.content}</div>
                </div>
                <button class="comment-delete-btn" data-id="${docSnap.id}" data-pwd="${data.password}">삭제</button>
            `;
            ul.appendChild(li);
        });

        document.querySelectorAll('.comment-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = e.target.dataset.id;
                const correctPwd = e.target.dataset.pwd;
                const inputPwd = prompt("댓글 비밀번호를 입력하세요:");
                if (inputPwd === correctPwd) {
                    db.collection("comments").doc(commentId).delete().then(() => loadComments(postId));
                } else if(inputPwd !== null) {
                    alert("비밀번호가 틀렸습니다.");
                }
            });
        });
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}

document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const author = document.getElementById('comment-author').value;
    const password = document.getElementById('comment-password').value;
    const content = document.getElementById('comment-content').value;

    try {
        await db.collection("comments").add({
            postId: currentPostId,
            author, password, content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('comment-author').value = '';
        document.getElementById('comment-password').value = '';
        document.getElementById('comment-content').value = '';
        loadComments(currentPostId);
    } catch(error) {
        console.error("Error adding comment", error);
    }
});

// 모달 로직
function openPwdModal(action, callback) {
    modalPwdInput.value = '';
    pwdModal.style.display = 'flex';
    document.getElementById('modal-title').textContent = action === 'edit' ? '수정 권한 확인' : '삭제 권한 확인';
    modalActionCallback = callback;
}

btnModalCancel.addEventListener('click', () => { pwdModal.style.display = 'none'; });

btnModalConfirm.addEventListener('click', () => {
    const inputPwd = modalPwdInput.value;
    if (inputPwd === currentPostData.password) {
        pwdModal.style.display = 'none';
        modalActionCallback();
    } else {
        alert("비밀번호가 일치하지 않습니다.");
    }
});

// 버튼 이벤트
btnShowWrite.addEventListener('click', () => {
    postForm.reset();
    document.getElementById('edit-post-id').value = '';
    document.getElementById('post-password').disabled = false;
    showView('write');
});

btnCancelWrite.addEventListener('click', () => showView('list'));
document.getElementById('btn-back-list').addEventListener('click', () => showView('list'));

document.getElementById('btn-edit-post').addEventListener('click', () => {
    openPwdModal('edit', () => {
        document.getElementById('edit-post-id').value = currentPostId;
        document.getElementById('post-title').value = currentPostData.title;
        document.getElementById('post-author').value = currentPostData.author;
        document.getElementById('post-password').value = currentPostData.password;
        document.getElementById('post-password').disabled = true;
        document.getElementById('post-content').value = currentPostData.content;
        showView('write');
    });
});

document.getElementById('btn-delete-post').addEventListener('click', () => {
    openPwdModal('delete', async () => {
        if(confirm("정말로 삭제하시겠습니까?")) {
            try {
                await db.collection("posts").doc(currentPostId).delete();
                const q = await db.collection("comments").where("postId", "==", currentPostId).get();
                q.forEach(doc => doc.ref.delete());
                alert("삭제되었습니다.");
                showView('list');
            } catch (e) { console.error(e); }
        }
    });
});

// 초기 실행
showView('list');
