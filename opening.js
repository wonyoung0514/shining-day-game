window.onload = function() {
  // 파티클 효과 (gtp가 만들어줌)
  const canvas = document.getElementById('openingParticles');
  const ctx = canvas.getContext('2d');
  resizeCanvas();

  let particles = [];
  for(let i=0; i<38; i++) particles.push(makeParticle());

  function makeParticle() {
    const colors = ['#ffe066', '#fffbea', '#b3f6c7', '#e1d8ff', '#AEE6F5'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 13 + Math.random() * 22,
      color: colors[Math.floor(Math.random()*colors.length)],
      a: 0.18 + Math.random()*0.12,
      dx: (Math.random()-0.5) * 0.3,
      dy: 0.04 + Math.random()*0.14,
      drift: (Math.random()-0.5) * 0.11
    };
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let p of particles){
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      p.x += p.dx + p.drift;
      p.y += p.dy;
      if(p.y - p.r > canvas.height) {
        p.y = -p.r;
        p.x = Math.random()*canvas.width;
      }
      if(p.x < -p.r) p.x = canvas.width + p.r;
      if(p.x > canvas.width + p.r) p.x = -p.r;
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', resizeCanvas);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
};

function startGame() {
  window.location.href = 'room.html'; 
}
