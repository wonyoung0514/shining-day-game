window.onload = function() {
    let box = document.querySelector('.box');
    box.style.left = '116px';  
    box.style.top =  '250px'; 
};

let box = document.querySelector('.box');
let map = document.getElementById('map');
let step = 50;


document.addEventListener('keydown', (e) => {
    let currentLeft = box.offsetLeft;
    let currentTop  = box.offsetTop;
    let canMove = true;
    let currentDirection = box.dataset.direction || 'down';

    if (e.key === 'ArrowLeft') {
        currentDirection = 'left';
        if (currentLeft - step >= 0) box.style.left = (currentLeft - step) + 'px';
        else canMove = false;
    } else if (e.key === 'ArrowRight') {
        currentDirection = 'right';
        if (currentLeft + step + box.offsetWidth <= map.offsetWidth) box.style.left = (currentLeft + step) + 'px';
        else canMove = false;
    } else if (e.key === 'ArrowUp') {
        currentDirection = 'up';
        if (currentTop - step >= 0) box.style.top = (currentTop - step) + 'px';
        else canMove = false;
    } else if (e.key === 'ArrowDown') {
        currentDirection = 'down';
        if (currentTop + step + box.offsetHeight <= map.offsetHeight) box.style.top = (currentTop + step) + 'px';
        else canMove = false;
    } else {
        return;
    }

    box.dataset.direction = currentDirection;
    box.dataset.walking = true;
    if (!canMove) box.dataset.walking = false;

    // **중앙 좌표 계산해서 문 영역 진입 체크**
    let boxCenterX = box.offsetLeft + box.offsetWidth / 2;
    let boxCenterY = box.offsetTop + box.offsetHeight / 2;
    checkForTransition(boxCenterX, boxCenterY);
});


document.addEventListener('keyup', () => {
    box.dataset.walking = false;
});


document.addEventListener("DOMContentLoaded", function() {
    var dialogArea = document.getElementById("dialog_area");
    var dialogText = document.getElementById("dialog_text");

    // 대화 리스트
    var dialogs = [
        "햇살이 눈부셔서 눈이 잘 안 떠진다.",
        "…오늘도 시작이네.",
        "",
        "시계는 한참을 지나있고,",
        "나는 또 침대에서 뒤척이고 있었어.",
        "요즘 왜 이렇게 힘이 없지…",
        "",
        "다른 사람들은 모두 부지런하게 살아가는데,",
        "나만 혼자 뒤처지고 있는 것 같아.",
        "괜히 더 우울해진다.",
        "",
        "그래도… 오늘은 방에서 한 걸음 나가볼까.",
        "(방향키로 문까지 이동해 보자)"
    ];
    var dialogIndex = 0;

    // 대화창 처음에는 숨기기
    dialogArea.style.display = "none";
    dialogText.style.display = "none";

    // 1초 뒤 대화창 보여주기
    setTimeout(function() {
        dialogArea.style.display = "block";
        dialogText.style.display = "block";
        dialogText.innerText = dialogs[dialogIndex];
        dialogIndex++;
    }, 1000);

    // 스페이스바/엔터로 대화 진행
    document.addEventListener("keydown", function(event) {
        // 대화창이 보일 때만
        if (dialogArea.style.display !== "block") return;
        if (event.key === " " || event.key === "Enter") {
            displayNextDialog();
        }
    });

    function displayNextDialog() {
        if (dialogIndex < dialogs.length) {
            dialogText.innerText = dialogs[dialogIndex];
            dialogIndex++;
        } else if (dialogIndex === dialogs.length) {
            dialogArea.style.display = "none";
            dialogText.style.display = "none";
        }
    }
});


function checkForTransition(x, y) {
    // 문(door) 중앙 좌표 (화면에서 문이 있는 위치 기준)
    // 문 중앙: left=~433px, top=484px(예시) ※ 직접 픽셀값 조정해보세요!
    const CENTER_X = 433;
    const CENTER_Y = 484;
    const MARGIN   = 40; // 허용 범위

    const minX = CENTER_X - MARGIN;
    const maxX = CENTER_X + MARGIN;
    const minY = CENTER_Y - MARGIN;
    const maxY = CENTER_Y + MARGIN;

    // box의 중심이 문 중심 영역에 들어가면
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        window.location.href = "index.html";
    }
}

// 이미지 출처 https://cupnooble.itch.io/sprout-lands-asset-pack