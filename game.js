const world = document.getElementById("world");
const player = document.getElementById("player");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

const counter = document.getElementById("counter");

const platforms =
  document.querySelectorAll(".platform");

const floatingCrates =
  document.querySelectorAll(".floating-crate");

const sunflowers =
  document.querySelectorAll(".sunflower");

const holes =
  document.querySelectorAll(".hole");

const rivers =
  document.querySelectorAll(".river");

const checkpoints =
  document.querySelectorAll(".checkpoint");

const fireflies =
  document.querySelectorAll(".firefly");

const birds =
  document.querySelectorAll(".bird");

let birdHitCooldown = false;

const mushroom =
  document.getElementById("bounceMushroom");

const specialCrate =
  document.getElementById("specialCrate");

const secretKey =
  document.getElementById("secretKey");

const pushableCrate =
  document.getElementById("pushableCrate");

const riverLog =
  document.getElementById("riverLog");

const floorButton =
  document.getElementById("floorButton");

const risingPlatform =
  document.getElementById("risingPlatform");

const secretBush =
  document.getElementById("secretBush");

const secretSunflower =
  document.getElementById("secretSunflower");
const movingCloud =
  document.getElementById("movingCloud");

const returnCrate =
  document.getElementById("returnCrate");

const runnerSunflower =
  document.getElementById("runnerSunflower");

const temporaryButton =
  document.getElementById("temporaryButton");

const temporaryPlatforms =
  document.querySelectorAll(".temporary-platform");

const runMessage =
  document.getElementById("runMessage");

const finalButton =
  document.getElementById("finalButton");

const finalDoor =
  document.getElementById("finalDoor");

const doorMessage =
  document.getElementById("doorMessage");

const doorFade =
  document.getElementById("doorFade");

const doorFadeText =
  document.getElementById("doorFadeText");


const beachScene = document.getElementById("beachScene");
const beachPlayer = document.getElementById("beachPlayer");
const beachIntro = document.getElementById("beachIntro");
const flowerDropBox = document.getElementById("flowerDropBox");
const beachMessage = document.getElementById("beachMessage");
const backToStartBtn = document.getElementById("backToStartBtn");
const natCharacter = document.getElementById("natCharacter");
const natSpeech = document.getElementById("natSpeech");

const beachCounter = document.getElementById("beachCounter");
const beachFlowerCount = document.getElementById("beachFlowerCount");
const beachKeyCount = document.getElementById("beachKeyCount");

const finalBouquet = document.getElementById("finalBouquet");
const finalThankYou = document.getElementById("finalThankYou");





/* =====================
   CONFIGURAÇÕES
===================== */

const worldWidth = 9000;

const speed = 6;
const gravity = 1;

const jumpForce = 22;
const mushroomForce = 32;

const groundTop = 90;

const bodyLeftOffset = 125;
const bodyRightOffset = 225;

const feetOffsetY = 150;

/* Escala proporcional do gameplay no celular deitado.
   O cenário continua 100%; personagem, obstáculos e hitboxes
   ficam menores juntos, mantendo os pés no mesmo chão. */
const mobileGameplay =
  window.matchMedia(
    "(orientation: landscape) and (max-height: 700px)"
  ).matches;

const mobileGameplayScale =
  mobileGameplay ? 0.70 : 1;

const bodyCenterOffset = 175;
const bodyHalfWidth =
  50 * mobileGameplayScale;

const effectiveBodyLeftOffset =
  bodyCenterOffset - bodyHalfWidth;

const effectiveBodyRightOffset =
  bodyCenterOffset + bodyHalfWidth;

const effectiveBodyHeight =
  120 * mobileGameplayScale;



/* =====================
   ESTADO
===================== */

let positionX = 60;
let positionY = -60;

let previousX = positionX;
let previousY = positionY;

let velocityY = 0;

let movingLeft = false;
let movingRight = false;

let grounded = true;
let falling = false;

let cameraX = 0;

let flowers = 0;

let hasKey = false;
let keyRevealed = false;

let secretCollected = false;

let checkpointX = 60;
let checkpointY = -60;

/* NUVEM MÓVEL */

let cloudX = 5380;
let cloudDirection = 1;

const cloudStart = 5380;
const cloudRange = 170;
const cloudSpeed = 1.8;
/* CAIXOTE EMPURRÁVEL */

let pushableX = 3850;


/* PLATAFORMA MÓVEL */

let risingBottom = 90;

let platformActivated = false;

const risingTarget = 330;
const risingSpeed = 2;


/* GIRASSOL FUJÃO */

let runnerX = 6000;

let runnerEscapes = 0;

let runnerCanRun = true;


/* PLATAFORMAS TEMPORÁRIAS */

let temporaryActive = false;

let temporaryWarning = false;

let temporaryStartTime = 0;

const temporaryDuration = 4000;

const warningTime = 3000;

/* FINAL DA FASE */

let finalButtonVisible = false;
let finalButtonPressed = false;

let finalDoorVisible = false;
let finalDoorEntered = false;

let doorMessageCooldown = false;

let beachMode = false;
let depositingFlowers = false;
let finalFlowersDelivered = false;

/* PRAIA / CUTSCENE */
let beachPlayerX = 8;
const beachPlayerSpeed = 0.45;
let beachCutscene = false;
let beachHintShown = false;




/* =====================
   HUD
===================== */

function updateHUD() {

  counter.textContent =
    `🌻 ${flowers}/${sunflowers.length}   🔑 ${hasKey ? 1 : 0}`;

}


/* =====================
   HITBOX PERSONAGEM
===================== */

function playerBox(
  x = positionX,
  y = positionY
) {

  return {

    left:
      x + effectiveBodyLeftOffset,

    right:
      x + effectiveBodyRightOffset,

    bottom:
      y + feetOffsetY,

    top:
      y + feetOffsetY + effectiveBodyHeight

  };

}


/* =====================
   CONTROLES
===================== */

document.addEventListener(
  "keydown",
  function(e) {

    if (
      document.body.classList.contains(
        "menu-open"
      )
    ) {
      return;
    }


    if (falling) {
      return;
    }

    const key =
      e.key.toLowerCase();


    if (
      e.key === "ArrowRight" ||
      key === "d"
    ) {

      movingRight = true;

    }


    if (
      e.key === "ArrowLeft" ||
      key === "a"
    ) {

      movingLeft = true;

    }


    if (
      e.key === " " ||
      e.key === "ArrowUp" ||
      key === "w"
    ) {

      e.preventDefault();

      jump();

    }

  }
);


document.addEventListener(
  "keyup",
  function(e) {

    const key =
      e.key.toLowerCase();


    if (
      e.key === "ArrowRight" ||
      key === "d"
    ) {

      movingRight = false;

    }


    if (
      e.key === "ArrowLeft" ||
      key === "a"
    ) {

      movingLeft = false;

    }

  }
);


leftBtn.onpointerdown =
  function() {

    movingLeft = true;

  };


rightBtn.onpointerdown =
  function() {

    movingRight = true;

  };


document.onpointerup =
  function() {

    movingLeft = false;

    movingRight = false;

  };


jumpBtn.onpointerdown =
  function() {

    jump();

  };


/* =====================
   PULO
===================== */

function jump() {

  if (
    grounded &&
    !falling
  ) {

    grounded = false;

    velocityY =
      jumpForce;

  }

}


/* =====================
   PLATAFORMAS NORMAIS
===================== */

function platformBox(el) {

  const x =
    Number(el.dataset.x);


  let height = 115 * mobileGameplayScale;


  if (
    el.classList.contains("log")
  ) {

    height = 55 * mobileGameplayScale;

  }


  if (
    el.classList.contains("rock")
  ) {

    height = 100 * mobileGameplayScale;

  }


  return {

    left: x,

    right:
      x + el.offsetWidth,

    bottom:
      groundTop,

    top:
      groundTop + height

  };

}


/* =====================
   CAIXOTES FLUTUANTES
===================== */

function floatingBox(el) {

  const x =
    Number(el.dataset.x);


  return {

    left: x,

    right:
      x + (110 * mobileGameplayScale),

    bottom: 270,

    top:
      270 + (110 * mobileGameplayScale)

  };

}


/* =====================
   PAREDÃO DO PUZZLE
===================== */

function puzzleBox() {

  return {

    left: 4200,

    right:
      4200 + (260 * mobileGameplayScale),

    bottom: 90,

    top:
      groundTop + (260 * mobileGameplayScale)

  };

}


/* =====================
   CAIXOTE EMPURRÁVEL
===================== */

function pushableBox() {

  return {

    left:
      pushableX,

    right:
      pushableX + (130 * mobileGameplayScale),

    bottom:
      groundTop,

    top:
      groundTop + (115 * mobileGameplayScale)

  };

}


/* =====================
   CAIXOTE PARA VOLTAR
===================== */

function returnCrateBox() {

  return {

    left: 4480,

    right:
      4480 + (130 * mobileGameplayScale),

    bottom:
      groundTop,

    top:
      groundTop + (115 * mobileGameplayScale)

  };

}


/* =====================
   PLATAFORMA TEMPORÁRIA
===================== */

function temporaryPlatformBox(el) {

  const x =
    Number(el.dataset.x);

  const bottom =
    Number(el.dataset.bottom);


  return {

    left: x,

    right:
      x + (150 * mobileGameplayScale),

    bottom: bottom,

    top:
      bottom + (35 * mobileGameplayScale)

  };

}


/* =====================
   PLATAFORMA QUE SOBE
===================== */

function risingBox() {

  return {

    left: 7050,

    right:
      7050 + (220 * mobileGameplayScale),

    bottom:
      risingBottom,

    top:
      risingBottom + (55 * mobileGameplayScale)

  };

}


/* =====================
   TRONCO DO RIO
===================== */

function riverLogBox() {

  return {

    left: 4825,

    right:
      4825 + (190 * mobileGameplayScale),

    bottom: 105,

    top:
      105 + (65 * mobileGameplayScale)

  };

}


/* =====================
   COLISÃO LATERAL
===================== */

function blockHorizontal(box) {

  const p =
    playerBox();


  const old =
    playerBox(
      previousX,
      positionY
    );


  const vertical =
    p.top > box.bottom &&
    p.bottom < box.top;


  if (!vertical) {
    return;
  }


  const overlap =
    p.right > box.left &&
    p.left < box.right;


  if (!overlap) {
    return;
  }


  if (
    old.right <= box.left
  ) {

    positionX =
      box.left -
      effectiveBodyRightOffset;

  }


  else if (
    old.left >= box.right
  ) {

    positionX =
      box.right -
      effectiveBodyLeftOffset;

  }

}


/* =====================
   POUSAR EM CIMA
===================== */

function tryLanding(box) {

  if (velocityY > 0) {
    return false;
  }


  const p =
    playerBox();


  const old =
    playerBox(
      positionX,
      previousY
    );


  const xOverlap =
    p.right > box.left + 5 &&
    p.left < box.right - 5;


  const crossed =
    old.bottom >= box.top &&
    p.bottom <= box.top;


  if (
    xOverlap &&
    crossed
  ) {

    positionY =
      box.top -
      feetOffsetY;


    velocityY = 0;

    grounded = true;


    return true;

  }


  return false;

}


/* =====================
   ESTÁ EM CIMA?
===================== */

function standingOn(box) {

  const p =
    playerBox();


  return (

    p.right >
    box.left + 4 &&

    p.left <
    box.right - 4 &&

    Math.abs(
      p.bottom -
      box.top
    ) <= 6

  );

}


/* =====================
   COGUMELO
===================== */

function mushroomBounce() {

  if (
    !mushroom ||
    velocityY > 0
  ) {

    return false;

  }


  const box = {

    left: 2050,

    right:
      2050 + (130 * mobileGameplayScale),

    top:
      groundTop + (95 * mobileGameplayScale)

  };


  const p =
    playerBox();


  const old =
    playerBox(
      positionX,
      previousY
    );


  if (
    p.right > box.left + 10 &&
    p.left < box.right - 10 &&
    old.bottom >= box.top &&
    p.bottom <= box.top
  ) {

    positionY =
      box.top -
      feetOffsetY;


    grounded = false;

    velocityY =
      mushroomForce;


    mushroom.classList.remove(
      "bounce"
    );


    void mushroom.offsetWidth;


    mushroom.classList.add(
      "bounce"
    );


    return true;

  }


  return false;

}


/* =====================
   CABEÇADA NOS CAIXOTES
===================== */

function hitFloatingCrates() {

  if (velocityY <= 0) {
    return;
  }


  const p =
    playerBox();


  const old =
    playerBox(
      positionX,
      previousY
    );


  floatingCrates.forEach(
    function(crate) {

      const box =
        floatingBox(crate);


      if (
        p.right > box.left + 5 &&
        p.left < box.right - 5 &&
        old.top <= box.bottom &&
        p.top >= box.bottom
      ) {

        positionY =
          box.bottom -
          feetOffsetY -
          effectiveBodyHeight;


        velocityY = -3;


        if (
          crate.id ===
          "specialCrate" &&
          !keyRevealed
        ) {

          revealKey();

        }

      }

    }
  );

}


/* =====================
   CHAVE
===================== */

function revealKey() {

  if (
    keyRevealed ||
    !specialCrate ||
    !secretKey
  ) {

    return;

  }


  keyRevealed = true;


  specialCrate.classList.add(
    "hit"
  );


  secretKey.classList.add(
    "revealed"
  );


  secretKey.style.left =
    "3062px";


  secretKey.style.bottom =
    "405px";


  setTimeout(
    function() {

      specialCrate.classList.remove(
        "hit"
      );

    },
    300
  );

}


function checkKey() {

  if (
    !keyRevealed ||
    hasKey ||
    !secretKey
  ) {

    return;

  }


  const p =
    player.getBoundingClientRect();


  const k =
    secretKey.getBoundingClientRect();


  if (
    p.left + 130 < k.right &&
    p.right - 130 > k.left &&
    p.top + 100 < k.bottom &&
    p.bottom - 30 > k.top
  ) {

    hasKey = true;


    secretKey.classList.add(
      "collected"
    );


    updateHUD();

  }

}


/* =====================
   EMPURRAR CAIXOTE
===================== */

function handlePushable() {

  if (!pushableCrate) {
    return;
  }


  const box =
    pushableBox();


  const p =
    playerBox();


  const vertical =
    p.top > box.bottom &&
    p.bottom < box.top;


  if (!vertical) {
    return;
  }


  if (
    movingRight &&
    p.right >= box.left &&
    p.left < box.left
  ) {

    pushableX += 3;

    positionX -= 2;

  }


  if (
    movingLeft &&
    p.left <= box.right &&
    p.right > box.right
  ) {

    pushableX -= 3;

    positionX += 2;

  }


  pushableX =
    Math.max(
      3780,
      Math.min(
        4140,
        pushableX
      )
    );


  pushableCrate.style.left =
    pushableX + "px";

}


/* =====================
   BOTÃO DA PLATAFORMA
===================== */

function checkButton() {

  if (!floorButton) {
    return;
  }


  const p =
    playerBox();


  if (
    p.right > 6800 &&
    p.left < 6885 &&
    p.bottom <= 105
  ) {

    if (!platformActivated) {

      platformActivated = true;


      floorButton.classList.add(
        "pressed"
      );

    }

  }

}


/* =====================
   PLATAFORMA QUE SOBE
===================== */

function updateRisingPlatform() {

  if (
    !platformActivated ||
    !risingPlatform
  ) {

    return;

  }


  if (
    risingBottom >=
    risingTarget
  ) {

    risingBottom =
      risingTarget;


    risingPlatform.style.bottom =
      risingBottom + "px";


    return;

  }


  const oldBottom =
    risingBottom;


  risingBottom +=
    risingSpeed;


  const movement =
    risingBottom -
    oldBottom;


  const oldBox = {

    left: 7050,

    right: 7270,

    top:
      oldBottom + 55

  };


  const p =
    playerBox();


  const onPlatform =

    p.right >
    oldBox.left + 5 &&

    p.left <
    oldBox.right - 5 &&

    Math.abs(
      p.bottom -
      oldBox.top
    ) < 10;


  if (onPlatform) {

    positionY +=
      movement;


    grounded = true;

    velocityY = 0;

  }


  risingPlatform.style.bottom =
    risingBottom + "px";

}


/* =====================
   GIRASSOL FUJÃO
===================== */

function updateRunnerSunflower() {

  if (
    !runnerSunflower ||
    runnerSunflower.dataset.collected === "true"
  ) {

    return;

  }


  const p =
    playerBox();


  const center =
    (
      p.left +
      p.right
    ) / 2;


  const distance =
    runnerX -
    center;


  if (
    runnerEscapes < 3 &&
    runnerCanRun &&
    distance > 0 &&
    distance < 180
  ) {

    runnerCanRun = false;

    runnerEscapes++;


    runnerSunflower.classList.add(
      "scared"
    );


    setTimeout(
      function() {

        runnerX += 210;


        runnerSunflower.dataset.x =
          runnerX;


        runnerSunflower.style.left =
          runnerX + "px";


        setTimeout(
          function() {

            runnerSunflower.classList.remove(
              "scared"
            );


            runnerCanRun = true;

          },
          400
        );

      },
      180
    );

  }

}


/* =====================
   GIRASSÓIS NORMAIS
===================== */

function checkFlowers() {

  const p =
    playerBox();


  sunflowers.forEach(
    function(flower) {

      if (
        flower.dataset.collected ===
        "true"
      ) {

        return;

      }


      const x =
        Number(
          flower.dataset.x
        );


      const y =
        Number(
          flower.dataset.y
        );


      const f = {

        left:
          x + 5,

        right:
          x + 55,

        bottom:
          y + 5,

        top:
          y + 65

      };


      const touched =

        p.right >
        f.left &&

        p.left <
        f.right &&

        p.top >
        f.bottom &&

        p.bottom <
        f.top;


      if (touched) {

        flower.dataset.collected =
          "true";


        flower.style.display =
          "none";


        flowers++;


        updateHUD();

      }

    }
  );

}


/* =====================
   MOITA SECRETA
===================== */

function checkBush() {

  if (
    !secretBush ||
    !secretSunflower
  ) {

    return;

  }


  const p =
    playerBox();


  if (
    p.right > 5750 &&
    p.left < 5940
  ) {

    secretBush.classList.add(
      "discovered"
    );

  }


  if (
    secretBush.classList.contains(
      "discovered"
    ) &&
    !secretCollected
  ) {

    if (
      p.right > 5800 &&
      p.left < 5900 &&
      p.top > 160
    ) {

      secretCollected = true;


      secretSunflower.style.display =
        "none";

    }

  }

}


/* =====================
   CHECKPOINTS
===================== */

function checkCheckpoints() {

  const p =
    playerBox();


  checkpoints.forEach(
    function(cp) {

      const x =
        Number(
          cp.dataset.x
        );


      if (
        p.right > x &&
        p.left < x + 55
      ) {

        checkpoints.forEach(
          function(c) {

            c.classList.remove(
              "active"
            );

          }
        );


        cp.classList.add(
          "active"
        );


        checkpointX =
          x - 100;


        checkpointY =
          -60;

      }

    }
  );

}


/* =====================
   VAGA-LUMES
===================== */

function updateFireflies() {

  const box =
    playerBox();


  const center =
    (
      box.left +
      box.right
    ) / 2;


  fireflies.forEach(
    function(f) {

      const x =
        parseFloat(
          f.style.left
        );


      if (
        Math.abs(
          center - x
        ) < 160
      ) {

        const direction =
          x < center
          ? -1
          : 1;


        f.style.marginLeft =
          direction * 45 +
          "px";

      }

      else {

        f.style.marginLeft =
          "0px";

      }

    }
  );

}


/* =====================
   BOTÃO TEMPORÁRIO
===================== */

function activateTemporaryPlatforms() {

  if (
    temporaryActive ||
    !temporaryButton
  ) {

    return;

  }


  temporaryActive = true;

  temporaryWarning = false;

  temporaryStartTime =
    performance.now();


  temporaryButton.classList.add(
    "pressed"
  );


  temporaryPlatforms.forEach(
    function(platform) {

      platform.classList.remove(
        "warning"
      );


      platform.classList.add(
        "active"
      );

    }
  );


  if (runMessage) {

    runMessage.classList.remove(
      "show"
    );


    void runMessage.offsetWidth;


    runMessage.classList.add(
      "show"
    );

  }

}


function checkTemporaryButton() {

  if (!temporaryButton) {
    return;
  }


  const p =
    playerBox();


  if (
    p.right > 7850 &&
    p.left < 7940 &&
    p.bottom <=
    groundTop + 15
  ) {

    activateTemporaryPlatforms();

  }

}


/* =====================
   TIMER TEMPORÁRIO
===================== */

function updateTemporaryPlatforms() {

  if (!temporaryActive) {
    return;
  }


  const elapsed =
    performance.now() -
    temporaryStartTime;


  if (
    elapsed >= warningTime &&
    !temporaryWarning
  ) {

    temporaryWarning = true;


    temporaryPlatforms.forEach(
      function(platform) {

        platform.classList.add(
          "warning"
        );

      }
    );

  }


  if (
    elapsed >=
    temporaryDuration
  ) {

    temporaryActive = false;

    temporaryWarning = false;


    temporaryButton.classList.remove(
      "pressed"
    );


    temporaryPlatforms.forEach(
      function(platform) {

        platform.classList.remove(
          "active"
        );


        platform.classList.remove(
          "warning"
        );

      }
    );


    /*
      Se ela estava em cima de uma,
      começa a cair.
    */

    grounded = false;

  }

}


/* =====================
   PERIGOS
===================== */

function overDanger() {

  const p =
    playerBox();


  const center =
    (
      p.left +
      p.right
    ) / 2;


  const dangerElements = [
    ...holes,
    ...rivers
  ];


  for (
    const d of dangerElements
  ) {

    const x =
      Number(
        d.dataset.x
      );


    const width =
      Number(
        d.dataset.width
      );


    /*
      Se estiver no tronco,
      o rio não mata.
    */

    if (
      d.classList.contains(
        "river"
      ) &&
      standingOn(
        riverLogBox()
      )
    ) {

      continue;

    }


    if (
      center >
      x + 20 &&

      center <
      x +
      width -
      20
    ) {

      return true;

    }

  }


  return false;

}


/* =====================
   QUEDA
===================== */

function startFall() {

  falling = true;

  grounded = false;

  movingLeft = false;

  movingRight = false;

  velocityY = -4;

}


/* =====================
   RESPAWN
===================== */

function respawn() {

  positionX =
    checkpointX;


  positionY =
    checkpointY;


  previousX =
    positionX;


  previousY =
    positionY;


  velocityY = 0;

  grounded = true;

  falling = false;


  movingLeft = false;

  movingRight = false;


  player.style.left =
    positionX + "px";


  player.style.bottom =
    positionY + "px";


  updateCamera();

}


/* =====================
   CÂMERA
===================== */

function updateCamera() {

  const start =
    window.innerWidth *
    0.4;


  cameraX =
    Math.max(
      0,
      positionX - start
    );


  const maxCamera =
    Math.max(
      0,
      worldWidth -
      window.innerWidth
    );


  cameraX =
    Math.min(
      cameraX,
      maxCamera
    );


  world.style.transform =
    `translateX(${-cameraX}px)`;

}

/* =====================
   AVES
===================== */

function updateBirds(time) {

  birds.forEach(function(bird) {

    const start =
      Number(bird.dataset.start);

    const range =
      Number(bird.dataset.range);

    const speed =
      Number(bird.dataset.speed);


    /*
      Movimento de ida e volta
    */

    const movement =
      (Math.sin(time * 0.001 * speed) + 1) / 2;

    const x =
      start + movement * range;


    bird.style.left =
      x + "px";


    /*
      Faz a ave olhar para
      o lado em que está voando
    */

    const direction =
      Math.cos(time * 0.001 * speed);


    if (direction > 0) {

      bird.style.transform =
        "scaleX(-1)";

    } else {

      bird.style.transform =
        "scaleX(1)";

    }

  });

}


/* =====================
   COLISÃO COM AVES
===================== */

function checkBirdCollision() {

  if (
    falling ||
    birdHitCooldown
  ) {
    return;
  }


  const p =
    player.getBoundingClientRect();


  for (const bird of birds) {

    const b =
      bird.getBoundingClientRect();


    /*
      Hitbox propositalmente
      menor para não ficar injusto
    */

    const touched =

      p.left + 130 <
      b.right - 8 &&

      p.right - 130 >
      b.left + 8 &&

      p.top + 100 <
      b.bottom - 5 &&

      p.bottom - 40 >
      b.top + 5;


    if (touched) {

      birdHitCooldown = true;


      /*
        Volta para o último
        checkpoint ativado
      */

      respawn();


      /*
        1 segundo de proteção
        depois do respawn
      */

      setTimeout(function() {

        birdHitCooldown = false;

      }, 1000);


      return;

    }

  }

}

/* =====================
   NUVEM MÓVEL
===================== */

function cloudBox() {
  return {
    left: cloudX + 45,
    right: cloudX + 145,
    bottom: 210,
    top: 245
  };
}

function updateMovingCloud() {
  if (!movingCloud) return;

  const oldX = cloudX;

  cloudX += cloudSpeed * cloudDirection;

  if (cloudX >= cloudStart + cloudRange) {
    cloudX = cloudStart + cloudRange;
    cloudDirection = -1;
  }

  if (cloudX <= cloudStart) {
    cloudX = cloudStart;
    cloudDirection = 1;
  }

  const movement = cloudX - oldX;
  const oldBox = {
    left: oldX + 45,
    right: oldX + 145,
    bottom: 210,
    top: 245
  };

  if (standingOn(oldBox)) {
    positionX += movement;
    grounded = true;
    velocityY = 0;
  }

  movingCloud.style.left = cloudX + "px";
}


/* =====================
   FINAL DA FASE
===================== */

function revealFinalButtonIfReady() {

  if (
    finalButtonVisible ||
    !finalButton
  ) {
    return;
  }


  /*
    O botão só aparece quando TODOS
    os girassóis normais do mapa
    já foram coletados.
  */

  if (
    flowers >=
    sunflowers.length
  ) {

    finalButtonVisible = true;

    finalButton.classList.add(
      "visible"
    );

  }

}


function checkFinalButton() {

  if (
    !finalButtonVisible ||
    finalButtonPressed ||
    !finalButton
  ) {
    return;
  }


  const p =
    playerBox();


  const buttonLeft = 8700;
  const buttonRight = 8792;


  const touchingButton =
    p.right > buttonLeft &&
    p.left < buttonRight &&
    p.bottom <= groundTop + 18;


  if (touchingButton) {

    finalButtonPressed = true;

    finalButton.classList.add(
      "pressed"
    );


    revealFinalDoor();

  }

}


function revealFinalDoor() {

  if (
    finalDoorVisible ||
    !finalDoor
  ) {
    return;
  }


  finalDoorVisible = true;

  finalDoor.classList.add(
    "visible"
  );

}


function finalDoorBox() {

  /*
    A porta fica apoiada em cima
    da última plataforma temporária.

    A hitbox é menor que a imagem
    para a entrada não acontecer
    de longe.
  */

  return {
    left: 8410,
    right: 8490,

    bottom: 380,
    top: 520
  };

}


function showDoorMessage(text) {

  if (
    !doorMessage ||
    doorMessageCooldown
  ) {
    return;
  }


  doorMessageCooldown = true;

  doorMessage.textContent =
    text;


  doorMessage.classList.remove(
    "show"
  );

  void doorMessage.offsetWidth;

  doorMessage.classList.add(
    "show"
  );


  setTimeout(function() {

    doorMessageCooldown = false;

  }, 2150);

}


function checkFinalDoor() {

  if (
    !finalDoorVisible ||
    finalDoorEntered ||
    !finalDoor
  ) {
    return;
  }


  const p =
    playerBox();

  const d =
    finalDoorBox();


  const touching =
    p.right > d.left &&
    p.left < d.right &&
    p.top > d.bottom &&
    p.bottom < d.top;


  if (!touching) {
    return;
  }


  /*
    Sem chave: não entra.
  */

  if (!hasKey) {

    showDoorMessage(
      "🔒 Parece que você esqueceu alguma coisa..."
    );

    return;
  }


  enterFinalDoor();

}


function enterFinalDoor() {
  if (finalDoorEntered) return;

  finalDoorEntered = true;
  movingLeft = false;
  movingRight = false;
  grounded = true;
  velocityY = 0;

  if (finalDoor) finalDoor.classList.add("open");
  if (doorFadeText) doorFadeText.textContent = "";

  setTimeout(function() {
    if (doorFade) doorFade.classList.add("active");
  }, 180);

  setTimeout(startBeachScene, 950);
}

function startBeachScene() {
  beachMode = true;
  beachCutscene = false;

  document.body.classList.add("beach-mode");

  if (beachScene) {
    beachScene.classList.add("active");
  }

  if (doorFade) {
    doorFade.classList.remove("active");
  }

  if (beachFlowerCount) {
    beachFlowerCount.textContent = flowers;
  }

  if (beachKeyCount) {
    beachKeyCount.textContent = hasKey ? 1 : 0;
  }

  beachPlayerX = 8;

  if (beachPlayer) {
    beachPlayer.style.left = beachPlayerX + "%";
    beachPlayer.style.transform = "scaleX(1)";
  }

  /*
    Nada de texto imediato.
    Ela entra, olha a praia e pode andar.
    O aviso só aparece quando chega perto da caixa.
  */
}

function makeFlyingFlower(isLast = false) {
  if (!flowerDropBox) return;

  const target = flowerDropBox.getBoundingClientRect();
  const source = beachCounter
    ? beachCounter.getBoundingClientRect()
    : { left: 25, top: 25, width: 60, height: 40 };

  const flower = document.createElement("div");

  flower.className =
    "flyingFinalFlower" +
    (isLast ? " lastFinalFlower" : "");

  flower.textContent = "🌻";

  flower.style.left =
    (source.left + source.width / 2) + "px";

  flower.style.top =
    (source.top + source.height / 2) + "px";

  document.body.appendChild(flower);

  requestAnimationFrame(function() {
    flower.style.left =
      (target.left + target.width / 2 - 15) + "px";

    flower.style.top =
      (target.top + target.height / 2 - 15) + "px";

    flower.style.transform =
      isLast
        ? "scale(.55) rotate(360deg)"
        : "scale(.35) rotate(25deg)";

    flower.style.opacity =
      isLast ? "1" : "0.25";
  });

  setTimeout(function() {
    flower.remove();
  }, isLast ? 1050 : 430);
}

function updateBeachCounter() {
  if (beachFlowerCount) {
    beachFlowerCount.textContent = flowers;
  }

  if (beachKeyCount) {
    beachKeyCount.textContent = hasKey ? 1 : 0;
  }
}

function isBeachPlayerNearBox() {
  if (!beachPlayer || !flowerDropBox) {
    return false;
  }

  const p = beachPlayer.getBoundingClientRect();
  const b = flowerDropBox.getBoundingClientRect();

  const playerCenter = p.left + p.width / 2;
  const boxCenter = b.left + b.width / 2;

  return Math.abs(playerCenter - boxCenter) < 230;
}


function updateBeachPlayer() {
  if (!beachMode || !beachPlayer) {
    return;
  }

  if (!beachCutscene) {
    if (movingRight) {
      beachPlayerX += beachPlayerSpeed;
      beachPlayer.style.transform = "scaleX(1)";
    }

    if (movingLeft) {
      beachPlayerX -= beachPlayerSpeed;
      beachPlayer.style.transform = "scaleX(-1)";
    }

    beachPlayerX =
      Math.max(
        -2,
        Math.min(72, beachPlayerX)
      );

    beachPlayer.style.left =
      beachPlayerX + "%";

    beachPlayer.classList.toggle(
      "walking",
      movingLeft || movingRight
    );
  } else {
    beachPlayer.classList.remove("walking");
  }

  /*
    O texto aparece organicamente
    quando ela chega perto da caixa.
  */
  if (
    !finalFlowersDelivered &&
    !depositingFlowers &&
    isBeachPlayerNearBox()
  ) {
    if (beachIntro) {
      beachIntro.classList.add("show");
    }

    if (flowerDropBox) {
      flowerDropBox.classList.add("ready");
    }

    beachHintShown = true;
  } else if (!depositingFlowers) {
    if (beachIntro) {
      beachIntro.classList.remove("show");
    }

    if (flowerDropBox) {
      flowerDropBox.classList.remove("ready");
    }
  }
}


function depositFinalFlowers() {
  if (
    !beachMode ||
    depositingFlowers ||
    finalFlowersDelivered ||
    !flowerDropBox
  ) {
    return;
  }

  /*
    Clicar/tocar na caixa já inicia a entrega.
    A proximidade serve apenas para mostrar
    o aviso e o brilho da caixa.
  */

  depositingFlowers = true;
  beachCutscene = true;
  document.body.classList.add("cutscene");

  movingLeft = false;
  movingRight = false;

  flowerDropBox.classList.remove("ready");
  flowerDropBox.classList.add("depositing");

  if (beachIntro) {
    beachIntro.classList.remove("show");
  }

  /*
    Os primeiros entram rápidos.
    Os últimos desaceleram.
    O 13º tem uma entrada especial.
  */
  function dropNextFlower() {
    if (flowers <= 0) {
      finishFlowerDeposit();
      return;
    }

    const isLast =
      flowers === 1;

    makeFlyingFlower(isLast);

    flowers--;

    updateHUD();
    updateBeachCounter();

    let delay = 150;

    if (flowers <= 3) {
      delay = 360;
    }

    if (flowers <= 1) {
      delay = 620;
    }

    if (isLast) {
      delay = 1100;
    }

    setTimeout(
      dropNextFlower,
      delay
    );
  }

  dropNextFlower();
}


function finishFlowerDeposit() {
  hasKey = false;

  updateHUD();
  updateBeachCounter();

  depositingFlowers = false;
  finalFlowersDelivered = true;

  flowerDropBox.classList.remove("depositing");
  flowerDropBox.classList.add("complete");

  setTimeout(function() {
    if (beachCounter) {
      beachCounter.classList.add("gone");
    }
  }, 450);

  setTimeout(function() {
    flowerDropBox.classList.add("gone");
  }, 1000);

  setTimeout(function() {
    if (beachPlayer) {
      beachPlayer.style.transform = "scaleX(1)";
    }
  }, 1350);

  /* Nat entra caminhando. */
  setTimeout(function() {
    if (natCharacter) {
      natCharacter.classList.add("show");
      natCharacter.classList.add("walk");
    }
  }, 1500);

  /* Ei. */
  setTimeout(function() {
    if (natSpeech) {
      natSpeech.textContent = "Ei.";
      natSpeech.classList.add("show");
    }
  }, 4800);

  setTimeout(function() {
    if (natSpeech) {
      natSpeech.classList.remove("show");
    }
  }, 5700);

  /* Isso é pra você. */
  setTimeout(function() {
    if (natSpeech) {
      natSpeech.textContent = "Isso é pra você.";
      natSpeech.classList.add("show");
    }
  }, 6200);

  setTimeout(function() {
    if (natSpeech) {
      natSpeech.classList.remove("show");
    }
  }, 7700);

  /* E acabou: buquê grandão brilhando com as duas juntas. */
  setTimeout(showFinalBouquet, 8200);
}


function spawnBouquetSparkles() {
  if (!finalBouquet) return;

  const rect = finalBouquet.getBoundingClientRect();

  const spots = [
    [0.18, 0.25],
    [0.80, 0.22],
    [0.10, 0.55],
    [0.90, 0.50],
    [0.30, 0.08],
    [0.68, 0.10]
  ];

  spots.forEach(function(spot, index) {
    setTimeout(function() {
      const star = document.createElement("span");
      star.className = "bouquetSparkle";
      star.textContent = index % 2 === 0 ? "✦" : "✨";
      star.style.left = (rect.left + rect.width * spot[0]) + "px";
      star.style.top = (rect.top + rect.height * spot[1]) + "px";
      document.body.appendChild(star);

      setTimeout(function() {
        star.remove();
      }, 950);
    }, index * 90);
  });
}

function spawnBouquetFlowerPops() {
  if (!finalBouquet) return;

  const rect =
    finalBouquet.getBoundingClientRect();

  const points = [
    [0.50, 0.18],
    [0.34, 0.24],
    [0.66, 0.24],
    [0.22, 0.35],
    [0.45, 0.36],
    [0.76, 0.36],
    [0.30, 0.48],
    [0.58, 0.48],
    [0.82, 0.50],
    [0.18, 0.58],
    [0.42, 0.60],
    [0.68, 0.62],
    [0.52, 0.72]
  ];

  points.forEach(function(point, index) {
    setTimeout(function() {
      const f =
        document.createElement("span");

      f.className =
        "bouquetFlowerPop";

      f.textContent =
        "🌻";

      f.style.left =
        (
          rect.left +
          rect.width * point[0]
        ) + "px";

      f.style.top =
        (
          rect.top +
          rect.height * point[1]
        ) + "px";

      document.body.appendChild(f);

      setTimeout(function() {
        f.remove();
      }, 700);

    }, index * 55);
  });
}


let bouquetGlowTimer = null;

function showFinalBouquet() {
  if (!finalBouquet) return;

  finalBouquet.classList.add("show", "final-big");

  spawnBouquetFlowerPops();
  spawnBouquetSparkles();

  /* Brilhinhos continuam no último frame. */
  bouquetGlowTimer = setInterval(function() {
    spawnBouquetSparkles();
  }, 2100);

  /* Mensagem final entra depois do buquê. */
  setTimeout(function() {
    if (finalThankYou) {
      finalThankYou.classList.add("show");
    }
  }, 2200);

  /* O botão aparece só depois da mensagem. */
  setTimeout(function() {
    if (backToStartBtn) {
      backToStartBtn.classList.add("show");
    }
  }, 4300);
}


if (flowerDropBox) {
  flowerDropBox.addEventListener("click", depositFinalFlowers);

  flowerDropBox.addEventListener("touchstart", function(e) {
    e.preventDefault();
    depositFinalFlowers();
  }, { passive: false });

  flowerDropBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      depositFinalFlowers();
    }
  });
}



/* =====================
   LOOP PRINCIPAL
===================== */

function gameLoop() {

  previousX =
    positionX;


  previousY =
    positionY;


  /*
    Depois de entrar na porta
    o jogo congela enquanto o fade acontece.
  */

  if (beachMode) {

    updateBeachPlayer();

    requestAnimationFrame(
      gameLoop
    );

    return;

  }


  if (finalDoorEntered) {

    player.style.left =
      positionX + "px";

    player.style.bottom =
      positionY + "px";

    updateCamera();

    requestAnimationFrame(
      gameLoop
    );

    return;

  }




  /* =====================
     CAINDO
  ===================== */

  if (falling) {

    positionY +=
      velocityY;


    velocityY -=
      gravity;


    player.style.bottom =
      positionY + "px";


    if (
      positionY < -500
    ) {

      respawn();

    }


    requestAnimationFrame(
      gameLoop
    );


    return;

  }


  /* =====================
     MOVIMENTO
  ===================== */

  if (movingRight) {

    positionX +=
      speed;


    player.style.transform =
      "scaleX(1)";

  }


  if (movingLeft) {

    positionX -=
      speed;


    player.style.transform =
      "scaleX(-1)";

  }


  positionX =
    Math.max(
      -80,
      Math.min(
        worldWidth - 180,
        positionX
      )
    );


  /* =====================
     CAIXOTE EMPURRÁVEL
  ===================== */

  handlePushable();


  /* =====================
     COLISÕES LATERAIS
  ===================== */

  platforms.forEach(
    function(platform) {

      blockHorizontal(
        platformBox(platform)
      );

    }
  );


  floatingCrates.forEach(
    function(crate) {

      blockHorizontal(
        floatingBox(crate)
      );

    }
  );


  blockHorizontal(
    puzzleBox()
  );


  blockHorizontal(
    pushableBox()
  );


  if (returnCrate) {

    blockHorizontal(
      returnCrateBox()
    );

  }


  if (temporaryActive) {

    temporaryPlatforms.forEach(
      function(platform) {

        blockHorizontal(
          temporaryPlatformBox(
            platform
          )
        );

      }
    );

  }


  /* =====================
     PLATAFORMA MÓVEL
  ===================== */

  updateRisingPlatform();

  updateMovingCloud();

  if (movingCloud) {
    blockHorizontal(cloudBox());
  }


  /* =====================
     SUPORTES
  ===================== */

  const supports = [

    ...Array.from(
      platforms,
      platformBox
    ),

    ...Array.from(
      floatingCrates,
      floatingBox
    ),

    puzzleBox(),

    pushableBox(),

    riverLogBox(),

    risingBox()

  ];


  if (returnCrate) {

    supports.push(
      returnCrateBox()
    );

  }

  if (movingCloud) {
    supports.push(cloudBox());
  }


  if (temporaryActive) {

    temporaryPlatforms.forEach(
      function(platform) {

        supports.push(
          temporaryPlatformBox(
            platform
          )
        );

      }
    );

  }


  /*
    Se estava em cima de algo
    e saiu da borda, cai.
  */

  if (
    grounded &&
    playerBox().bottom >
    groundTop + 5
  ) {

    const supported =
      supports.some(
        standingOn
      );


    if (!supported) {

      grounded = false;

      velocityY = 0;

    }

  }


  /* =====================
     GRAVIDADE
  ===================== */

  if (!grounded) {

    positionY +=
      velocityY;


    velocityY -=
      gravity;

  }


  /* =====================
     CABEÇADA
  ===================== */

  hitFloatingCrates();


  /* =====================
     POUSOS
  ===================== */

  let landed =
    mushroomBounce();


  /*
    Plataformas normais
  */

  if (!landed) {

    for (
      const platform of platforms
    ) {

      if (
        tryLanding(
          platformBox(
            platform
          )
        )
      ) {

        landed = true;

        break;

      }

    }

  }


  /*
    Caixotes flutuantes
  */

  if (!landed) {

    for (
      const crate of floatingCrates
    ) {

      if (
        tryLanding(
          floatingBox(
            crate
          )
        )
      ) {

        landed = true;

        break;

      }

    }

  }


  /*
    Caixote empurrável
  */

  if (!landed) {

    landed =
      tryLanding(
        pushableBox()
      );

  }


  /*
    Paredão
  */

  if (!landed) {

    landed =
      tryLanding(
        puzzleBox()
      );

  }


  /*
    Caixote para voltar
  */

  if (
    !landed &&
    returnCrate
  ) {

    landed =
      tryLanding(
        returnCrateBox()
      );

  }


  /*
    Plataformas temporárias
  */

  if (
    !landed &&
    temporaryActive
  ) {

    for (
      const platform of temporaryPlatforms
    ) {

      if (
        tryLanding(
          temporaryPlatformBox(
            platform
          )
        )
      ) {

        landed = true;

        break;

      }

    }

  }


  /*
    Tronco do rio
  */

  if (!landed) {

    landed =
      tryLanding(
        riverLogBox()
      );

  }


  /*
    Plataforma elevatória
  */

  if (!landed) {

    landed =
      tryLanding(
        risingBox()
      );

  }


  /* Nuvem móvel */

  if (
    !landed &&
    movingCloud
  ) {
    landed =
      tryLanding(
        cloudBox()
      );
  }


  /* =====================
     CHÃO / BURACO / RIO
  ===================== */

  if (
    !landed &&
    playerBox().bottom <=
    groundTop
  ) {

    if (
      overDanger()
    ) {

      startFall();

    }

    else {

      positionY =
        groundTop -
        feetOffsetY;


      velocityY = 0;

      grounded = true;

    }

  }


  /* =====================
     INTERAÇÕES
  ===================== */

  checkButton();


  checkTemporaryButton();


  updateTemporaryPlatforms();


  checkKey();


  /*
    O fujão precisa atualizar
    ANTES da coleta.
  */

  updateRunnerSunflower();


  checkFlowers();

  revealFinalButtonIfReady();

  checkFinalButton();

  checkFinalDoor();


  checkBush();


  checkCheckpoints();


  updateFireflies();


/* AVES */

updateBirds(performance.now());

checkBirdCollision();

  /* =====================
     DESENHAR
  ===================== */

  player.style.left =
    positionX + "px";


  player.style.bottom =
    positionY + "px";


  updateCamera();


  requestAnimationFrame(
    gameLoop
  );

}


/* =====================
   INÍCIO
===================== */

if (pushableCrate) {

  pushableCrate.style.left =
    pushableX + "px";

}


if (risingPlatform) {

  risingPlatform.style.bottom =
    risingBottom + "px";

}


updateHUD();


gameLoop();

/* VOLTAR AO INÍCIO
   Por enquanto recarrega o jogo.
   Quando a tela inicial for criada, este mesmo botão será ligado a ela. */
if (backToStartBtn) {
  backToStartBtn.addEventListener("click", function() {
    window.location.reload();
  });
}


/* =====================================================
   TELA INICIAL + TELA DA MISSÃO
===================================================== */

const startScreen =
  document.getElementById("startScreen");

const startGameBtn =
  document.getElementById("startGameBtn");

const howToPlayBtn =
  document.getElementById("howToPlayBtn");

const charactersBtn =
  document.getElementById("charactersBtn");

const mainCharacterCard =
  document.getElementById("mainCharacterCard");

const sarahQuickProfile =
  document.getElementById("sarahQuickProfile");

const howToPlayPopup =
  document.getElementById("howToPlayPopup");

const charactersPopup =
  document.getElementById("charactersPopup");

const popupCloseButtons =
  document.querySelectorAll("[data-close-popup]");

const missionScreen =
  document.getElementById("missionScreen");

const beginAdventureBtn =
  document.getElementById("beginAdventureBtn");


function closeMenuPopups() {
  document
    .querySelectorAll(".menuPopup.open")
    .forEach(function(popup) {
      popup.classList.remove("open");
    });
}


function openMenuPopup(popup) {
  if (!popup) return;

  closeMenuPopups();
  popup.classList.add("open");
}


/* INICIAR -> abre a missão */
if (startGameBtn) {
  startGameBtn.addEventListener(
    "click",
    function() {

      closeMenuPopups();

      if (startScreen) {
        startScreen.classList.add("hide");
      }

      setTimeout(function() {
        if (missionScreen) {
          missionScreen.classList.add("show");
        }
      }, 300);

    }
  );
}


/* COMEÇAR A AVENTURA -> libera o jogo */
if (beginAdventureBtn) {
  beginAdventureBtn.addEventListener(
    "click",
    function() {

      if (missionScreen) {
        missionScreen.classList.remove("show");
      }

      document.body.classList.remove("menu-open");

    }
  );
}


if (mainCharacterCard) {
  mainCharacterCard.addEventListener(
    "click",
    function() {
      openMenuPopup(sarahQuickProfile);
    }
  );
}


if (howToPlayBtn) {
  howToPlayBtn.addEventListener(
    "click",
    function() {
      openMenuPopup(howToPlayPopup);
    }
  );
}


if (charactersBtn) {
  charactersBtn.addEventListener(
    "click",
    function() {
      openMenuPopup(charactersPopup);
    }
  );
}


popupCloseButtons.forEach(
  function(button) {
    button.addEventListener(
      "click",
      closeMenuPopups
    );
  }
);


/* clicar fora da caixinha fecha */
document
  .querySelectorAll(".menuPopup")
  .forEach(function(popup) {

    popup.addEventListener(
      "click",
      function(e) {

        if (e.target === popup) {
          closeMenuPopups();
        }

      }
    );

  });
