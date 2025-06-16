window.onload = function () {
    let box = document.querySelector('.box');
    box.style.left = '366px';
    box.style.top = '300px';
};

let box = document.querySelector('.box');
let map = document.getElementById('map');
let step = 50;

document.addEventListener('keydown', (e) => {
    let currentLeft = box.offsetLeft;
    let currentTop = box.offsetTop;
    let canMove = true;
    let currentDirection = box.dataset.direction || 'down';

    if (e.key === 'ArrowLeft') {
        currentDirection = 'left';
        if (currentLeft - step >= 0) 
            box.style.left = (currentLeft - step) + 'px';
        else 
            canMove = false;
        }
    else if (e.key === 'ArrowRight') {
        currentDirection = 'right';
        if (currentLeft + step + box.offsetWidth <= map.offsetWidth) 
            box.style.left = (currentLeft + step) + 'px';
        else 
            canMove = false;
        }
    else if (e.key === 'ArrowUp') {
        currentDirection = 'up';
        if (currentTop - step >= 0) 
            box.style.top = (currentTop - step) + 'px';
        else 
            canMove = false;
        }
    else if (e.key === 'ArrowDown') {
        currentDirection = 'down';
        if (currentTop + step + box.offsetHeight <= map.offsetHeight) 
            box.style.top = (currentTop + step) + 'px';
        else 
            canMove = false;
        }
    else {
        return;
    }

    box.dataset.direction = currentDirection;
    box.dataset.walking = true;
    if (!canMove) 
        box.dataset.walking = false;
    
    // 중앙 좌표 계산해서 문 영역 진입 체크
    let boxCenterX = box.offsetLeft + box.offsetWidth / 2;
    let boxCenterY = box.offsetTop + box.offsetHeight / 2;
    checkForTransition(boxCenterX, boxCenterY);
});

document.addEventListener('keyup', () => {
    box.dataset.walking = false;
});

document.addEventListener("DOMContentLoaded", function () {
    var dialogArea = document.getElementById("dialog_area");
    var dialogText = document.getElementById("dialog_text");

    // 대화 리스트
    var dialogs = [
        "창밖의 빛이 오늘따라 더 따스하게 느껴진다.",
        "처음엔 매일이 무거웠지만,",
        "",
        "조금씩, 아주 조금씩, 마음에 변화가 생긴 것 같아.",
        "실패해도 괜찮다는 걸,",
        "넘어져도 다시 일어날 수 있다는 걸",
        "이젠 나 자신에게도 말해줄 수 있다.",
        "",
        "누군가의 응원, 나의 작은 성취들이",
        "내 안에 작지만 소중한 희망을 만들어줬다.",
        "예전의 나는 혼자라고 느꼈지만,",
        "이젠 나를 믿어주는 사람들이 떠오르고,",
        "나도 내 힘을 조금은 믿게 되었다.",
        "",
        "완벽하지 않아도, 천천히 가도 괜찮아.",
        "오늘 하루를 살아낸 나를 칭찬해주고 싶다.",
        "이제, 내일로 한 걸음 더 나아가볼게."
    ];
    var dialogIndex = 0;

    function showDialog() {
        const dialogText = document.getElementById('dialog_text');
        if (dialogIndex < dialogs.length) {
            dialogText.textContent = dialogs[dialogIndex];
        } else {
            // 모든 대사 다 읽으면 ending.html로 이동
            window.location.href = 'ending.html';
        }
    }

    // 대화창 처음에는 숨기기
    dialogArea.style.display = "none";
    dialogText.style.display = "none";

    // 1초 뒤 대화창 보여주기
    setTimeout(function () {
        dialogArea.style.display = "block";
        dialogText.style.display = "block";
        dialogText.innerText = dialogs[dialogIndex];
        dialogIndex++;
    }, 1000);

    // 스페이스바/엔터로 대화 진행
    document.addEventListener("keydown", function (event) {
        // 대화창이 보일 때만
        if (dialogArea.style.display !== "block") 
            return;
        if (event.key === " " || event.key === "Enter") {
            displayNextDialog();
        }
    });

    // (대화창이 다 넘어가도 엔딩 html로 이동되지 않자 gpt가 추가해준 스크립트)
    function displayNextDialog() {
        if (dialogIndex < dialogs.length) {
            dialogText.innerText = dialogs[dialogIndex];
            dialogIndex++;
        } else if (dialogIndex === dialogs.length) {
            dialogArea.style.display = "none";
            dialogText.style.display = "none";
            // 모든 대사가 끝나면 ending.html로 이동
            setTimeout(function () {
                window.location.href = 'ending.html';
            }, 700); // 0.7초 후 이동 
        }
    }

});
