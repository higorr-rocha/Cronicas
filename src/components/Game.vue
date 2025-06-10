<template>
  <div ref="gameContainer" class="game-container">
    <canvas
      ref="canvas"
      class="game-canvas"
      :width="gameWidth"
      :height="gameHeight"
    ></canvas>

    <Dialog 
      :visible="dialog.visible" 
      :message="dialog.message" 
    />
  </div>
</template>

<script setup>
// Importações do Vue para reatividade e ciclo de vida do componente.
import { ref, onMounted, onUnmounted, watch } from 'vue';
// Componente filho para a caixa de diálogo.
import Dialog from './Dialog.vue';
// Biblioteca de áudio para gerenciar todos os sons do jogo.
import { Howl } from 'howler';

// --- Importação de Recursos (Assets) ---
// Imagens principais e áudios que serão usados no jogo.
import mapSrc from '../assets/Mapas/templos.png';
import playerSrc from '../assets/player_spritesheet.png';
import passosAudio from '../assets/Sons/passos.ogg';
import BotaoCorretoAudio from '../assets/Sons/AcertarBotao.ogg';
import PegarAnelAudio from '../assets/Sons/PegarAnel.ogg';
import PegarArtefatoAudio from '../assets/Sons/PegarArtefato.ogg';

// --- Importação dos Composables (Lógica Externa) ---
// Cada 'composable' cuida de uma parte específica da lógica do jogo.
import { useColisoes } from '../composables/useColisoes.js';
import { usePlayer } from '../composables/usePlayer.js';
import { useTeclado } from '../composables/useTeclado.js';
import { useDialog } from '../composables/useDialog.js';
import { usePuzzle } from '../composables/usePuzzle.js';
import { useInventario } from '../composables/useInventario.js';

// --- Configurações Globais do Jogo ---
// Define a resolução base do jogo para manter a proporção em diferentes telas.
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

// --- Refs do Template ---
// Referências reativas para os elementos do DOM e para o tamanho dinâmico do canvas.
const gameContainer = ref(null);
const canvas = ref(null);
const gameWidth = ref(GAME_WIDTH);
const gameHeight = ref(GAME_HEIGHT);

// --- Inicialização de Imagens ---
// Pré-carrega as imagens principais para que estejam prontas quando o jogo começar.
const mapImage = new Image();
mapImage.src = mapSrc;
const interiorMapImages = {}; // Objeto para guardar as imagens dos interiores dos templos.
const hudImages = {};         // Objeto para guardar as imagens dos itens da HUD.
const playerImage = new Image();
playerImage.src = playerSrc;

// --- Inicialização de Sons ---
// Cria instâncias de 'Howl' para cada efeito sonoro, configurando volume e loop.
const somBotaoCorreto = new Howl({
  src: [BotaoCorretoAudio],
  volume: 0.8
});
const somPegarAnel = new Howl({
  src: [PegarAnelAudio],
  volume: 0.7
});
const somPegarArtefato = new Howl({
  src: [PegarArtefatoAudio],
  volume: 0.9
});
const somPassos = new Howl({
  src: [passosAudio],
  volume: 0.4
});
let ultimoPasso = 0; // Variável para controlar o intervalo do som de passos.
const intervaloPassos = 380; // Tempo em milissegundos.

// --- Inicialização dos Sistemas (Composables) ---
// Desestrutura as funções e variáveis reativas de cada composable para uso no componente.
// Este é o núcleo da Composition API, onde conectamos todas as nossas lógicas.
const { templos, aviao, mapaBase, mapaPredio, retangulosColidem, verificaColisaoTemplos, verificaColisaoAviao, verificaColisaoPorta } = useColisoes();
const { player, keys, moverJogador } = usePlayer();
const currentMap = ref('base'); // O jogo agora começa no mapa 'base'.
const { puzzleStatus, ativarBotao, podeAtivar, iniciarPuzzle } = usePuzzle({
  onBotaoCorreto: () => { somBotaoCorreto.play(); },
});
const { inventario, adicionarItem, temItem, limparInventario } = useInventario({
  onItemAdicionado: (item) => {
    if (item.id?.startsWith('anel_')) {
      somPegarAnel.play();
    }
    if (item.id === 'artefato') {
      somPegarArtefato.play();
    }
  }
});

const emit = defineEmits(['end-game']); // Define o evento que este componente pode emitir para o pai (App.vue).
const baseMapImage = new Image();
baseMapImage.src = mapaBase.interiorImageSrc;
const predioMapImage = new Image();
predioMapImage.src = mapaPredio.interiorImageSrc;
const { dialog, abrirDialogo, processarTecla: processarTeclaDialogo } = useDialog(player, currentMap, aviao, mapaBase, mapaPredio, ativarBotao, adicionarItem, limparInventario, temItem, finalizarJogo);
let context; // O contexto 2D do canvas, onde tudo é desenhado.
let animationFrameId = null; // ID para controlar o loop de animação.

// Carrega imagens da HUD para itens já no inventário (útil para carregar um jogo salvo, por exemplo).
inventario.value.forEach(item => {
  if (item.hudImageSrc) {
    const img = new Image();
    img.src = item.hudImageSrc;
    hudImages[item.id] = img;
  }
});

/**
 * Lida com todos os pressionamentos de tecla.
 * Atua como um despachante central, enviando o evento para outras funções que precisam dele.
 * @param {KeyboardEvent} e - O evento do teclado.
 */
function handleKeyPress(e) {
  processarTeclaDialogo(e);
}

/**
 * Configura a responsividade do canvas.
 * Garante que o jogo se ajuste ao tamanho da janela, mantendo a proporção.
 */
function setupDisplay() {
  const updateSize = () => {
    if (!gameContainer.value || !canvas.value) return;
    const containerWidth = gameContainer.value.clientWidth;
    const containerHeight = gameContainer.value.clientHeight;
    let newWidth = containerWidth;
    let newHeight = Math.round(newWidth / ASPECT_RATIO);
    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = Math.round(newHeight * ASPECT_RATIO);
    }
    gameWidth.value = newWidth;
    gameHeight.value = newHeight;
    canvas.value.width = newWidth;
    canvas.value.height = newHeight;
    canvas.value.style.width = `${newWidth}px`;
    canvas.value.style.height = `${newHeight}px`;
  };
  window.addEventListener('resize', updateSize);
  document.addEventListener('fullscreenchange', updateSize);
  updateSize();
  return () => {
    window.removeEventListener('resize', updateSize);
    document.removeEventListener('fullscreenchange', updateSize);
  };
}

/**
 * Função utilitária para criar um retângulo de colisão (hitbox) para o jogador.
 * @param {number} newX - A coordenada X potencial do jogador.
 * @param {number} newY - A coordenada Y potencial do jogador.
 * @returns {object} Um objeto retângulo com x, y, largura e altura.
 */
function rectFromPlayer(newX, newY) {
  return {
    x: newX + player.value.hitbox.offsetX,
    y: newY + player.value.hitbox.offsetY,
    largura: player.value.hitbox.width,
    altura: player.value.hitbox.height,
  };
}

/**
 * "Observador" que reage a mudanças no mapa atual.
 * Sempre que 'currentMap' muda, ele verifica se o novo mapa tem um puzzle
 * e instrui o 'usePuzzle' a carregar a sequência correta.
 */
watch(currentMap, (novoMapaId) => {
  const templo = templos.find(t => t.id === novoMapaId);
  if (templo && templo.interior?.puzzle?.sequencia) {
    iniciarPuzzle(templo.interior.puzzle.sequencia);
  } else {
    iniciarPuzzle([]); // Limpa o puzzle se o mapa não tiver um.
  }
});

/**
 * Emite um evento para o componente pai (App.vue) para sinalizar o fim do jogo.
 */
function finalizarJogo() {
  emit('end-game');
}

// Inicializa o sistema de teclado, passando o estado das teclas e o handler principal.
useTeclado(keys, handleKeyPress);

/**
 * O coração da lógica do jogo. É executado a cada quadro.
 * Responsável por atualizar o estado do jogador, verificar colisões e interações.
 */
function update() {
  if (!dialog.value.visible) {
    const xAnterior = player.value.x;
    const yAnterior = player.value.y;

    const { nextX, nextY } = moverJogador(keys.value);
    // Garante que o jogador não saia dos limites do "mundo" do jogo.
    const boundedX = Math.max(0, Math.min(GAME_WIDTH - player.value.width, nextX));
    const boundedY = Math.max(0, Math.min(GAME_HEIGHT - player.value.height, nextY));
    const playerRect = rectFromPlayer(boundedX, boundedY);

    // Máquina de estados que executa a lógica específica do mapa atual.
    if (currentMap.value === 'exterior') {
      const objetoComPorta = verificaColisaoPorta(playerRect);
      if (objetoComPorta) {
        if (objetoComPorta.id === 'aviao') {
          // Lógica condicional do avião, baseada no inventário.
          if (inventario.value.length === 3) {
            abrirDialogo({ id: 'ir_predio' }, 'Ir para o prédio descoberto?\nE - Sim   ESC - Não');
          } else {
            abrirDialogo(aviao, 'Voltar para a base?\nE - Sim   ESC - Não');
          }
        } else {
          abrirDialogo(objetoComPorta, 'Deseja entrar?\nE - Sim   ESC - Não');
        }
      } else {
        const colidiuComBarreira = verificaColisaoTemplos(playerRect) || verificaColisaoAviao(playerRect);
        if (!colidiuComBarreira) {
          player.value.x = boundedX;
          player.value.y = boundedY;
        }
      }
    } else if (currentMap.value.startsWith('templo_')) {
        const temploAtual = templos.find(t => t.id === currentMap.value);
        if (temploAtual && temploAtual.interior) {
          const { paredes, saida, puzzle, artefato, papel } = temploAtual.interior;
          let movimentoBloqueado = false;
          
          // Lógica de interação com puzzles, artefatos e papéis.
          // A ordem das verificações é importante para definir a prioridade de interação.
          if (puzzle) {
            if (puzzleStatus.value !== 'resolvido' && retangulosColidem(playerRect, puzzle.portaFinal)) {
              movimentoBloqueado = true;
            }
            const botaoPressionado = puzzle.botoes.find(b => retangulosColidem(playerRect, b));
            if (botaoPressionado) {
              movimentoBloqueado = true;
              if (podeAtivar(botaoPressionado.id)) {
                abrirDialogo(botaoPressionado, 'Ativar o botão?\nE - Sim   ESC - Não');
              }
            }
          }
          const podeColetar = !puzzle || puzzleStatus.value === 'resolvido';
          if (artefato && artefato.type === 'artefato' && podeColetar && !temItem(artefato.id) && retangulosColidem(playerRect, artefato)) {
            movimentoBloqueado = true;
            abrirDialogo(artefato, 'Coletar Artefato?\nE - Sim   ESC - Não');
          }
          if (papel && retangulosColidem(playerRect, papel)) {
            movimentoBloqueado = true;
            abrirDialogo(papel, `${papel.texto}\n\nESC - Fechar`);
          }

          // Lógica de colisão com saídas e paredes.
          if (retangulosColidem(playerRect, saida)) {
            movimentoBloqueado = true;
            abrirDialogo({ id: 'saida', origem: temploAtual }, 'Deseja sair?\nE - Sim   ESC - Não');
          } else if (paredes.some(p => retangulosColidem(playerRect, p))) {
            movimentoBloqueado = true;
          }

          // Move o jogador apenas se nenhuma interação ou colisão o bloqueou.
          if (!movimentoBloqueado) {
            player.value.x = boundedX;
            player.value.y = boundedY;
          }
        }
      } else if (currentMap.value === 'base') {
      const { paredes, saida } = mapaBase;
      if (retangulosColidem(playerRect, saida)) {
        abrirDialogo('saida_base', 'Deseja ir para os templos?\nE - Sim   ESC - Não');
      } else {
        const colidiuComParede = paredes.some(p => retangulosColidem(playerRect, p));
        if (!colidiuComParede) {
          player.value.x = boundedX;
          player.value.y = boundedY;
        }
      }
    } else if (currentMap.value === 'predio') {
      const { paredes, porta, aviaoSaida } = mapaPredio;
      let movimentoBloqueado = false;
      if (retangulosColidem(playerRect, porta)) {
        movimentoBloqueado = true;
        abrirDialogo(mapaPredio, 'Entrar no prédio?\nE - Sim   ESC - Não');
      } else if (retangulosColidem(playerRect, aviaoSaida)) {
        movimentoBloqueado = true;
        abrirDialogo({ id: 'aviao_predio_saida' }, 'Voltar para a base?\nE - Sim   ESC - Não');
      } else if (paredes.some(p => retangulosColidem(playerRect, p))) {
        movimentoBloqueado = true;
      }
      if (!movimentoBloqueado) {
        player.value.x = boundedX;
        player.value.y = boundedY;
      }
    } else if (currentMap.value === 'predio_interior') {
      const { paredes, saida, artefato } = mapaPredio.interior;
      let movimentoBloqueado = false;
      if (artefato && artefato.type === 'artefato' && !temItem(artefato.id) && retangulosColidem(playerRect, artefato)) {
        movimentoBloqueado = true;
        abrirDialogo(artefato, 'Coletar Artefato Final?\nE - Sim   ESC - Não');
      } else if (retangulosColidem(playerRect, saida)) {
        movimentoBloqueado = true;
        abrirDialogo({ id: 'saida_predio_interior' }, 'Sair do prédio?\nE - Sim   ESC - Não');
      } else if (paredes.some(p => retangulosColidem(playerRect, p))) {
        movimentoBloqueado = true;
      }
      if (!movimentoBloqueado) {
        player.value.x = boundedX;
        player.value.y = boundedY;
      }
    }

    // Lógica de som de passos, só toca se o personagem realmente se moveu.
    const realmenteMoveu = player.value.x !== xAnterior || player.value.y !== yAnterior;
    const agora = Date.now();
    if (realmenteMoveu && agora - ultimoPasso > intervaloPassos) {
      somPassos.play();
      ultimoPasso = agora;
    }
  }
}

/**
 * O coração da renderização do jogo. É executado a cada quadro.
 * Responsável por limpar a tela e desenhar todos os elementos visuais.
 */
function draw() {
  const scaleX = gameWidth.value / GAME_WIDTH;
  const scaleY = gameHeight.value / GAME_HEIGHT;

  context.save(); // Salva o estado do canvas sem escala.
  context.scale(scaleX, scaleY); // Aplica a escala para responsividade.
  context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // --- 1. Seleção e Desenho do Mapa de Fundo ---
  // A lógica seleciona a imagem correta com base no estado atual do jogo.
  let currentMapImage;
  if (currentMap.value === 'exterior') {
    currentMapImage = mapImage;
  } else if (currentMap.value === 'base') {
    currentMapImage = baseMapImage;
  } else if (currentMap.value === 'predio') {
    currentMapImage = predioMapImage;
  } else if (currentMap.value === 'predio_interior') {
    const artefatoFinal = mapaPredio.interior.artefato;
    if (artefatoFinal && temItem(artefatoFinal.id) && interiorMapImages['predio_coletado']) {
      currentMapImage = interiorMapImages['predio_coletado'];
    } else {
      currentMapImage = interiorMapImages['predio_interior'];
    }
  } else {
    // Lógica para os mapas dos templos com estados múltiplos (fechado, aberto, coletado).
    const temploAtual = templos.find(t => t.id === currentMap.value); 
    if (temploAtual) {
      const artefatoId = temploAtual.interior?.artefato?.id;
      if (artefatoId && temItem(artefatoId) && interiorMapImages[`${temploAtual.id}_coletado`]) {
        currentMapImage = interiorMapImages[`${temploAtual.id}_coletado`];
      } else if (puzzleStatus.value === 'resolvido' && interiorMapImages[`${temploAtual.id}_aberto`]) {
        currentMapImage = interiorMapImages[`${temploAtual.id}_aberto`];
      } else {
        currentMapImage = interiorMapImages[temploAtual.id];
      }
    }
  }
  if (currentMapImage && currentMapImage.complete) {
    context.drawImage(currentMapImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  // --- 2. Desenho do Jogador ---
  // Seleciona o frame correto da spritesheet com base na direção e animação.
  const frameWidth = playerImage.width / player.value.frameCount;
  const frameHeight = playerImage.height / 4;
  context.drawImage(
    playerImage,
    frameWidth * player.value.frameIndex,
    frameHeight * player.value.direction,
    frameWidth, frameHeight,
    player.value.x,
    player.value.y,
    player.value.width,
    player.value.height
  );

  // --- 3. Efeito de Névoa (Fog) ---
  // Aplicado apenas no Templo Azul e antes de coletar o anel.
  if (currentMap.value === 'templo_azul' && !temItem('anel_azul')) {
    context.fillStyle = 'rgba(0, 0, 0, 0.94)';
    context.beginPath();
    context.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const playerCenterX = player.value.x + player.value.width / 2;
    const playerCenterY = player.value.y + player.value.height / 2;
    const lightRadius = 65;
    context.arc(playerCenterX, playerCenterY, lightRadius, 0, 2 * Math.PI, true);
    context.fill();
  }

  context.restore(); // Restaura o canvas para o estado sem escala.

  // --- 4. Desenho da HUD ---
  // Desenhado por último e após o restore(), para não ser afetado pela escala do mundo.
  inventario.value.forEach((item, index) => {
    const hudImage = hudImages[item.id];
    if (hudImage && hudImage.complete) {
      context.drawImage(hudImage, 20 + (index * 60), 20, 50, 50);
    }
  });
}

/**
 * O loop principal do jogo.
 * Usa requestAnimationFrame para um ciclo de atualização e desenho suave e otimizado.
 */
function gameLoop() {
  update();
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Função executada quando o componente é montado no DOM.
 * Prepara o canvas e pré-carrega todos os recursos (imagens) do jogo.
 * Inicia o gameLoop apenas quando todos os recursos estiverem prontos.
 */
onMounted(() => {
  context = canvas.value.getContext('2d');
  const cleanupDisplay = setupDisplay();
  const { templos, mapaPredio } = useColisoes();

  const imagePromises = [
    new Promise(resolve => { mapImage.onload = resolve; }),
    new Promise(resolve => { baseMapImage.onload = resolve; }),
    new Promise(resolve => { predioMapImage.onload = resolve; }),
    new Promise(resolve => { playerImage.onload = resolve; })
  ];
  const imgPredioInterior = new Image();
  imgPredioInterior.src = mapaPredio.interior.interiorImageSrc;
  interiorMapImages['predio_interior'] = imgPredioInterior;
  imagePromises.push(new Promise(resolve => { imgPredioInterior.onload = resolve; }));
  const imgPredioColetado = new Image();
  imgPredioColetado.src = mapaPredio.interior.interiorColetadoImageSrc;
  interiorMapImages['predio_coletado'] = imgPredioColetado;
  imagePromises.push(new Promise(resolve => { imgPredioColetado.onload = resolve; }));
  const artefatoFinal = mapaPredio.interior.artefato;
  if (artefatoFinal?.hudImageSrc) {
    const img = new Image();
    img.src = artefatoFinal.hudImageSrc;
    hudImages[artefatoFinal.id] = img;
    imagePromises.push(new Promise(resolve => { img.onload = resolve; }));
  }
  templos.forEach(templo => {
    const imgFechada = new Image();
    imgFechada.src = templo.interiorImageSrc;
    interiorMapImages[templo.id] = imgFechada;
    imagePromises.push(new Promise(resolve => { imgFechada.onload = resolve; }));
    if (templo.interiorAbertoImageSrc) {
      const imgAberta = new Image();
      imgAberta.src = templo.interiorAbertoImageSrc;
      interiorMapImages[`${templo.id}_aberto`] = imgAberta;
      imagePromises.push(new Promise(resolve => { imgAberta.onload = resolve; }));
    }
    if (templo.interiorColetadoImageSrc) {
      const imgColetado = new Image();
      imgColetado.src = templo.interiorColetadoImageSrc;
      interiorMapImages[`${templo.id}_coletado`] = imgColetado;
      imagePromises.push(new Promise(resolve => { imgColetado.onload = resolve; }));
    }
    if (templo.interior?.artefato?.hudImageSrc) {
      const artefato = templo.interior.artefato;
      const img = new Image();
      img.src = artefato.hudImageSrc;
      hudImages[artefato.id] = img;
      imagePromises.push(new Promise(resolve => { img.onload = resolve; }));
    }
  });

  Promise.all(imagePromises).then(() => {
    gameLoop();
  });

  // Limpa os event listeners quando o componente é desmontado para evitar vazamentos de memória.
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
    cleanupDisplay();
  });
});

defineExpose({ dialog });
</script>

<style scoped>
/* Estilos para o contêiner principal do jogo. */
.game-container {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Necessário para o posicionamento absoluto do diálogo. */
  overflow: hidden; /* Garante que nada transborde da tela. */
}

/* Estilos para o canvas. */
.game-canvas {
  background-color: #000;
  /* Garante que a pixel art não fique borrada ao ser redimensionada. */
  image-rendering: pixelated;
}
</style>