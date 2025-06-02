const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const pergunta = "Quer ser meu amor pra sempre?";
const botaoSim = { texto: "Sim 💖", x: 200, y: 300, w: 120, h: 50, cor: "#4CAF50" };
const botaoNao = { texto: "Não 😬", x: 400, y: 300, w: 120, h: 50, cor: "#F44336" };
const botaoProximo = { texto: "Continuar ➡️", x: window.innerWidth / 2 - 60, y: 350, w: 120, h: 50, cor: "#2196F3" };
const botaoFotos = { texto: "Ver nossas fotos 📸", x: window.innerWidth / 2 - 100, y: 320, w: 200, h: 50, cor: "#4CAF50" };

let fase = 1;
let motivoAtual = -1;
let letrasMostradas = 0;
let tempoCartinha;

const fraseCartinha = "Desde o dia que te conheci, minha vida ganhou mais cor, mais paz e muito amor. Você é meu presente todos os dias.";
const motivos = [
  "Seu sorriso ilumina meu dia 😊",
  "Você me faz rir até nos dias difíceis 💫",
  "Você me entende como ninguém 💬",
  "Seu abraço é meu lugar favorito 🤗",
  "A vida com você é muito mais linda ❤️"
];

let coracoes = [];
for (let i = 0; i < 50; i++) coracoes.push(criaCoracao());

function criaCoracao() {
  return {
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + Math.random() * 100,
    size: Math.random() * 10 + 10,
    speed: Math.random() * 1 + 0.5,
    opacity: Math.random() * 0.5 + 0.5
  };
}

function desenhaCoracoes() {
  ctx.save();
  coracoes.forEach(c => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 0, 100, ${c.opacity})`;
    ctx.moveTo(c.x, c.y);
    ctx.arc(c.x - c.size / 2, c.y, c.size / 2, 0, Math.PI * 2);
    ctx.arc(c.x + c.size / 2, c.y, c.size / 2, 0, Math.PI * 2);
    ctx.lineTo(c.x, c.y + c.size);
    ctx.fill();
  });
  ctx.restore();
}

function atualizaCoracoes() {
  coracoes.forEach(c => {
    c.y -= c.speed;
    if (c.y < -20) {
      c.x = Math.random() * window.innerWidth;
      c.y = window.innerHeight + Math.random() * 50;
    }
  });
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenhaCoracoes();
  atualizaCoracoes();
  ctx.textAlign = "center";

  if (fase === 1) {
    ctx.fillStyle = "#000";
    ctx.font = "28px Arial";
    ctx.fillText(pergunta, window.innerWidth / 2, 150);
    desenhaBotao(botaoSim);
    desenhaBotao(botaoNao);
  } else if (fase === 2) {
    ctx.fillStyle = "#e91e63";
    ctx.font = "26px Arial";
    ctx.fillText(motivos[motivoAtual] || "", window.innerWidth / 2, 200);
    if (motivoAtual >= motivos.length - 1) {
      desenhaBotao(botaoProximo);
    }
  } else if (fase === 3) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#333";
    let textoParcial = fraseCartinha.substring(0, letrasMostradas);
    desenhaTextoMultilinha(textoParcial, window.innerWidth / 2, 180, 500);
    if (letrasMostradas >= fraseCartinha.length) {
      desenhaBotao(botaoProximo);
    }
  } else if (fase === 4) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#e91e63";
    ctx.fillText("Feliz Dia dos Namorados! 💘", window.innerWidth / 2, 200);
    ctx.font = "24px Arial";
    ctx.fillText("Te amo mais do que palavras podem dizer.", window.innerWidth / 2, 250);
    desenhaBotao(botaoFotos);
    if (!window.redirecionado) {
      window.redirecionado = true;
      setTimeout(() => {
        window.location.href = "fotos.html";
      }, 10000);
    }
  }

  requestAnimationFrame(desenhar);
}

function desenhaTextoMultilinha(texto, x, y, maxWidth) {
  const palavras = texto.split(" ");
  let linha = "";
  let altura = 30;

  for (let i = 0; i < palavras.length; i++) {
    const linhaTeste = linha + palavras[i] + " ";
    const largura = ctx.measureText(linhaTeste).width;
    if (largura > maxWidth) {
      ctx.fillText(linha, x, y);
      linha = palavras[i] + " ";
      y += altura;
    } else {
      linha = linhaTeste;
    }
  }
  ctx.fillText(linha, x, y);
}

function desenhaBotao(botao) {
  ctx.fillStyle = botao.cor;
  ctx.fillRect(botao.x, botao.y, botao.w, botao.h);
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText(botao.texto, botao.x + botao.w / 2, botao.y + 32);
}

function moverBotaoNao() {
  botaoNao.x = Math.random() * (window.innerWidth - botaoNao.w);
  botaoNao.y = Math.random() * (window.innerHeight - botaoNao.h - 100) + 150;
}

canvas.addEventListener("click", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  if (fase === 1) {
    if (verificaClique(x, y, botaoSim)) iniciarMotivos();
    if (verificaClique(x, y, botaoNao)) moverBotaoNao();
  } else if (fase === 2 && motivoAtual >= motivos.length - 1 && verificaClique(x, y, botaoProximo)) {
    iniciarCartinha();
  } else if (fase === 3 && letrasMostradas >= fraseCartinha.length && verificaClique(x, y, botaoProximo)) {
    fase = 4;
  } else if (fase === 4 && verificaClique(x, y, botaoFotos)) {
    window.location.href = "fotos.html";
  }
});

canvas.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  if (verificaClique(x, y, botaoNao)) moverBotaoNao();
});

function verificaClique(x, y, botao) {
  return (
    x >= botao.x &&
    x <= botao.x + botao.w &&
    y >= botao.y &&
    y <= botao.y + botao.h
  );
}

function iniciarMotivos() {
  fase = 2;
  motivoAtual = -1;
  mostrarProximoMotivo();
}

function mostrarProximoMotivo() {
  motivoAtual++;
  if (motivoAtual < motivos.length) {
    setTimeout(mostrarProximoMotivo, 2500);
  }
}

function iniciarCartinha() {
  fase = 3;
  letrasMostradas = 0;
  clearInterval(tempoCartinha);
  tempoCartinha = setInterval(() => {
    letrasMostradas++;
    if (letrasMostradas >= fraseCartinha.length) clearInterval(tempoCartinha);
  }, 50);
}

desenhar();
