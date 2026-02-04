// Simple state machine to move through the experience.
const card = document.getElementById("card");

const honestyLines = [
  "I replay conversations.",
  "I worry I said the wrong thing.",
  "I care deeply, even when it scares me.",
];

let honestyIndex = 0;

const steps = {
  intro: () => renderStep(`
      <h1>Will you be my Valentine?</h1>
      <div class="buttons">
        <button data-action="yes">Yes</button>
        <button data-action="no" class="secondary" id="no-button">No</button>
      </div>
      <p class="note" id="no-note" aria-live="polite"></p>
    `, attachIntroHandlers),

  confirm: () => renderStep(`
      <h1>Are you sure? Like… actually sure?</h1>
      <div class="buttons">
        <button data-action="sure">Yes, I’m sure</button>
        <button data-action="pause" class="secondary">I need a second</button>
      </div>
      <p class="note" id="pause-note" aria-live="polite"></p>
    `, attachConfirmHandlers),

  confession: () => {
    renderStep(`
      <h1 id="confession-line">I should tell you something.</h1>
      <p id="confession-detail" class="note"></p>
      <div class="buttons" id="confession-buttons" hidden>
        <button data-action="ok">Okay</button>
      </div>
    `);
    setTimeout(() => {
      const detail = document.getElementById("confession-detail");
      detail.textContent = "I overthink. A lot.";
      document.getElementById("confession-buttons").hidden = false;
      attachConfessionHandlers();
    }, 1100);
  },

  honesty: () => renderStep(`
      <h1>${honestyLines[honestyIndex]}</h1>
      <div class="buttons">
        <button data-action="still">Still here</button>
      </div>
    `, attachHonestyHandlers),

  finalChoice: () => {
    renderStep(`
      <h1>Knowing all that…</h1>
      <p id="final-prompt" class="note"></p>
      <div class="buttons" id="final-buttons" hidden>
        <button data-action="choose">Yes</button>
      </div>
    `);
    setTimeout(() => {
      const prompt = document.getElementById("final-prompt");
      prompt.textContent = "Do you still choose me?";
      document.getElementById("final-buttons").hidden = false;
      attachFinalHandlers();
    }, 900);
  },

  letter: () => renderStep(`
      <h1>Thank you for choosing me.</h1>
      <p>
        [Your personal message goes here] I want you to know that I see you,
        I choose you, and I’m grateful for every calm, safe moment we share.
        If you ever need more time or space, I’ll still be here—steady and
        honest, always cheering for us.
      </p>
      <div class="footer">Built for one player only.</div>
    `),
};

function renderStep(html, onMount) {
  card.classList.add("fade-out");
  setTimeout(() => {
    card.innerHTML = html;
    card.classList.remove("fade-out");
    card.classList.add("fade-in");
    if (onMount) onMount();
  }, 250);
}

function attachIntroHandlers() {
  const noButton = document.getElementById("no-button");
  const note = document.getElementById("no-note");

  noButton.addEventListener("mouseenter", () => {
    const offsetX = Math.random() * 30 - 15;
    const offsetY = Math.random() * 20 - 10;
    noButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    note.textContent = "That was my anxiety talking.";
  });

  noButton.addEventListener("mouseleave", () => {
    noButton.style.transform = "translate(0, 0)";
  });

  card.querySelector("[data-action='yes']").addEventListener("click", () => {
    steps.confirm();
  });
}

function attachConfirmHandlers() {
  const pauseNote = document.getElementById("pause-note");

  card.querySelector("[data-action='sure']").addEventListener("click", () => {
    steps.confession();
  });

  card.querySelector("[data-action='pause']").addEventListener("click", () => {
    pauseNote.textContent = "Take your time. I’ll still be here.";
    setTimeout(() => {
      steps.confession();
    }, 1600);
  });
}

function attachConfessionHandlers() {
  card.querySelector("[data-action='ok']").addEventListener("click", () => {
    steps.honesty();
  });
}

function attachHonestyHandlers() {
  card.querySelector("[data-action='still']").addEventListener("click", () => {
    honestyIndex += 1;
    if (honestyIndex < honestyLines.length) {
      steps.honesty();
    } else {
      steps.finalChoice();
    }
  });
}

function attachFinalHandlers() {
  card.querySelector("[data-action='choose']").addEventListener("click", () => {
    steps.letter();
  });
}

// Start the experience.
steps.intro();
