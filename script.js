document.addEventListener("DOMContentLoaded", () => {
    // 1. GNB Menu SPA Routing
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active class toggle for buttons
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Page toggle
            const targetId = btn.getAttribute('data-target');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 2. Micro-degree Inner Tab Routing
    const innerNavBtns = document.querySelectorAll('.inner-nav-btn');
    const innerPages = document.querySelectorAll('.inner-page');

    innerNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            // If data-target doesn't exist, this button is not for routing. Just return.
            if (!targetId) return;

            innerNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            innerPages.forEach(page => page.classList.remove('active'));
            const targetEl = document.getElementById(targetId);
            if(targetEl) targetEl.classList.add('active');
        });
    });

    // 3. Chart.js Radar Chart Setup
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        const neonBlue = 'rgba(0, 243, 255, 1)';
        const neonBlueDim = 'rgba(0, 243, 255, 0.2)';
        
        new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: [
                    '파이썬 (4.5)', 
                    '로봇공학기초 (4.5)', 
                    '아두이노 (4.0)', 
                    '창의적공학설계 (4.0)', 
                    'CAD기초 (4.0)',
                    '전자회로 (4.0)',
                    '진로설계 (4.0)',
                    '영어미디어 (4.0)'
                ],
                datasets: [{
                    label: '학점',
                    data: [4.5, 4.5, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0],
                    backgroundColor: neonBlueDim,
                    borderColor: neonBlue,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: neonBlue,
                    pointHoverBackgroundColor: neonBlue,
                    pointHoverBorderColor: '#fff',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#e0e6ed',
                            font: { family: "'Noto Sans KR', sans-serif", size: 12, weight: 'bold' }
                        },
                        min: 0,
                        max: 4.5,
                        ticks: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.4)',
                            backdropColor: 'transparent',
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 50, 100, 0.9)',
                        titleColor: neonBlue,
                        titleFont: { family: "'Orbitron', sans-serif", size: 14 },
                        bodyColor: '#fff',
                        bodyFont: { family: "'Noto Sans KR', sans-serif" },
                        borderColor: neonBlue,
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                }
            }
        });
    }

    // 4. Modal Image Gallery
    const artifacts = document.querySelectorAll('.artifact');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('expandedImg');
    const closeBtn = document.querySelector('.close-modal');

    artifacts.forEach(artifact => {
        artifact.addEventListener('click', () => {
            const imgSrc = artifact.getAttribute('data-img');
            modal.style.display = 'block';
            modalImg.src = imgSrc;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 5. Board (Guestbook) Logic using localStorage
    const boardForm = document.getElementById('boardForm');
    const boardListEl = document.getElementById('boardList');
    const boardIdInput = document.getElementById('boardId');
    const boardNameInput = document.getElementById('boardName');
    const boardPasswordInput = document.getElementById('boardPassword');
    const boardContentInput = document.getElementById('boardContent');
    const boardSubmitBtn = document.getElementById('boardSubmitBtn');
    const boardCancelBtn = document.getElementById('boardCancelBtn');
    const boardFormContainer = document.getElementById('boardFormContainer');
    const openWriteFormBtn = document.getElementById('openWriteFormBtn');
    const goHomeBtn = document.getElementById('goHomeBtn');

    let boardData = JSON.parse(localStorage.getItem('amk_portfolio_board')) || [];

    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            document.querySelector('.nav-btn[data-target="home"]').click();
        });
    }

    if (openWriteFormBtn) {
        openWriteFormBtn.addEventListener('click', () => {
            const isHidden = window.getComputedStyle(boardFormContainer).display === 'none';
            if (isHidden) {
                boardFormContainer.style.display = 'block';
                resetForm();
                boardFormContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                boardFormContainer.style.display = 'none';
            }
        });
    }

    const contactBtn = document.getElementById('contactBtn');
    const contactContainer = document.getElementById('contactContainer');

    if (contactBtn && contactContainer) {
        contactBtn.addEventListener('click', () => {
            const isHidden = window.getComputedStyle(contactContainer).display === 'none';
            if (isHidden) {
                contactContainer.style.display = 'block';
                contactContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                contactContainer.style.display = 'none';
            }
        });
    }

    function renderBoard() {
        boardListEl.innerHTML = '';
        if (boardData.length === 0) {
            boardListEl.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">등록된 방명록이 없습니다. 첫 글을 남겨주세요!</div>';
            return;
        }

        boardData.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'board-item';
            div.innerHTML = `
                <div class="board-item-header">
                    <span class="board-item-author"><i class="fas fa-user-circle"></i> ${item.name}</span>
                    <span class="board-item-date">${item.date}</span>
                </div>
                <div class="board-item-content">${item.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                <div class="board-item-actions">
                    <button class="board-btn" onclick="editBoardItem(${item.id})">수정</button>
                    <button class="board-btn" onclick="deleteBoardItem(${item.id})">삭제</button>
                </div>
            `;
            boardListEl.appendChild(div);
        });
    }

    if (boardForm) {
        boardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = boardIdInput.value;
            const name = boardNameInput.value.trim();
            const password = boardPasswordInput.value.trim();
            const content = boardContentInput.value.trim();

            if (!name || !password || !content) return;

            if (id) {
                // Edit existing
                const itemIndex = boardData.findIndex(b => b.id == id);
                if (itemIndex > -1) {
                    if (boardData[itemIndex].password === password) {
                        boardData[itemIndex].name = name;
                        boardData[itemIndex].content = content;
                        boardData[itemIndex].date = new Date().toLocaleString();
                        alert('수정되었습니다.');
                        resetForm();
                    } else {
                        alert('비밀번호가 일치하지 않습니다.');
                    }
                }
            } else {
                // Create new
                const newItem = {
                    id: Date.now(),
                    name,
                    password,
                    content,
                    date: new Date().toLocaleString()
                };
                // Add to top
                boardData.unshift(newItem);
                resetForm();
            }

            saveBoard();
            boardFormContainer.style.display = 'none';
            document.getElementById('board').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (boardCancelBtn) {
        boardCancelBtn.addEventListener('click', () => {
            resetForm();
            boardFormContainer.style.display = 'none';
        });
    }

    window.editBoardItem = function(id) {
        const item = boardData.find(b => b.id == id);
        if (item) {
            const pwd = prompt("수정하려면 등록할 때 입력한 비밀번호를 입력해주세요.");
            if (pwd === item.password) {
                boardIdInput.value = item.id;
                boardNameInput.value = item.name;
                boardPasswordInput.value = "";
                boardContentInput.value = item.content;
                boardSubmitBtn.textContent = "수정 완료";
                boardCancelBtn.style.display = "inline-block";
                boardFormContainer.style.display = "block";
                
                // Scroll to form
                boardFormContainer.scrollIntoView({ behavior: 'smooth' });
            } else if (pwd !== null) {
                alert("비밀번호가 일치하지 않습니다.");
            }
        }
    };

    window.deleteBoardItem = function(id) {
        const itemIndex = boardData.findIndex(b => b.id == id);
        if (itemIndex > -1) {
            const pwd = prompt("삭제하려면 등록할 때 입력한 비밀번호를 입력해주세요.");
            if (pwd === boardData[itemIndex].password) {
                if (confirm('정말로 삭제하시겠습니까?')) {
                    boardData.splice(itemIndex, 1);
                    saveBoard();
                    alert('삭제되었습니다.');
                }
            } else if (pwd !== null) {
                alert("비밀번호가 일치하지 않습니다.");
            }
        }
    };

    function resetForm() {
        boardIdInput.value = '';
        boardNameInput.value = '';
        boardPasswordInput.value = '';
        boardContentInput.value = '';
        boardSubmitBtn.textContent = "등록 완료";
        boardCancelBtn.style.display = "inline-block";
    }

    function saveBoard() {
        localStorage.setItem('amk_portfolio_board', JSON.stringify(boardData));
        renderBoard();
    }

    const readMoreBtnA = document.getElementById('readMoreBtnA');
    const projectAContent = document.getElementById('projectAContent');
    const projectAFade = document.getElementById('projectAFade');

    if (readMoreBtnA && projectAContent && projectAFade) {
        let isExpanded = false;
        readMoreBtnA.addEventListener('click', () => {
            if (!isExpanded) {
                projectAContent.style.maxHeight = '1500px'; 
                projectAFade.style.opacity = '0';
                readMoreBtnA.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
                isExpanded = true;
            } else {
                projectAContent.style.maxHeight = '280px';
                projectAFade.style.opacity = '1';
                readMoreBtnA.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
                isExpanded = false;
            }
        });
    }

    // Initial render
    if(boardListEl) renderBoard();
});
