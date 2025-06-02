<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dia dos Namorados</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);

    const largura = window.innerWidth;
    const altura = window.innerHeight;

    const pergunta = "Quer ser meu amor pra sempre?";

    const botaoSim = { texto: "Sim 💖", w: 140, h: 50, cor: "#4CAF50" };
    const botaoNao = { texto: "Não 😬", w: 140, h: 50, cor: "#F44336" };
    const botaoProximo = { texto: "Continuar ➡️", w: 160, h: 50, cor: "#2196F3" };
    const botaoFotos = { texto: "Ver nossas fotos 📸", w: 220, h: 50, cor: "#4CAF50" };

    let mostrarMensagem = false;
    let motivoAtual = -1;
    let mostrarMotivos = false;
    let fraseCartinha = "Desde o dia que te conheci, minha vida ganhou mais cor, mais paz e muito amor. Você é meu presente todos os dias.";
    let letrasMostradas = 0;
    let mostrarCartinha = false;
    let tempoCartinha;

    let fase = 1;
    let motivos = [
      "Seu sorriso ilumina meu dia 😊",
      "Você me faz rir até nos dias difíceis 💫",
      "Você me entende como ninguém 💬",
      "Seu abraço é meu lugar favorito 🤗",
      "A vida com você é muito mais linda ❤️"
    ];

    let coracoes = [];

    function criaCoracao() {
      return {
        x: Math.random() * largura,
        y: altura + Math.random() * 100,
        size: Math.random() * 10 + 10,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.5
      };
    }

    for (let i = 0; i < 50; i++) coracoes.push(criaCoracao());

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
          c.x = Math.random() * largura;
          c.y = altura + Math.random() * 50;
        }
      });
    }

    function desenhaBotao(botao, x, y) {
      botao.x = x;
      botao.y = y;
      ctx.fillStyle = botao.cor;
      ctx.fillRect(botao.x, botao.y, botao.w, botao.h);
      ctx.fillStyle = "#fff";
      ctx.font = largura < 500 ? "16px Arial" : "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(botao.texto, botao.x + botao.w / 2, botao.y + 32);
    }

    function desenhar() {
      ctx.clearRect(0, 0, largura, altura);
      desenhaCoracoes();
      atualizaCoracoes();

      ctx.textAlign = "center";

      if (fase === 1) {
        ctx.fillStyle = "#000";
        ctx.font = largura < 500 ? "22px Arial" : "28px Arial";
        ctx.fillText(pergunta, largura / 2, altura * 0.25);

        desenhaBotao(botaoSim, largura / 2 - 160, altura / 2);
        desenhaBotao(botaoNao, largura / 2 + 20, altura / 2);

      } else if (fase === 2) {
        ctx.fillStyle = "#e91e63";
        ctx.font = largura < 500 ? "20px Arial" : "26px Arial";
        ctx.fillText(motivos[motivoAtual] || "", largura / 2, altura * 0.3);

        if (motivoAtual >= motivos.length - 1) {
          desenhaBotao(botaoProximo, largura / 2 - botaoProximo.w / 2, altura * 0.6);
        }

      } else if (fase === 3) {
        ctx.font = largura < 500 ? "18px Arial" : "24px Arial";
        ctx.fillStyle = "#333";
        let textoParcial = fraseCartinha.substring(0, letrasMostradas);
        desenhaTextoMultilinha(textoParcial, largura / 2, altura * 0.3, largura * 0.8);
        if (letrasMostradas >= fraseCartinha.length) {
          desenhaBotao(botaoProximo, largura / 2 - botaoProximo.w / 2, altura * 0.7);
        }

      } else if (fase === 4) {
        ctx.font = largura < 500 ? "22px Arial" : "30px Arial";
        ctx.fillStyle = "#e91e63";
        ctx.fillText("Feliz Dia dos Namorados! 💘", largura / 2, altura * 0.3);
        ctx.font = largura < 500 ? "18px Arial" : "24px Arial";
        ctx.fillText("Te amo mais do que palavras podem dizer.", largura / 2, altura * 0.37);
        desenhaBotao(botaoFotos, largura / 2 - botaoFotos.w / 2, altura * 0.6);

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
      let altura = largura < 500 ? 24 : 30;

      for (let i = 0; i < palavras.length; i++) {
        const linhaTeste = linha + palavras[i] + " ";
        const larguraLinha = ctx.measureText(linhaTeste).width;
        if (larguraLinha > maxWidth) {
          ctx.fillText(linha, x, y);
          linha = palavras[i] + " ";
          y += altura;
        } else {
          linha = linhaTeste;
        }
      }
      ctx.fillText(linha, x, y);
    }

    function moverBotaoNao() {
      botaoNao.x = Math.random() * (largura - botaoNao.w);
      botaoNao.y = Math.random() * (altura - botaoNao.h - 100) + 100;
    }

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
      mostrarMotivos = true;
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
      mostrarCartinha = true;
      letrasMostradas = 0;
      if (tempoCartinha) clearInterval(tempoCartinha);
      tempoCartinha = setInterval(() => {
        letrasMostradas++;
        if (letrasMostradas >= fraseCartinha.length) {
          clearInterval(tempoCartinha);
        }
      }, 50);
    }

    function handleInteracao(x, y) {
      if (fase === 1) {
        if (verificaClique(x, y, botaoSim)) {
          iniciarMotivos();
        }
        if (verificaClique(x, y, botaoNao)) {
          moverBotaoNao();
        }
      } else if (fase === 2 && motivoAtual >= motivos.length - 1 && verificaClique(x, y, botaoProximo)) {
        iniciarCartinha();
      } else if (fase === 3 && letrasMostradas >= fraseCartinha.length && verificaClique(x, y, botaoProximo)) {
        fase = 4;
      } else if (fase === 4 && verificaClique(x, y, botaoFotos)) {
        window.location.href = "fotos.html";
      }
    }

    canvas.addEventListener("click", (e) => handleInteracao(e.clientX, e.clientY));
    canvas.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      handleInteracao(touch.clientX, touch.clientY);
    });

    desenhar();
  </script>
</body>
</html>
