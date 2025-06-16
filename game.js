const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 게임 영역 설정
const GAME_WIDTH = 900;
const GAME_HEIGHT = 680;
canvas.width = GAME_WIDTH + 80;
canvas.height = GAME_HEIGHT + 80;
const offsetX = (canvas.width - GAME_WIDTH) / 2;
const offsetY = (canvas.height - GAME_HEIGHT) / 2;

// 상태 머신 정의
const State = {
    PROLOGUE: 'PROLOGUE',
    PLAY: 'PLAY',
    CLIMAX: 'CLIMAX',
    ENDING: 'ENDING'
};

let state = State.PLAY;

// 델타 타임 관리
let lastTime = 0;

// 전역 게임 변수
let timer = 0;
let speedFactor = 1;

// 스폰 타이머
let negSpawnTimer = 0;
let recSpawnTimer = 0;

// 게임 상태 UI 초기값
let score = 0;
let hope = 0;
let fear = 0;

// 리소스 로더
const imageSources = {
    characterNormal: './img/12.png',
    characterHit: './img/hit.png',
    bg: './img/bg_gamearea.jpg',
    RejectionMail: './img/Rejection_Mail.png',
    WarmNote: './img/Warm_Note.png',
    WindowOfLight: './img/WindowOfLight.png', // ← 슬래시 주의!
    ShatteredScheduler: './img/ShatteredScheduler.png',
    ReadyPortfolio: './img/ReadyPortfolio.png',
    NaggingAlarm: './img/NaggingAlarm.png',
    TangledCV: './img/TangledCV.png',
    RestartButton: './img/RestartButton.png',
    StickerOfSuccess: './img/StickerOfSuccess.png',
    BlankApplication: './img/BlankApplication.png'
};
const images = {};
function loadImages(sources) {
    const promises = [];
    for (const key in sources) {
        promises.push(new Promise(resolve => {
            const img = new Image();
            img.src = sources[key];
            img.onload = () => {
                images[key] = img;
                resolve();
            };
        }));
    }
    return Promise.all(promises);
}

// UI 업데이트
function updateUI() {
    document
        .getElementById('score')
        .textContent = score;
    document
        .getElementById('hope')
        .textContent = hope;
    document
        .getElementById('fear')
        .textContent = fear;
}

// 플레이어
const player = {
    x: 10,
    y: 200,
  width: 80,  
  height: 80,
    sprite: null,
    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
};

// 레인 목록
const lanes = [100, 200, 300, 400, 500, 570];

// 플레이어 레인 이동 로직
let playerLane = 1;

document.addEventListener('keydown', e => {
    // 잠금 효과가 있을 때만 입력 완전 무시
    if (inputLocked) 
        return;
    
    // 반전 효과(키 맵만 뒤집기)
    let upKey = 'ArrowUp',
        downKey = 'ArrowDown';
    if (invertControls) 
        [upKey, downKey] = [downKey, upKey];
    
    if (e.code === upKey && playerLane > 0) 
        playerLane--;
    if (e.code === downKey && playerLane < lanes.length - 1) 
        playerLane++;
    player.y = lanes[playerLane];
});

// 랜덤 아이템 스폰을 위한 아이템 리스트화 부정 아이템 5종
const negativeTypes = ['RejectionMail', 'BlankApplication', 'NaggingAlarm', 'TangledCV', 'ShatteredScheduler'];

// 긍정 아이템 5종
const recoveryTypes = ['WarmNote', 'WindowOfLight', 'ReadyPortfolio', 'RestartButton', 'StickerOfSuccess'];

// 랜덤 선택 함수
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 아이템 클래스
class Negative {
    constructor(type) {
        this.type = type;
        this.x = GAME_WIDTH;
        this.y = lanes[Math.floor(Math.random() * lanes.length)]; // lane마다 랜덤처리
    this.width = 70; 
    this.height = 70;
        this.speed = 100; // px/sec
    }
    update(dt) {
        this.x -= this.speed * dt * speedFactor;
    }
    draw() {
        ctx.drawImage(images[this.type], this.x, this.y, this.width, this.height);
    }
}
class Recovery {
    constructor(type) {
        this.type = type;
        this.x = GAME_WIDTH;
        this.y = lanes[Math.floor(Math.random() * lanes.length)];
        this.width = 100;
        this.height = 100;
        this.speed = 80;
    }
    update(dt) {
        this.x -= this.speed * dt * speedFactor;
    }
    draw() {
        ctx.drawImage(images[this.type], this.x, this.y, this.width, this.height);
    }
}

// 아이템 저장소
const negativeItems = [];
const recoveryItems = [];

// 파티클 효과(gpt 도움)
let particles = [];

// 키보드 반대 효과
let invertControls = false;
// 키보드 잠금 효과
let inputLocked = false;

// 메인 업데이트 함수
function update(dt) {
    if (state === State.PLAY) {
        timer += dt;

        negativeItems.forEach((item, i) => {
            item.update(dt);
            if (item.x + item.width < 0) 
                negativeItems.splice(i, 1);
            else 
                checkCollision(item, 'neg');
            }
        );
        recoveryItems.forEach((item, i) => {
            item.update(dt);
            if (item.x + item.width < 0) 
                recoveryItems.splice(i, 1);
            else 
                checkCollision(item, 'rec');
            }
        );
        spawnItems(dt); // 아이템이 중복으로 스폰되어서 gpt가 수정해줌

        // 3분 후 엔딩 페이지로 이동
if (timer >= 180) {
    window.location.href = 'ending-room.html';
    return;
}
    }
}

// 메인 그리기 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 배경 그리기
ctx.save();
ctx.translate(offsetX, offsetY);
ctx.drawImage(images.bg, 0, 0, images.bg.width, images.bg.height, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.restore();
    // 아이템 그리기
    ctx.save();
    ctx.translate(offsetX, 0);
    negativeItems.forEach(item => item.draw());
    recoveryItems.forEach(item => item.draw());
    player.draw();
    drawSimpleParticles(ctx) // 파티클 효과 추가(gpt 도움)
    ctx.restore();
}

// 스폰 로직 (아이템이 중복된 위치에서 스폰되어서 프레임 단위로 “이미 해당 아이템을 스폰했는지” 체크하는 플래그/타이머를 추가 로 gtp가
// 추가해줌)
function spawnItems(dt) {
    negSpawnTimer += dt;
    recSpawnTimer += dt;
    if (negSpawnTimer >= 3) { // 1초마다 부정 아이템
        negSpawnTimer -= 3;
        const negType = pickRandom(negativeTypes);
        negativeItems.push(new Negative(negType));
    }
    if (recSpawnTimer >= 3) { // 1초마다 긍정 아이템
        recSpawnTimer -= 3;
        const recType = pickRandom(recoveryTypes);
        recoveryItems.push(new Recovery(recType));
    }
}

// 충돌 헬퍼(isColliding)로 가독성·재사용성 향상, 중복 제거 (gpt가 개선 할 수 있는 포인트로 추가해줌)
function isColliding(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// 충돌 처리
function checkCollision(item, kind) {
    if (isColliding(item, player)) {
        if (kind === 'neg') 
            handleNegative(item);
        else 
            handleRecovery(item);
        }
    }

function handleNegative(item) {
    console.log('item.type:', item.type); // 디버깅
    const idx = negativeItems.indexOf(item);
    negativeItems.splice(idx, 1);
    player.sprite = images.characterHit;
    setTimeout(() => player.sprite = images.characterNormal, 200);

    // 각 아이콘 마다 효과
    switch (item.type) {
        case 'RejectionMail':
            fear += 1; // 불안 증가!
            updateUI();
            showPopup('불합격 통보 메일', '또 떨어졌네...나만 뒤쳐지고 있어', '전체 속도 20% 감소', '.popup-positive');
            showScreenEffect('dark', 500);
            {
                const prevSpeed = speedFactor;
                speedFactor *= 0.8;
                setTimeout(() => speedFactor = prevSpeed, 2000);
            }
            break;

        case 'BlankApplication':
            fear += 1; 
            score = Math.max(0, score - 1);
            updateUI();
            showPopup('빈 지원서 원고', '괜찮을까?', '점수 -1, 불안감 증가', '.popup-neutral');
            showScreenEffect('blur', 4000);
            break;

        case 'NaggingAlarm':
            if (inputLocked) break;
            fear += 1; 
            inputLocked = true;
            showPopup('울리는 알람 시계', '조급함에 혼란이…', '1.5초간 키 입력 무력화', '.popup-negative');
            showScreenEffect('flash', 1500);
            setTimeout(() => inputLocked = false, 1500);
            break;

        case 'TangledCV':
            if (invertControls) break;
            fear += 1; 
            invertControls = true;
            showPopup('뒤엉킨 이력서', '방향이 뒤바뀌었어!', '2초간 방향키 반전', '.popup-negative');
            setTimeout(() => invertControls = false, 2000);
            break;

        case 'ShatteredScheduler':
            fear += 1; // 추가!
            showPopup('흩어진 스케줄러', '계획이 엉켜버렸어..혼란스러워', '아이템 속도 증가', '.popup-negative');
            showScreenEffect('flash', 500);
            const prevSpeed = speedFactor;
            speedFactor *= 1.5;
            setTimeout(() => speedFactor = prevSpeed, 500);
            break;
    }
}

// 긍정 회복 아이템
function handleRecovery(item) {
    console.log('item.type:', item.type); // 디버깅
    const idx = recoveryItems.indexOf(item);
    recoveryItems.splice(idx, 1);

    // 각 아이콘 마다 효과
    switch (item.type) {
        case 'WarmNote':
            score += 10;
            hope += 1;
            updateUI();
            showPopup('친구의 응원 메시지', '마음이 가벼워진다!', '전체 속도 15% 증가', '.popup-positive');
            showScreenEffect('bright', 500);
            {
                const prevSpeed = speedFactor;
                speedFactor *= 1.15;
                setTimeout(() => speedFactor = prevSpeed, 500);
            }
            break;

        case 'ReadyPortfolio':
            hope += 1;
            updateUI();
            showPopup('완성된 포트폴리오', '노력의 결실!', '희망 게이지 +1', '.popup-positive');
            showScreenEffect('shine', 500);
            break;

        case 'StickerOfSuccess':
            score += 2;
            updateUI();
            showPopup('성공 스티커', '수고했어!', '점수 +2', '#fff');
            spawnSimpleParticles(player.x + player.width / 2, player.y + player.height / 2);
            break;

        case 'RestartButton':
            hope = Math.max(hope, 5);
            fear = Math.max(0, fear - 3);
            updateUI();
            showPopup('다시 시작 버튼', '새롭게 다시 시작!', '희망 회복', '.popup-info');
            showScreenEffect('sunrise', 800);
            break;

case 'WindowOfLight':
  hope += 1;
  updateUI();
  showPopup('햇살 핀 창문', '햇살이 마음을 비춘다!', '모든 어두운 효과 해제, 희망 +1', '.popup-hope');
  showScreenEffect('bright', 800);
  break;
    }

}

// 팝업 텍스트
function showPopup(itemName, ment, effectText, themeClass = 'popup-neutral') {
    const pop = document.createElement('div');
    pop.className = 'popup ' + themeClass;

    pop.innerHTML = `
      <div class="popup-title">${itemName}</div>
      <div class="popup-ment">${ment}</div>
      <div class="popup-effect">${effectText}</div>
    `;

    document.getElementById('popups').appendChild(pop);
    pop.addEventListener('animationend', () => pop.remove());
}

// 아이템 충돌 시 나타나는 효과 어두워지는 효과
function showScreenEffect(effect, duration = 500) {
    const effectDiv = document.getElementById('screenEffect');
    effectDiv.className = ''; // 기존 효과 리셋
    void effectDiv.offsetWidth; // 강제 리플로우(중첩 효과 방지(gpt가 넣는게 좋다고 해서 넣음))
    effectDiv
        .classList
        .add(effect);

    setTimeout(() => {
        effectDiv
            .classList
            .remove(effect);
    }, duration);
}

// 혼란 효과
function doShatteredScheduler() {
    showPopup('흩어진 스케줄러', '계획이 엉켜버렸어..혼란스러워', '아이템/장애물 속도 증가', '#f33');
    showScreenEffect('flash', 500);
    const prevSpeed = speedFactor;
    speedFactor *= 1.5;
    setTimeout(() => speedFactor = prevSpeed, 500);
}

//회복 밝아지는 효과
function doWindowOfLight() {
    hope += 1;
    updateUI();
    showPopup('햇살이 마음을 비춘다!', '#ffe066');

    const effectDiv = document.getElementById('screenEffect');
    effectDiv.className = ''; // 모든 효과 해제

    showScreenEffect('bright', 800); // 밝아짐 효과 0.8초간
}

// 파티클 효과 (gpt 도움)
function spawnSimpleParticles(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count;
        const speed = 2 + Math.random() * 1.5;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 4 + Math.random() * 2,
            color: 'rgba(255, 224, 102, 0.85)', // 밝은 노랑
            life: 32 + Math.floor(Math.random() * 10),
            alpha: 1
        });
    }
}

// 파티클 그리기 효과(gpt 도움)
function drawSimpleParticles(ctx) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#fffde6';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();

        // 움직임
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // 아래로 가볍게 가라앉음
        p.life--;
        if (p.life < 12) 
            p.alpha = p.life / 12; // 점점 사라짐
        
        // 수명 끝나면 삭제
        if (p.life <= 0) 
            particles.splice(i, 1);
        }
    }

// 리셋 및 메인 루프
function startGame() {
    score = 0;
    hope = 0;
    fear = 0;
    updateUI();
    player.sprite = images.characterNormal;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);;
}
function gameLoop(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    console.log("dt", dt);
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}

// 이미지 로드 후 게임 시작 (새로고침 후 이미지가 안 보이자 gtp가 추가 해준 문장)
loadImages(imageSources).then(startGame);

// 참고 스크립트 출처 https://blog.naver.com/ssona5074/222507191917


